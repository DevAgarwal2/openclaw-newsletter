import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the latest processed release from database
    const release = await prisma.release.findFirst({
      orderBy: { publishedAt: 'desc' },
    });

    if (release?.aiSummary) {
      // Return cached AI summary
      return new NextResponse(release.aiSummary, {
        headers: {
          'Content-Type': 'text/markdown',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    // Fallback: fetch from GitHub directly
    const response = await fetch('https://api.github.com/repos/openclaw/openclaw/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenClaw-Newsletter'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const githubRelease = await response.json();
    
    return new NextResponse(githubRelease.body, {
      headers: {
        'Content-Type': 'text/markdown',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    
    return new NextResponse(
      `Error: Unable to fetch OpenClaw release summary. Please try again later.`,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=60'
        },
        status: 200
      }
    );
  }
}