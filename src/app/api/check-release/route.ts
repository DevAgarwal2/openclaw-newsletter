import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getProcessedRelease } from '@/lib/ai-processor';

// This endpoint is called by Vercel Cron every 5 minutes
// It fetches the latest release and pre-processes it with AI

export async function GET() {
  // Verify this is a cron job request (Vercel adds this header)
  const authHeader = headers().get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Fetch latest release from GitHub
    const response = await fetch('https://api.github.com/repos/openclaw/openclaw/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenClaw-Newsletter'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release = await response.json();
    
    // Process with AI (this caches the result)
    await getProcessedRelease({
      tag_name: release.tag_name,
      name: release.name,
      body: release.body,
      published_at: release.published_at,
      html_url: release.html_url,
    });

    return NextResponse.json({
      success: true,
      data: {
        version: release.tag_name,
        processed: true,
        checked_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
