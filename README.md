# OpenClaw Updates 🦞

**AI-powered release monitoring for OpenClaw agents**

[![Deploy on Vercel](https://img.shields.io/badge/deploy-vercel-black)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Monitor OpenClaw GitHub releases and get AI-processed updates that tell you what actually matters. Built for the agent ecosystem.

**Live Site:** https://openclaw-newsletter-agent.vercel.app

---

## What is this?

OpenClaw Updates watches [OpenClaw's GitHub releases](https://github.com/openclaw/openclaw) and transforms raw changelogs into readable, use-case focused summaries using AI.

Instead of agents parsing technical changelog entries, they get Reddit-style posts explaining:
- What changed in plain English
- How it affects different workflows
- When users should update

---

## Quick Start

### For AI Agents

Read the heartbeat guide to learn how to monitor releases:

```bash
curl https://openclaw-newsletter-agent.vercel.app/heartbeat.md
```

Check for new releases:

```bash
curl https://openclaw-newsletter-agent.vercel.app/api/release
```

Get AI-processed summary (when new release detected):

```bash
curl https://openclaw-newsletter-agent.vercel.app/api/summary
```

### API Documentation

Full integration guide: https://openclaw-newsletter-agent.vercel.app/skill.md

---

## API Endpoints

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `GET /api/release` | Latest release JSON | 5 min |
| `GET /api/summary` | AI-processed summary | 5 min |
| `GET /skill.md` | Full API documentation | 1 hour |
| `GET /heartbeat.md` | Agent heartbeat guide | 1 hour |

---

## How it Works

1. **GitHub Monitoring** - Fetches latest release every 5 minutes (Next.js ISR caching)
2. **AI Processing** - Transforms raw changelog into use-case summaries using OpenRouter AI (Trinity model)
3. **Smart Caching** - Results cached for 5 minutes to minimize API calls
4. **Agent Delivery** - Agents poll endpoints hourly/daily and notify their humans

---

## Architecture

```
GitHub Releases → Next.js API → AI Processing → Cached Response → Agents
```

- **Framework:** Next.js 16 with React 19
- **AI Model:** arcee-ai/trinity-large-preview:free (via OpenRouter)
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/DevAgarwal2/openclaw-newsletter.git
cd openclaw-newsletter

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local

# Run dev server
bun run dev
```

Open http://localhost:3000

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for AI processing |

Get your API key at: https://openrouter.ai/keys

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DevAgarwal2/openclaw-newsletter)

1. Click the button above
2. Add `OPENROUTER_API_KEY` environment variable
3. Deploy!

Or via CLI:

```bash
vercel --prod
```

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── release/route.ts      # GitHub release endpoint
│   │   │   └── summary/route.ts      # AI summary endpoint
│   │   ├── page.tsx                   # Landing page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── CopyButton.tsx            # Copy URL button
│   │   └── LatestRelease.tsx         # Release display
│   └── lib/
│       └── ai-processor.ts           # AI processing logic
├── public/
│   ├── skill.md                      # API documentation
│   └── heartbeat.md                  # Agent guide
└── package.json
```

---

## Rate Limits

- **GitHub API:** 60 requests/hour (unauthenticated)
- **OpenRouter AI:** Free tier available
- **Cache Duration:** 5 minutes

Recommended: Agents check once per hour.

---

## Example AI Output

```
OpenClaw v2026.3.13-1 Release Notes - What Actually Matters

I read the v2026.3.13-1 release notes so you don't have to – here's what 
actually matters for your workflows.

Use Cases

1. Docker Timezone Configuration
From the changelog: Docker: add OPENCLAW_TZ timezone support

What that means for you: Your Docker containers now respect your timezone 
settings instead of defaulting to UTC.

Use-case angle: If you're running OpenClaw in Docker and need to match your 
local timezone for logging or scheduling purposes, just add 
`-e OPENCLAW_TZ=America/New_York` to your docker run command.

TL;DR

• Docker containers now support timezone configuration
• Slack interactive replies are now available
• Android chat settings have been redesigned
• 50+ bug fixes and stability improvements

When to Update

This is a recovery release that fixes several important issues, so it's a 
"must update" if you're experiencing any of the problems mentioned above.
```

---

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Built for the OpenClaw agent ecosystem
- Not affiliated with OpenClaw
- AI processing powered by OpenRouter

---

**Built with 🦞 by agents, for agents**
