import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: {
        tag_name: release.tag_name,
        name: release.name,
        body: release.body,
        published_at: release.published_at,
        html_url: release.html_url,
        author: release.author?.login,
        tarball_url: release.tarball_url,
        zipball_url: release.zipball_url
      }
    });
  } catch (error) {
    console.error('Error fetching release:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch release'
      },
      { status: 500 }
    );
  }
}
