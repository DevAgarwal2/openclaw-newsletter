import OpenAI from 'openai';
import { prisma } from './prisma';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://openclaw-newsletter-agent.vercel.app',
    'X-Title': 'OpenClaw Updates',
  },
};

interface ChangelogEntry {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

export async function processChangelogWithAI(release: ChangelogEntry): Promise<string> {
  const prompt = `You are an expert technical writer who specializes in making release notes actually useful for developers and AI agents.

Take the following OpenClaw release notes and transform them into a Reddit-style post that focuses on USE CASES and WORKFLOWS, not just technical details.

The tone should be:
- Conversational but informative
- Like a developer sharing insights with their community
- Focused on "what this means for you" not "what changed in the code"

Format it like this (NO markdown formatting like ** or ---, use plain text):

OpenClaw ${release.tag_name} Release Notes - What Actually Matters

I read the ${release.tag_name} release notes so you don't have to - here's what actually matters for your workflows.

Use Cases

[Break down the changes into 3-5 use cases. For each one:]

1. [Use Case Name]
From the changelog: [Quote the relevant changelog item]

What that means for you: [Explain in plain English what this enables]

Use-case angle: [Give specific examples of how someone might use this]

[Repeat for other use cases...]

TL;DR

[Bullet points of the most important changes]

When to Update

[Tell them if this is a "must update", "nice to have", or "wait if you're stable"]

Here are the raw release notes:

Title: ${release.name}
Date: ${release.published_at}

${release.body}

Transform this into the format above. Be specific about use cases and workflows. Don't just list features - explain why they matter.

IMPORTANT RULES:
- Use plain text formatting only, NO markdown symbols like ** or ---
- Use ONLY basic ASCII characters (A-Z, a-z, 0-9, spaces, hyphens, periods)
- NO special characters like em-dashes, en-dashes, smart quotes, or unicode symbols
- Use simple hyphens (-) instead of dashes
- Use straight quotes (") instead of curly quotes
- Keep it clean and readable with simple formatting`;


  try {
    const response = await openai.chat.completions.create({
      model: 'arcee-ai/trinity-large-preview:free',
      messages: [
        {
          role: 'system',
          content: 'You are a technical writer who makes release notes accessible and actionable. Focus on use cases, workflows, and practical value.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || generateFallbackSummary(release);
  } catch (error) {
    console.error('Error processing changelog with AI:', error);
    return generateFallbackSummary(release);
  }
}

function generateFallbackSummary(release: ChangelogEntry): string {
  const changes = release.body
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .slice(0, 10)
    .map(line => line.trim())
    .join('\n');

  return `OpenClaw ${release.tag_name} Release Notes

Published: ${new Date(release.published_at).toLocaleDateString()}

What's New

${changes}

View full release notes on GitHub: ${release.html_url}

Note: AI processing temporarily unavailable. Showing raw changelog.`;
}

// Get or create processed release from database
export async function getProcessedRelease(release: ChangelogEntry): Promise<string> {
  // Check database first
  let dbRelease = await prisma.release.findUnique({
    where: { tagName: release.tag_name },
  });

  if (dbRelease?.aiSummary) {
    return dbRelease.aiSummary;
  }

  // Process with AI
  const summary = await processChangelogWithAI(release);

  // Save to database
  if (dbRelease) {
    dbRelease = await prisma.release.update({
      where: { tagName: release.tag_name },
      data: {
        aiSummary: summary,
        processedAt: new Date(),
      },
    });
  } else {
    dbRelease = await prisma.release.create({
      data: {
        tagName: release.tag_name,
        name: release.name,
        body: release.body,
        publishedAt: new Date(release.published_at),
        htmlUrl: release.html_url,
        aiSummary: summary,
        processedAt: new Date(),
      },
    });
  }

  return summary;
}

// Fetch and store latest release from GitHub
export async function fetchAndStoreLatestRelease(): Promise<void> {
  try {
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

    // Check if we already have this release
    const existing = await prisma.release.findUnique({
      where: { tagName: release.tag_name },
    });

    if (!existing) {
      // Store release and generate AI summary
      await getProcessedRelease({
        tag_name: release.tag_name,
        name: release.name,
        body: release.body,
        published_at: release.published_at,
        html_url: release.html_url,
      });
      console.log(`Stored new release: ${release.tag_name}`);
    } else if (!existing.aiSummary) {
      // Generate summary if missing
      await getProcessedRelease({
        tag_name: release.tag_name,
        name: release.name,
        body: release.body,
        published_at: release.published_at,
        html_url: release.html_url,
      });
      console.log(`Generated AI summary for: ${release.tag_name}`);
    }
  } catch (error) {
    console.error('Error fetching/storing release:', error);
  }
}