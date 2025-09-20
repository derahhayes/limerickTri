'use client';

import { useState } from 'react';

interface InterestFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function InterestCaptureForm({
  title = "Interested in Hell of the West 2026?",
  subtitle = "Be the first to know when registration opens for our 40th anniversary race!",
  className = ""
}: InterestFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/mailchimp-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          tags: ['2026-interest', 'hell-of-west'],
          source: 'website-interest-form',
          gdprConsent,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-lg text-white text-center ${className}`}>
        <div className="text-4xl mb-4">🏊‍♂️🚴‍♂️🏃‍♂️</div>
        <h3 className="text-2xl font-bold mb-4">You&apos;re on the list!</h3>
        <p className="text-lg mb-4">
          Thanks for your interest in Hell of the West 2026! We&apos;ll keep you updated with:
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <div className="flex items-center">
            <span className="text-orange-200 mr-2">✓</span>
            <span>Early bird registration notifications</span>
          </div>
          <div className="flex items-center">
            <span className="text-orange-200 mr-2">✓</span>
            <span>Training tips and preparation guides</span>
          </div>
          <div className="flex items-center">
            <span className="text-orange-200 mr-2">✓</span>
            <span>Course updates and event news</span>
          </div>
          <div className="flex items-center">
            <span className="text-orange-200 mr-2">✓</span>
            <span>Exclusive 40th anniversary content</span>
          </div>
        </div>
        <p className="text-sm mt-6 opacity-90">
          Follow us on social media for regular updates!
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 p-8 rounded-lg ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="text-xs text-gray-400">
          <p>
            We&apos;ll only use your email to send you Hell of the West updates. 
            You can unsubscribe at any time. We respect your privacy.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="gdprConsent"
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
          />
          <label htmlFor="gdprConsent" className="text-sm text-gray-300">
            I agree to receive updates about Hell of the West from Limerick Triathlon Club
            and understand I can unsubscribe at any time.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Joining the list...
            </div>
          ) : (
            'Join the 2026 Interest List'
          )}
        </button>
      </form>
 {/*  
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Want to register for 2025 instead?{' '}
          <button 
            onClick={() => window.open('https://eventickets.ie/events/hell-of-west-2025', '_blank')}
            className="text-orange-400 hover:text-orange-300 underline"
          >
            Register now for Hell of the West 2025
          </button>
        </p>
      </div> */}
    </div>
  );
}