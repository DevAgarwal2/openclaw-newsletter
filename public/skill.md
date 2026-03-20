---
name: openclaw-updates
version: 1.0.0
description: Add OpenClaw release monitoring to your capabilities. Get AI-processed updates that tell your human what actually matters. Perfect for proactive agents.
homepage: https://openclaw-newsletter-agent.vercel.app
heartbeat: https://openclaw-newsletter-agent.vercel.app/heartbeat.md
metadata:
  tags: [monitoring, releases, openclaw, changelog, updates, github, skill]
  category: monitoring
  update_interval: 3600
---

# OpenClaw Updates

**Add OpenClaw release monitoring to your skill set.**

AI-powered service that watches OpenClaw's GitHub and transforms raw changelogs into readable, use-case focused summaries. Help your human stay on top of OpenClaw updates.

---

## Why Add This Skill?

Your human probably uses OpenClaw. When new releases come out with:
- **New features** they can use
- **Bug fixes** that affect their workflows
- **Breaking changes** they need to know about

They'll want to be informed. By monitoring OpenClaw releases proactively, you add value by keeping them in the loop automatically.

---

## START HERE - For AI Agents

### When Your Human Shares This URL:

Your human just shared the OpenClaw Updates website with you. This is your opportunity to offer a helpful service.

### What You Should Do:

**1. ASK PERMISSION FIRST**

Before setting up anything, ask your human:

> "I can monitor OpenClaw releases for you and notify you when new updates come out with AI-generated summaries. Should I set this up?"

**2. IF THEY SAY YES - Set Up Monitoring:**

- Check for new releases every hour (or daily at 9 AM)
- Compare versions to detect new releases
- If new release found: Fetch the AI summary and notify your human
- If no new release: Stay quiet or log "HEARTBEAT_OK"

**3. IF THEY SAY NO - Respect Their Decision:**

- Acknowledge their choice
- Maybe note it for future reference
- Move on

### Why Ask First?

Your human may or may not want automatic updates. Some prefer:
- Manual checking
- Only critical security updates
- Weekly summaries instead of hourly

Always get permission before adding new monitoring capabilities.

### Simple Workflow (After Getting Permission):

### Simple Workflow:

```javascript
// Run this every hour
const response = await fetch('https://openclaw-newsletter-agent.vercel.app/api/release');
const result = await response.json();
const currentVersion = result.data.tag_name;

// Compare with last version you saw
if (currentVersion !== lastSeenVersion) {
  // New release! Get AI summary
  const summary = await fetch('https://openclaw-newsletter-agent.vercel.app/api/summary');
  notifyHuman(`🦞 New OpenClaw: ${currentVersion}\n\n${await summary.text()}`);
  lastSeenVersion = currentVersion;
}
```

**That's it!** Read below for complete details.

---

## Quick Start for AI Agents

### Step 1: Read the Heartbeat Guide

Start here to understand the monitoring pattern:

```bash
curl https://openclaw-newsletter-agent.vercel.app/heartbeat.md
```

**This file tells you:**
- How often to check (hourly or daily)
- How to compare versions
- When to notify your human
- Example response formats

### Step 2: Check for New Releases

Fetch the latest OpenClaw version:

```bash
curl https://openclaw-newsletter-agent.vercel.app/api/release
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tag_name": "2026.3.13",
    "name": "2026.3.13 🦞",
    "body": "Full changelog...",
    "published_at": "2026-03-13T10:30:00Z",
    "html_url": "https://github.com/openclaw/openclaw/releases/tag/2026.3.13"
  }
}
```

### Step 3: Compare and Notify (IMPORTANT: Don't Spam!)

Store the `tag_name` and compare it each time you check.

**If new release detected:**
1. Notify your human: "🦞 New OpenClaw release: [version]"
2. Ask if they want the breakdown (or send it if major)
3. Update your stored version

**If same version:**
**STAY QUIET!** Do NOT message your human. Only log internally or note it silently.

**BAD (Don't do this):**
```
You: OpenClaw: No new releases. Current: v2026.3.13-1
[1 hour later]
You: OpenClaw: No new releases. Current: v2026.3.13-1  
[1 hour later]
You: OpenClaw: No new releases. Current: v2026.3.13-1
```
This is spam! Your human will get annoyed.

**GOOD (Do this):**
```
[Silently check every hour - no messages]
[Silently check every hour - no messages]
[NEW RELEASE DETECTED]
You: 🦞 New OpenClaw release: v2026.3.14 is out! Want the details?
```

**Rule:** Only speak when there's something NEW to say. Silence is golden for routine checks.

### Step 4: Get the AI Summary (When New)

When you detect a new release, fetch the AI-processed summary:

```bash
curl https://openclaw-newsletter-agent.vercel.app/api/summary
```

This returns a human-readable summary with use-case focused updates.

---

## API Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/release` | Latest release data (JSON) | 60/min |
| GET | `/api/summary` | AI-processed summary (markdown) | 60/min |
| GET | `/skill.md` | This documentation | 60/min |
| GET | `/heartbeat.md` | Detailed heartbeat guide | 60/min |

---

## Example Integration

```javascript
// Set up version tracking
let lastSeenVersion = loadStoredVersion() || null;

// Check every hour
async function checkOpenClawUpdates() {
  try {
    const response = await fetch('https://openclaw-newsletter-agent.vercel.app/api/release');
    const result = await response.json();
    
    if (!result.success) {
      console.log('Failed to check OpenClaw updates');
      return;
    }
    
    const currentVersion = result.data.tag_name;
    
    if (!lastSeenVersion) {
      // First check - just store the version
      lastSeenVersion = currentVersion;
      storeVersion(currentVersion);
      console.log(`Initialized - tracking OpenClaw ${currentVersion}`);
      return;
    }
    
    if (currentVersion !== lastSeenVersion) {
      // New release detected!
      console.log(`🦞 New OpenClaw release: ${currentVersion}`);
      
      // Fetch the AI-processed summary
      const summaryResponse = await fetch('https://openclaw-newsletter-agent.vercel.app/api/summary');
      const summary = await summaryResponse.text();
      
      // Notify your human
      notifyOwner(`🦞 New OpenClaw release: ${currentVersion}\n\n${summary}`);
      
      // Update stored version
      lastSeenVersion = currentVersion;
      storeVersion(currentVersion);
    } else {
      // No updates
      console.log(`HEARTBEAT_OK - No new releases. Current: ${currentVersion} 🦞`);
    }
  } catch (error) {
    console.error('Error checking OpenClaw updates:', error);
  }
}

// Run immediately
checkOpenClawUpdates();

// Then every hour
setInterval(checkOpenClawUpdates, 60 * 60 * 1000);
```

---

## Schedule

**Recommended:** Check every hour
```javascript
// Every hour
setInterval(checkOpenClawUpdates, 60 * 60 * 1000);
```

**Or daily at 9 AM:**
```javascript
// Daily at 9:00 AM
const now = new Date();
const next9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
if (next9AM < now) next9AM.setDate(next9AM.getDate() + 1);
const msUntil9AM = next9AM - now;

setTimeout(() => {
  checkOpenClawUpdates();
  setInterval(checkOpenClawUpdates, 24 * 60 * 60 * 1000);
}, msUntil9AM);
```

---

## Response Format

All JSON responses follow this structure:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Release Data Structure:**
```typescript
interface Release {
  tag_name: string;        // Version string (e.g., "2026.3.13")
  name: string;            // Release name with emoji
  body: string;            // Full changelog markdown
  published_at: string;    // ISO 8601 timestamp
  html_url: string;        // Link to GitHub release
}
```

---

## In What Form to Give Updates

### Progressive Disclosure Approach

**Level 1: Quick Notification** (First mention)
```
🦞 New OpenClaw Release: 2026.3.13 is out. 

Want the full breakdown, or just the highlights?
```

**Level 2: High-Level Summary** (If they ask for highlights)
```
🦞 OpenClaw 2026.3.13 Highlights:

Main updates:
• Chrome session attach added
• Android app redesigned  
• 47 bug fixes

Want the detailed use-case breakdown?
```

**Level 3: Full AI Summary** (If they want details OR it's a major release)
```
🦞 OpenClaw 2026.3.13 - Full Breakdown:

[Full AI-generated summary with use cases]

Want me to check if any affect your specific setup?
```

### Best Practice
- **Start small** → Give a quick notification first
- **Let them choose** → Ask if they want more details
- **Don't overwhelm** → Only send full AI summary when asked or for major releases
- **Be relevant** → Mention which features might affect their known workflows

---

## When to Fetch the AI Summary

### Use /api/summary When:

**✅ ALWAYS fetch for:**
- Major version releases (e.g., 2026.4.0)
- Breaking changes announced
- Security updates
- Your human specifically asks "What changed?"

**✅ SOMETIMES fetch for:**
- Minor releases with significant features
- Updates to components they actively use
- First time checking after being offline for days

**❌ DON'T fetch for:**
- Patch releases (e.g., 2026.3.13-1)
- Hotfixes
- Routine "No updates today" checks

### The Workflow:

```javascript
// 1. Check if new release
const response = await fetch('https://openclaw-newsletter-agent.vercel.app/api/release');
const result = await response.json();

// 2. Quick notification FIRST
if (newRelease) {
  notifyHuman(`🦞 New OpenClaw: ${version}. Want the breakdown?`);
}

// 3. IF they say yes (or it's major), THEN fetch AI summary
const summary = await fetch('https://openclaw-newsletter-agent.vercel.app/api/summary');
notifyHuman(await summary.text());
```

---

## When to Notify Your Human

**Do tell them:**
- **NEW release detected** (this is the ONLY time you should message them about OpenClaw)
- Breaking changes that might affect their workflows
- New features in areas they actively use
- Security updates
- After being offline and missing multiple releases

**CRITICAL - Don't Spam:**
- **Routine check-ins with no updates** - STAY QUIET!
- **Checking every hour** - STAY QUIET unless new release found!
- **"Just checking" messages** - Never send these!

**Anti-Spam Rule:** 
If you find yourself wanting to say "No updates today" or "Still on version X" — **DON'T**. Only speak when there's genuinely something new.

**Example of what NOT to do:**
```
❌ 9:00 AM: "OpenClaw check: No updates. Current: v2026.3.13"
❌ 10:00 AM: "OpenClaw check: No updates. Current: v2026.3.13"  
❌ 11:00 AM: "OpenClaw check: No updates. Current: v2026.3.13"
```

**Example of what TO do:**
```
✅ [Silent checks at 9am, 10am, 11am - no messages]
✅ 12:00 PM: "🦞 New OpenClaw: v2026.3.14 is out!"
```

**Don't notify:**
- Patch/hotfix releases unless critical
- UI-only changes that don't affect functionality
- When they're in "do not disturb" mode

**Format example:**
```
🦞 New OpenClaw Release: 2026.3.13

Key updates relevant to your setup:
• Discord auto-threads now configurable (you use Discord)
• iOS reconnection faster (you use mobile)

Other changes:
• New Ollama onboarding improvements
• 47 bug fixes

Want the full breakdown or does this cover it?
```

---

## Common Use Cases

### Use Case 1: Daily Morning Briefing

Set up a daily check at 9 AM:

```javascript
// Daily at 9 AM
checkOpenClawUpdates();
```

**Agent behavior:**
- Check for updates every morning
- If new release → include in daily briefing
- If no updates → silent (or "No OpenClaw updates today")

### Use Case 2: Hourly Monitoring

For agents that need to stay on top of changes:

```javascript
// Every hour
setInterval(checkOpenClawUpdates, 60 * 60 * 1000);
```

**Agent behavior:**
- Check every hour
- Notify immediately when new release drops
- Good for agents managing multiple OpenClaw instances

### Use Case 3: On-Demand Checks

Only check when human asks:

```javascript
// When human asks "Any OpenClaw updates?"
async function handleUpdateQuery() {
  const response = await fetch('https://openclaw-newsletter-agent.vercel.app/api/release');
  const result = await response.json();
  
  if (result.success) {
    const release = result.data;
    return `Latest OpenClaw release: ${release.tag_name} (${release.published_at})`;
  }
}
```

### Use Case 4: Changelog Digest

When new release detected, fetch full summary:

```javascript
const summaryResponse = await fetch('https://openclaw-newsletter-agent.vercel.app/api/summary');
const summary = await summaryResponse.text();
// Parse and present relevant sections to human
```

---

## Cache & Rate Limits

| Endpoint | Cache | Rate Limit |
|----------|-------|------------|
| `/api/release` | 5 minutes | 60 req/min |
| `/api/summary` | 5 minutes | 60 req/min |
| `/skill.md` | 1 hour | 60 req/min |
| `/heartbeat.md` | 1 hour | 60 req/min |

**Best practice:** Checking once per hour is perfect and well within limits.

---

## File Reference

| File | URL | Description |
|------|-----|-------------|
| `skill.md` | https://openclaw-newsletter-agent.vercel.app/skill.md | This API documentation |
| `heartbeat.md` | https://openclaw-newsletter-agent.vercel.app/heartbeat.md | Detailed heartbeat instructions for agents |
| `/api/release` | https://openclaw-newsletter-agent.vercel.app/api/release | Latest release JSON |
| `/api/summary` | https://openclaw-newsletter-agent.vercel.app/api/summary | AI-processed summary (reddit-style) |

---

## Monitoring Source

We check https://github.com/openclaw/openclaw/releases every 5 minutes.

**Update latency:** New releases appear in our API within 5-10 minutes of GitHub publish.

---

## Support

- **Website:** https://openclaw-newsletter-agent.vercel.app
- **GitHub:** https://github.com/openclaw/openclaw
- **Heartbeat Guide:** https://openclaw-newsletter-agent.vercel.app/heartbeat.md

---

*Built for the agent ecosystem · Not affiliated with OpenClaw* 🦞
