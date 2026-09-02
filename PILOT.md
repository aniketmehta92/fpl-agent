# Pilot — guided dry run (~50 min, ~5 Claude Code sessions, Windows)

Goal: validate every link in the chain manually before trusting the
scheduler. Each phase has a pass condition; don't advance on a fail.
Commands are PowerShell.

## Phase −1 — Install Claude Code (first time only, ~15 min)

All in PowerShell (prompt shows `PS C:\` — not Command Prompt):

1. Install the CLI: `irm https://claude.ai/install.ps1 | iex` (no admin needed)
2. Install Git: `winget install --id Git.Git -e` (defaults throughout)
3. Close PowerShell, open fresh: `claude --version` → version number = success.
   If "not recognized": reopen the terminal; check `%USERPROFILE%\.local\bin`
   is in PATH.
4. Sign in: run `claude` → browser opens → log in with your Claude account
   (one time; needs a plan that includes Claude Code). Then `/exit`.
5. Install the Claude Desktop app from claude.com/download, same account —
   it's where Routines (Phase 5 scheduling + notifications) live.

## Phase 0 — Prereqs (5 min)

```powershell
claude --version        # Claude Code installed
python --version        # need 3.10+
Expand-Archive fpl-agent.zip -DestinationPath .
cd fpl-agent
```

## Phase 1 — MCP install + auth (10 min)

```powershell
python -m venv fplenv
.\fplenv\Scripts\pip install fpl-mcp
.\fplenv\Scripts\fpl-mcp-config setup      # refresh-token flow — README step 1
```

Notes:
- venv = an isolated Python in `fplenv\` with its own interpreter
  (`Scripts\python.exe`) and installer (`Scripts\pip.exe`), so nothing
  collides with system Python.
- "No credentials found" warnings on first start are normal pre-auth.
- Unauthenticated mode still serves all public stats; only `get_my_team`
  needs the token. If the token flow fights you, continue and fix auth
  before Phase 3.

**Pass:** setup completes without a traceback.

## Phase 2 — Wire into Claude Code + data sanity (10 min)

```powershell
python - << 'PYEOF'
import json, os
py = "fplenv/Scripts/python.exe" if os.name == "nt" else "fplenv/bin/python"
cfg = json.load(open(".mcp.json"))
cfg["mcpServers"]["fantasy-pl"]["command"] = os.path.abspath(py)
json.dump(cfg, open(".mcp.json", "w"), indent=2)
PYEOF

claude          # approve the project MCP server when prompted
```

In the session:

```
/mcp
```

**Expect: fantasy-pl connected, 23 tools.** Then trust-but-verify — pick
any premium player:

```
Using the fantasy-pl MCP, give me [player]'s current price, xGI/90,
minutes, and next 3 fixtures with FDR. Cite which tool returned each.
```

Open fantasy.premierleague.com and compare.

**Pass:** price matches exactly (cleanest cross-check), fixtures match,
`check_fpl_authentication` returns authenticated.

## Phase 3 — Seed state (10 min)

```
/fpl-analyst — first run: pull my current squad via authenticated MCP and
fill coverage/squad.md completely (all 15, buy/sell prices, bank, FTs,
chips). Then interview me to complete season-plan.md and rivals.md, and
seed watchlist.md with 5-10 names I give you plus their full stats rows.
```

Give the interview real answers — chip-calendar constraints are what stop
locally-optimal recommendations from wrecking your DGW setup. Then:

```powershell
git init; git add -A; git commit -m "GW0 state seeded"
```

**Pass:** squad.md matches your FPL app 15/15 and bank to £0.1m;
watchlist.md has no blank stat cells; season-plan.md has at least one
trigger per remaining chip.

## Phase 4 — Manual run of each mode (15 min)

```
Run the fpl-analyst skill in plan mode.
```

Checklist against the brief:

- [ ] Deadline at top, in PT, matches the FPL site
- [ ] Time-remaining stated; off-cadence flag correct (or absent)
- [ ] Transfer rec (or "roll") carries E[Δpts next 1/3] with visible math
- [ ] Captain matrix has 3 candidates with floor/ceiling/EO
- [ ] watchlist.md and team-stats.md timestamps refreshed
- [ ] briefs/gw{N}-plan.md written AND printed in full
- [ ] coverage/dashboard.html regenerated — open it in the browser:
      sample banner GONE, countdown matches real deadline, squad mirrors
      your app, watchlist sorted by Δ-to-promote, FDR grid colored,
      sort-by-avg works
- [ ] Transcript is read-only — no attempted team modifications

Keep the dashboard tab open — from here on, F5 after every run. Then:

```
Run the fpl-analyst skill in final mode. Do the full press-conference
web search pass.
```

- [ ] Every availability claim has a source + date
- [ ] P(start) updated only where news changed something
- [ ] XI + bench order with P(start) per bench slot

Commit: `git add -A; git commit -m "GW{N} manual dry run"`.
(Review mode: run it after the gameweek completes — it needs actuals.)

**Pass:** all boxes ticked; anything unticked → fix the skill wording
first, rerun, then advance.

## Phase 5 — Schedule ONE task (5 min)

Desktop app → Routines → New routine → Local. Working folder = this
repo, Fri 07:00 PT, prompt:

```
Run the fpl-analyst skill in final mode. Do the full press-conference web search pass.
```

What to expect (all native, nothing to configure): a desktop
notification when the task fires, and the run appears under the
Scheduled section in the sidebar for review. If the Surface was asleep
at 07:00, one catch-up run starts when it wakes, with its own
notification. For on-time fires, enable Keep computer awake
(Settings → Desktop app → General) — a closed lid still sleeps it.

Saturday: open the Scheduled session, F5 the dashboard, read
briefs/gw{N}-final.md. If it clears the Phase 4 checklist unattended,
add the Thu 18:00 plan task and Mon 18:00 review task. Pilot complete.

## Success criteria (end of pilot)

| # | Criterion | Threshold |
|---|---|---|
| 1 | Data fidelity | Spot-checked price/fixtures match FPL site exactly |
| 2 | Squad fidelity | 15/15 players, bank to £0.1m |
| 3 | Rec quality | 100% of recs carry E[Δpts] math |
| 4 | News sourcing | ≥1 sourced+dated item per flagged player in final mode |
| 5 | Safety | 0 team-modification attempts (server has no write tools; confirm anyway) |
| 6 | Automation | 1 scheduled run completes unattended (or via catch-up), notification received, brief + dashboard written |

## Cost + cleanup

- Pilot ≈ 5 full sessions against your plan's usage limits.
- Rollback at any point: `git checkout -- coverage/` restores state;
  deleting the routine stops automation. Nothing touches your actual FPL
  team at any stage.
