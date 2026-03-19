import { NextResponse } from 'next/server';
import { getProcessedRelease } from '@/lib/ai-processor';

export async function GET() {
  try {
    // Fetch latest release from GitHub
    const response = await fetch('https://api.github.com/repos/openclaw/openclaw/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenClaw-Newsletter'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release = await response.json();
    
    // Process with AI
    const processedContent = await getProcessedRelease({
      tag_name: release.tag_name,
      name: release.name,
      body: release.body,
      published_at: release.published_at,
      html_url: release.html_url,
    });

    return new NextResponse(processedContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      }
    });
  } catch (error) {
    console.error('Error generating heartbeat:', error);
    
    // Fallback response
    const fallback = `# OpenClaw Daily Briefing
# ${new Date().toISOString().split('T')[0]}

## Status
⚠️ Temporarily unable to fetch latest release

## What to do
Check https://github.com/openclaw/openclaw/releases/latest directly

---
*Error: ${error instanceof Error ? error.message : 'Unknown error'}*
`;

    return new NextResponse(fallback, {
      headers: {
        'Content-Type': 'text/markdown',
        'Cache-Control': 'public, max-age=60'
      },
      status: 200
    });
  }
}
