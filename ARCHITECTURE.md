# OpenClaw Updates - System Architecture

## State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPENCLAW UPDATES SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────────┘


┌──────────────┐
│    START     │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────┐
│ 1. GITHUB MONITORING            │  ← Every 5 minutes (Vercel Cron)
│    Fetch /repos/openclaw/       │
│    openclaw/releases/latest     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ 2. NEW RELEASE?                 │
│    Compare tag_name with        │
│    cached version               │
└──────┬──────────────────────────┘
       │
       ├────────── YES ───────────┐
       │                          ▼
       │ NO              ┌─────────────────────────────┐
       │                 │ 3. AI PROCESSING            │
       │                 │    Send raw changelog to    │
       │                 │    OpenRouter AI            │
       │                 │                             │
       │                 │    Model:                   │
       │                 │    arcee-ai/trinity-        │
       │                 │    large-preview:free       │
       │                 └──────┬──────────────────────┘
       │                        │
       ▼                        ▼
┌─────────────────┐    ┌─────────────────────────────┐
│ 4. SKIP         │    │ 4. GENERATE REDDIT-STYLE    │
│    No changes   │    │    SUMMARY                  │
│    Keep cached  │    │    • Use cases focus        │
│    version      │    │    • Workflow impacts       │
│                 │    │    • Plain English          │
└──────┬──────────┘    └──────┬──────────────────────┘
       │                        │
       │                        ▼
       │               ┌─────────────────────────────┐
       │               │ 5. CACHE RESULT             │
       │               │    Store processed          │
       │               │    summary in memory        │
       │               └──────┬──────────────────────┘
       │                        │
       └────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │ 6. AGENT REQUESTS           │  ← Agent calls API
                    │    GET /api/release         │
                    │    OR                       │
                     │    GET /heartbeat.md        │
                    └──────┬──────────────────────┘
                           │
                           ▼
                    ┌─────────────────────────────┐
                    │ 7. SERVE CACHED DATA        │
                    │    • /api/release → JSON    │
                     │    • /heartbeat.md → Markdown  │
                    │      (AI-processed)         │
                    └──────┬──────────────────────┘
                           │
                           ▼
                    ┌─────────────────────────────┐
                    │ 8. AGENT NOTIFIES HUMAN     │
                    │    "New OpenClaw release:   │
                    │     2026.3.13 🦞"            │
                    └─────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   GitHub     │────▶│   Vercel     │────▶│   OpenRouter │────▶│   Agent      │
│   Releases   │     │   Cron Job   │     │   AI (Free)  │     │   (User)     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       │ 1. Raw             │ 2. Trigger         │ 3. Transform       │ 4. Notify
       │    Changelog       │    every 5min      │    to Reddit       │    Human
       │                    │                    │    style           │
       │                    │                    │                    │


┌─────────────────────────────────────────────────────────────────────────────┐
│                           API ENDPOINTS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ GET /api/release                                                             │
│ ├── Fetches from GitHub API                                                  │
│ ├── Cache: 5 minutes                                                         │
│ └── Returns: Raw release JSON                                                │
│                                                                              │
│ GET /heartbeat.md                                                            │
│ ├── Returns AI-processed summary (Reddit-style)                              │
│ ├── Cache: 5 minutes                                                         │
│ └── Returns: Markdown text                                                   │
│                                                                              │
│ GET /api/check-release (Cron)                                                │
│ ├── Runs every 5 minutes via Vercel Cron                                     │
│ ├── Requires: CRON_SECRET header                                             │
│ └── Pre-processes new releases with AI                                       │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                          CACHE STRATEGY                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Memory Cache (In-Memory):
┌─────────────────────────────────────────────────────────┐
│ processedReleases: Map<string, CachedRelease>          │
│                                                         │
│ Key: tag_name (e.g., "2026.3.13")                      │
│ Value: {                                                │
│   content: string,      // AI-processed markdown       │
│   processedAt: string   // ISO timestamp               │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Next.js ISR Cache:
┌─────────────────────────────────────────────────────────┐
│ API Routes:                                             │
│ • /api/release  → revalidate: 300s (5 min)             │
│ • /heartbeat.md    → revalidate: 300s (5 min)             │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI PROMPT STRUCTURE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Input: Raw GitHub Release Notes
│
▼
┌─────────────────────────────────────────────────────────┐
│ SYSTEM PROMPT:                                          │
│ "You are an expert technical writer who specializes    │
│  in making release notes actually useful for           │
│  developers and AI agents."                            │
└─────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ USER PROMPT:                                            │
│ "Take the following OpenClaw release notes and         │
│  transform them into a Reddit-style post that          │
│  focuses on USE CASES and WORKFLOWS..."                │
│                                                         │
│ Format includes:                                        │
│ - Title with version                                    │
│ - 3-5 Use Case sections                                 │
│ - "From the changelog" quotes                           │
│ - "What that means for you" explanations                │
│ - "Use-case angle" examples                             │
│ - TL;DR summary                                         │
│ - When to update guidance                               │
└─────────────────────────────────────────────────────────┘
│
▼
Output: Reddit-Style Markdown Post


┌─────────────────────────────────────────────────────────────────────────────┐
│                          ERROR HANDLING                                      │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub API Fails:
┌─────────────┐    ┌──────────────────────────────────┐
│   ERROR     │───▶│ Return fallback with raw         │
│   500/404   │    │ GitHub link for manual check     │
└─────────────┘    └──────────────────────────────────┘

AI Processing Fails:
┌─────────────┐    ┌──────────────────────────────────┐
│   ERROR     │───▶│ Return fallback with raw         │
│   Timeout   │    │ changelog (first 10 items)       │
│   or Rate   │    │                                  │
│   Limit     │    │ Note: "AI processing             │
└─────────────┘    │ temporarily unavailable"         │
                   └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           RATE LIMITS                                        │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub API:        60 requests/hour (unauthenticated)
OpenRouter AI:     Free tier (arcee-ai/trinity-large-preview:free)
Vercel Cron:       Runs every 5 minutes
Next.js Cache:     5 minutes

Total API Calls:
• GitHub: ~12/hour (cron) + user requests
• OpenRouter: Only on new releases (cached afterward)


┌─────────────────────────────────────────────────────────────────────────────┐
│                        SEQUENCE DIAGRAM                                      │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub    Vercel      OpenRouter     Cache        Agent       Human
  │          │              │             │           │          │
  │◄─────────│              │             │           │          │
  │  Cron    │              │             │           │          │
  │ (5min)   │              │             │           │          │
  │          │              │             │           │          │
  │─────────▶│              │             │           │          │
  │ Release  │              │             │           │          │
  │ Data     │              │             │           │          │
  │          │              │             │           │          │
  │          │─────────────▶│             │           │          │
  │          │ Process with │             │           │          │
  │          │ Trinity Model│             │           │          │
  │          │              │             │           │          │
  │          │◄─────────────│             │           │          │
  │          │ AI Summary   │             │           │          │
  │          │              │             │           │          │
  │          │──────────────│─────────────▶│          │          │
  │          │              │ Store in     │           │          │
  │          │              │ Memory Cache │           │          │
  │          │              │             │           │          │
  │          │              │             │◄─────────│          │
  │          │              │             │ Check for │          │
  │          │              │             │ updates   │          │
  │          │              │             │ (hourly)  │          │
  │          │              │             │           │          │
  │          │              │             │──────────▶│          │
  │          │              │             │ New       │          │
  │          │              │             │ Release!  │          │
  │          │              │             │           │          │
  │          │              │             │◄─────────│          │
  │          │              │             │ Get       │          │
  │          │              │             │ Summary   │          │
  │          │              │             │           │          │
  │          │              │             │──────────▶│          │
  │          │              │             │ "New      │          │
  │          │              │             │ OpenClaw  │          │
  │          │              │             │ 2026.3.13 │          │
  │          │              │             │ ..."      │          │
  │          │              │             │           │          │
  │          │              │             │           │─────────▶│
  │          │              │             │           │ "Hey! New│
  │          │              │             │           │ OpenClaw │
  │          │              │             │           │ update   │
  │          │              │             │           │ with use │
  │          │              │             │           │ cases..."│
  │          │              │             │           │          │
