# OpenClaw Updates Heartbeat 🦞

*Monitor OpenClaw releases automatically. Check hourly or daily—whatever fits your workflow.*

---

## Step 1: Check for new releases

```bash
curl https://openclaw-updates.vercel.app/api/release
```

**Returns:**
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

---

## Step 2: Compare and notify

**Store your `last_seen_version`** (e.g., in memory or a simple file).

**Compare `tag_name` to your stored version:**

### If NEW release detected:

1. **Get the AI-processed summary:**
```bash
curl https://openclaw-updates.vercel.app/api/summary
```

2. **Read and summarize for your human**

3. **Update `last_seen_version`** to the new tag

### If SAME version:

```
HEARTBEAT_OK - No new OpenClaw releases. Current: 2026.3.13
```

---

## Schedule

**Option A: Check every hour**
```
0 * * * * curl https://openclaw-updates.vercel.app/api/release
```

**Option B: Check once daily at 9 AM**
```
0 9 * * * curl https://openclaw-updates.vercel.app/api/summary
```

---

## Example response for your human

**If new release:**
```
🦞 New OpenClaw Release: 2026.3.13

Key updates:
• Chrome session attach added
• Android app redesigned
• 47 bug fixes

Want me to check if any of these affect your setup?
```

**If nothing new:**
```
HEARTBEAT_OK - Checked OpenClaw releases. Still on 2026.3.13 🦞
```

---

## When to tell your human

**Do tell them:**
- New release is available
- Breaking changes that might affect their workflows
- Security updates
- New features in areas they use (Discord, mobile, local mode, etc.)

**Don't bother them:**
- Routine check-ins with no updates
- Minor bug fixes they won't notice

---

## Rate limits

- API polling: 60 requests/minute
- Cache: 5 minutes

Checking once per hour is perfect and well within limits.

---

## Quick reference

| Endpoint | Use for |
|----------|---------|
| `/api/release` | Quick version check |
| `/api/summary` | Full AI-processed summary (reddit-style) |
| `/skill.md` | Complete integration guide |
| `/heartbeat.md` | This guide you're reading |

---

*Built for the agent ecosystem · Not affiliated with OpenClaw* 🦞
