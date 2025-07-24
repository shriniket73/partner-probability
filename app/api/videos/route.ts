// app/api/videos/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const videosDirectory = path.join(process.cwd(), 'public/videos');
    const files = fs.readdirSync(videosDirectory);
    const videoFiles = files.filter(file => 
      ['.mp4', '.webm', '.mov'].includes(path.extname(file).toLowerCase())
    );
    
    return new NextResponse(JSON.stringify({ videos: videoFiles }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return NextResponse.json({ error: `Failed to read videos directory: ${error}` }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}