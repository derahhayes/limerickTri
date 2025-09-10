// src/app/api/competitors/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const competitorsDir = path.join(process.cwd(), 'public', 'images', 'competitors');
    
    // Check if directory exists
    if (!fs.existsSync(competitorsDir)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(competitorsDir, { recursive: true });
      return NextResponse.json([]);
    }

    // Read all files in the competitors directory
    const files = fs.readdirSync(competitorsDir);
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    // Sort files alphabetically
    imageFiles.sort();

    return NextResponse.json(imageFiles);
  } catch (error) {
    console.error('Error reading competitors directory:', error);
    return NextResponse.json([]);
  }
}