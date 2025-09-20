// src/app/api/mailchimp-signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface MailchimpSignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  tags?: string[];
  source?: string;
  gdprConsent?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: MailchimpSignupRequest = await request.json();
    const { email, firstName, lastName, tags = [], source = 'website', gdprConsent = false } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Get Mailchimp credentials from environment variables
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., 'us1', 'us2', etc.

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
      console.error('Mailchimp configuration missing');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Mailchimp API endpoint
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    // Prepare the data for Mailchimp
    const marketingPermissionId = process.env.MAILCHIMP_MARKETING_PERMISSION_ID;
    const marketingPermissions = marketingPermissionId
      ? [
          {
            marketing_permission_id: marketingPermissionId,
            enabled: gdprConsent === true,
          },
        ]
      : undefined;

    const mailchimpData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
      tags: tags,
      // Only include GDPR marketing permissions if configured
      ...(marketingPermissions ? { marketing_permissions: marketingPermissions } : {}),
    } as const;

    // Make request to Mailchimp using Basic Auth (any username, API key as password)
    const basicAuth = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    const responseData = await response.json();

    if (response.ok) {
      // Success
      return NextResponse.json(
        { 
          message: 'Successfully added to interest list!',
          status: 'subscribed'
        },
        { status: 200 }
      );
    } else {
      // Handle Mailchimp-specific errors
      if (responseData.title === 'Member Exists') {
        return NextResponse.json(
          { message: 'You are already on our interest list! We will keep you updated.' },
          { status: 200 }
        );
      }

      console.error('Mailchimp API error:', responseData);
      return NextResponse.json(
        { 
          message: responseData.detail || 'Failed to add to interest list. Please try again.',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}