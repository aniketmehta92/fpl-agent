# FPL Agent — Claude Code setup (Windows-first)

Recommend-only FPL analyst. Scheduled runs produce gameweek briefs and an
FPL-style dashboard; you execute in the official app. ~15 min setup.
Commands are PowerShell; on macOS/Linux replace `fplenv\Scripts\` with
`fplenv/bin/`.

## 1. Install the MCP server (rishijatia/fantasy-pl-mcp)

Chosen because it supports authenticated read access to your own team and
private leagues — the agent reads your real squad, bank, and free
transfers instead of reconstructing them.

Install into a venv inside the repo — isolated Python, so nothing
collides with system-managed packages (verified failure mode without it):

```powershell
cd fpl-agent
python -m venv fplenv
.\fplenv\Scripts\pip install fpl-mcp
.\fplenv\Scripts\fpl-mcp-config setup    # authenticated team access
```

The setup tool asks for a refresh token. Per the project README
(github.com/rishijatia/fantasy-pl-mcp): log in at
fantasy.premierleague.com, open DevTools Console (F12), run:

```js
copy(JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('oidc.user:')))).refresh_token)
```

Paste when prompted. (Type `allow pasting` first if Chrome blocks the
console.) You are handling your own credential here — it goes into the
MCP server's local config, never into a chat.

## 2. Wire it into Claude Code

Point the project MCP config at the venv (works on any OS), then launch:

```powershell
python - << 'PYEOF'
import json, os
py = "fplenv/Scripts/python.exe" if os.name == "nt" else "fplenv/bin/python"
cfg = json.load(open(".mcp.json"))
cfg["mcpServers"]["fantasy-pl"]["command"] = os.path.abspath(py)
json.dump(cfg, open(".mcp.json", "w"), indent=2)
PYEOF

claude            # approve the project MCP server when prompted
/mcp              # expect: fantasy-pl connected, 23 tools (pkg v0.1.7)
```

## 3. Skill, state, dashboard

Already in place:

```
.claude/skills/fpl-analyst/SKILL.md              # the agent's brain — invocable as /fpl-analyst
.claude/skills/fpl-analyst/assets/
  dashboard_template.html                        # fixed FPL-style layout; runs inject data only
coverage/                                        # squad, watchlist, team stats, season plan, decisions, rivals, briefs
CLAUDE.md                                        # repo-level pointer
```

First session — seed the state:

```
/fpl-analyst — first run: pull my current squad via authenticated MCP and
fill coverage/squad.md completely. Then interview me to complete
season-plan.md and rivals.md, and seed watchlist.md with 5-10 names I
give you plus their full stats rows.
```

Then version it (audit trail):

```powershell
git init; git add -A; git commit -m "GW0 state"
```

**Dashboard workflow:** every run regenerates `coverage/dashboard.html` —
header strip (deadline countdown, bank, FTs, chips), your squad in FPL's
pitch layout, the 10-name watchlist sorted by promotion distance, and the
20-team FDR grid (next 6, FPL's native 1-5 colors). Keep it open in a
browser tab; F5 after a run, or type "refresh the dashboard" in any
session in this repo.

## 4. Schedule (Desktop scheduled tasks)

Create three recurring tasks in the Claude Desktop app (Routines → New
routine → Local), working folder = this repo:

| Run | Schedule (PT) | Prompt |
|---|---|---|
| Planning brief | Thu 18:00 | `Run the fpl-analyst skill in plan mode for the upcoming gameweek.` |
| Final brief | Fri 07:00 | `Run the fpl-analyst skill in final mode. Do the full press-conference web search pass.` |
| Post-GW review | Mon 18:00 | `Run the fpl-analyst skill in review mode for the completed gameweek.` |

**Notifications are native — nothing to build.** When a task fires you
get a desktop notification and the session appears under the Scheduled
section in the sidebar for review. If the Surface is asleep at fire time
the run is skipped, and exactly one catch-up run starts when it wakes —
with its own notification. To make Friday runs fire on time, enable Keep
computer awake (Settings → Desktop app → General); note a closed lid
still sleeps the machine. Each run is a full session against your plan's
usage limits.

**Timing logic:** standard deadline is Sat 11:00 UK = 03:00 PT; Friday UK
pressers land ~01:00-06:00 PT. So Thu 18:00 runs ~33h out and Fri 07:00
runs after pressers with ~20h to act — a literal deadline−24h trigger
(Fri 03:00 PT) would fire earlier but miss the news. The skill checks the
real deadline every run and flags midweek gameweeks that break this
cadence; when flagged, trigger manually: `claude "/fpl-analyst final mode"`.
(A daily deadline-checker would be truly deadline-relative but costs 7
sessions/week vs 3 — not worth it.)

### Fallback: Windows Task Scheduler

Only if you outgrow Desktop tasks. Create `run-final.cmd` in the repo:

```cmd
cd /d %USERPROFILE%\fpl-agent
claude -p "Run the fpl-analyst skill in final mode" --allowedTools "Read" "Write" "Edit" "WebSearch" "mcp__fantasy-pl__*" >> logs\final.log 2>&1
```

Then: `schtasks /Create /SC WEEKLY /D FRI /ST 07:00 /TN "FPL-final" /TR "%USERPROFILE%\fpl-agent\run-final.cmd"`
(`mkdir logs` first; clone the pattern for plan/review). The allowlist
deliberately excludes Bash — the skill doesn't need it, and a scheduled
agent should hold minimum permissions.

## 5. Guardrails baked in

- The skill's hard rule #1: never call team-modifying MCP tools — and the
  server exposes none anyway (verified: 23 tools, all read-only). You
  execute every move in the official app.
- Injury/minutes claims must carry a source + date.
- Every recommendation ships with E[Δpts] math and thresholds (FT ≥ +2.0
  over 3 GWs; −4 hit ≥ +6.0; full table in the skill).
- Review mode grades process separately from outcome, so after ~10 GWs
  `decisions.md` tells you whether the agent's judgment beats yours.

## Upgrade paths

- **Phone push**: have the final-mode task email the brief via a Gmail
  MCP, or move to remote routines (cloud — fire even when the Surface is
  off) with this repo on GitHub.
- **Autonomy step-up**: after a half-season audit of decisions.md, relax
  hard rule #1 to allow lineup/captain setting (still not transfers) —
  one line in the skill.

## Sources

- MCP server: github.com/rishijatia/fantasy-pl-mcp (auth flow, tools)
- Claude Code MCP config: code.claude.com/docs/en/mcp-quickstart
- Skills: code.claude.com/docs/en/skills
- Desktop scheduled tasks + notifications: code.claude.com/docs/en/desktop-scheduled-tasks
- Scheduling comparison: claudefa.st/blog/guide/development/scheduled-tasks
