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
    
    return NextResponse.json({ videos: videoFiles });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read videos directory' }, { status: 500 });
  }
}