# Season plan — 2026/27

**Last updated:** 2026-08-31 (GW2 in progress)
**Chips left:** first half (GW1–19): BB1 · TC1 · FH1 (WC1 played) · second half (GW20–38): WC2 · BB2 · TC2 · FH2 — **two full sets, verified 2026-09-04 from bootstrap-static `chips`**. First-half chips expire unused at GW19.

---

## Confirmed state of blanks/doubles (as of 2026-08-31)

**Nothing is confirmed yet.** `get_blank_gameweeks` and `get_double_gameweeks`
both return **zero** results across all 38 gameweeks. This is normal and not a
data failure: FPL's fixture list carries all 20 teams in every GW until cup
draws produce actual Premier League participants and the league confirms
rescheduling. Everything below is **provisional** and derived, not reported.

### How the provisional calendar was derived

Two confirmed inputs, mapped onto the real FPL deadline grid pulled from
`fantasy.premierleague.com/api/bootstrap-static/` (2026-08-31):

| Cup date (confirmed) | Source | Falls in |
|---|---|---|
| FA Cup R3 — Sat 9 Jan 2027 | [thefa.com round dates](https://www.thefa.com/competitions/thefacup/round-dates) | — |
| FA Cup R4 — Sat 13 Feb 2027 | thefa.com | free weekend (GW25 dl Wed 10 Feb, GW26 dl Sat 20 Feb) |
| FA Cup R5 — Sat 6 Mar 2027 | thefa.com | free weekend (GW28 dl Wed 3 Mar, GW29 dl Sat 13 Mar) |
| **Carabao Cup final — Sun 21 Mar 2027** | [SI / EFL](https://www.si.com/soccer/2026-27-carabao-cup-draw-fixtures-results-guide-each-round) | **collides with GW30** (dl Sat 20 Mar) |
| FA Cup QF — Sat 3 Apr 2027 | thefa.com | free weekend (GW30 dl 20 Mar, GW31 dl 10 Apr) |
| **FA Cup SF — Sat 24 Apr 2027** | thefa.com | **collides with GW33** (dl Sat 24 Apr 12:30) |
| FA Cup final — Sat 22 May 2027 | thefa.com | GW37 already deadlines Sun 23 May — no clash |

FPL deadline grid for the relevant window (from bootstrap-static, verified):
GW25 Wed 10 Feb · GW26 Sat 20 Feb · GW27 Sat 27 Feb · GW28 Wed 3 Mar ·
GW29 Sat 13 Mar · **GW30 Sat 20 Mar** · GW31 Sat 10 Apr · GW32 Sat 17 Apr ·
**GW33 Sat 24 Apr** · GW34 Sat 1 May · GW35 Sat 8 May · GW36 Sat 15 May ·
GW37 Sun 23 May · GW38 Sun 30 May.

### Provisional blanks

| GW | Date | Cause | Expected size | Confidence |
|---|---|---|---|---|
| **BGW30** | Sat 20 Mar 2027 | Carabao final Sun 21 Mar | ~4 teams (2 finalists + 2 opponents) | Medium — depends on which clubs reach the final; if both finalists are EFL sides, no blank at all |
| **BGW33** | Sat 24 Apr 2027 | FA Cup semi-finals Sat 24 Apr | ~4–8 teams (up to 4 SF clubs + their opponents) | **High** — direct date collision; only the club identities are open |

R4/R5/QF weekends land on gaps in the FPL grid, so on current evidence they
cause **no** blanks. That is the meaningful finding: this season's grid was
built around the cup calendar, and only the Carabao final and the FA Cup
semi-final weekends actually sit on top of a gameweek.

### Provisional doubles

Postponed fixtures return as midweek games, so the doubles are the mirror of
the blanks:

| GW | Window | Feeds from | Confidence |
|---|---|---|---|
| **DGW31 or DGW32** | midweeks 13–14 Apr / 20–21 Apr | BGW30 postponements | Medium |
| **DGW34–DGW36** | midweeks 4–5 May / 11–12 May / 18–19 May | BGW33 postponements + any remaining rearrangements | **High that one exists; low on which** |

The historical pattern (one or more doubles in the GW34–37 run-in) matches
this derivation — see [Fantasy Football Hub's BGW/DGW guide](https://www.fantasyfootballhub.co.uk/fpl-blank-double-gameweek-guide)
(2026/27 specifics paywalled) and [Ben Crellin's calendar](https://www.fantasyfootballhub.co.uk/crellin-fpl-calendar),
the standard reference for this. Neither was readable for confirmed 26/27 GW
numbers, so **no claimed DGW number below is sourced — all are derived.**

---

## Provisional chip calendar

> **Rule set, verified 2026-09-04** (bootstrap-static `chips`, 8 entries):
> Wildcard / Free Hit / Bench Boost / Triple Captain are each available **once
> in GW1(2)–19 and once more in GW20–38**. Unused first-half chips are lost at
> the GW19 deadline. So the calendar below is two calendars: an
> **early-season set that must be spent by GW19** (there are no first-half
> blanks or doubles to wait for) and a **second-half set aimed at the
> BGW30/33 and DGW31–36 window**.

### First half — spend by GW19 (no BGW/DGW exists in this window)

| Chip | Target window | Trigger condition | Status |
|---|---|---|---|
| **WC1** | — | — | **PLAYED** (pre-log, GW1/2) |
| **TC1** | Best single Haaland (or B.Fernandes) fixture GW4–19 clearing E[pts] ≥ 8 | Standing rule: single-GW E[pts] ≥ 8 — home vs a bottom-6 defence. Candidates on the current grid: MCI v SUN (GW5), MCI v IPS (GW7). Re-rank each plan run; do not hold past GW17 | reserved |
| **FH1** | Any GW where the FDR swing is extreme or ≥3 starters are unavailable; else a hard-fixture GW for the core (e.g. MCI/MUN both away to top sides) | No blank exists to save it for. Use it as a one-week fixture arbitrage or an injury bail-out. Do not let it expire | reserved |
| **BB1** | GW15–19, only if the bench is repaired | Standing rule: bench E[pts] ≥ 12 (the DGW condition cannot be met in the first half). **Blocked now** — Hughes and A.Palmer have 0 minutes; bench E[pts] ≈ 4. Needs two bench slots turned into starters by ~GW14, or accept BB1 is forfeited | blocked |

### Second half — GW20–38 (the blank/double window)

| Chip | Target window | Trigger condition | Status |
|---|---|---|---|
| **WC2** | GW20–24, or held for the run-in | Now **confirmed to exist**. Use it to rebuild for the BGW30/BGW33 window; earliest sensible use is the GW20 unlock if the squad has decayed | available from GW20 |
| **FH2** | **GW33** (fallback GW30) | Standing rule: blank GW with <8 playable starters. GW33 is the higher-probability blank, so FH2 is held for it by default. If GW30's blank turns out larger than GW33's, swap | reserved |
| **BB2** | **GW34–36**, whichever is the confirmed double | Standing rule: ≥4 starters doubling AND bench E[pts] ≥ 12. Bench must be playing assets by then — same structural fix as BB1, with more time | reserved |
| **TC2** | The confirmed DGW with the best premium fixture pair; else any single GW meeting the bar | Standing rule: DGW premium, or single-GW E[pts] ≥ 8. Haaland is the default vehicle | reserved |

### Sequencing logic

1. **First-half chips are use-it-or-lose-it, and there is nothing to wait
   for.** No blank or double exists before GW19, so TC1 and FH1 are pure
   fixture plays. TC1 has a hard internal deadline of GW17 so a postponement
   cannot strand it.
2. **FH2 before BB2.** FH2 solves a blank (GW33); BB2 needs a double (GW34–36)
   *and* a fixed bench. Playing FH2 first does not cost BB2 anything.
3. **BB is the constrained chip in both halves.** Two of four bench slots are
   non-playing. Fixing that with FTs is a multi-week project. Decide by ~GW12
   whether BB1 is worth chasing (needs two bench upgrades by GW14) or is
   written off so the FTs go to the XI instead. Flag it in every plan run.
4. **Do not commit any second-half chip on this calendar alone.** Every
   BGW/DGW number is derived from cup dates, not from FPL's fixture data.

### Revision triggers — firm up when any of these fire

- [ ] **`get_blank_gameweeks` / `get_double_gameweeks` return non-empty.** This
      is the authoritative signal. Rewrite this whole section the run it happens.
- [ ] **Carabao Cup semi-finals resolve (~Jan 2027)** → finalists known → BGW30
      confirmed or ruled out.
- [ ] **FA Cup QF results, Sat 3 Apr 2027** → the four SF clubs are known →
      BGW33 size becomes exact, three weeks before the deadline.
- [ ] **PL announces rescheduled dates for GW30/GW33 postponements** → converts
      the provisional doubles into real ones. Historically announced in the week
      after the relevant cup round.
- [x] ~~**~GW19: verify second-half chip release**~~ — **done 2026-09-04.**
      bootstrap-static `chips` lists two of each (events 2–19 / 20–38 for
      WC and FH; 1–19 / 20–38 for BB and TC). WC2 exists.
- [ ] **GW17 plan run: TC1 and FH1 must have a named GW by now** or be spent
      that week. GW19 is the hard expiry.
- [ ] Any FPL-confirmed change published on the PL site's blank/double gameweek
      tracker: [premierleague.com BGW/DGW news](https://www.premierleague.com/en/news/4611210/what-we-know-so-far-about-blank-and-double-gameweeks-this-season).

---

## Structure principles

Anik's constraints, 2026-08-31. Never recommend against these without naming
the conflict explicitly in the brief.

1. **Two premiums, no more.** Haaland (£15.5m) and B.Fernandes (£12.0m) are the
   only £10m+ assets. Everything else lives in the £4.0–9.6m band.
2. **Prioritise top clubs** for attacking assets: **Man City, Man Utd, Arsenal,
   Chelsea, Liverpool.** Attacking spend concentrates in these five.
3. **Maximise out-of-position (OOP) players.** Explicitly wanted: players listed
   in a defensive position who play further forward — e.g. Nico O'Reilly or
   Reece James listed DEF but playing midfield, or a winger deployed as a
   wing-back in a 3-5-2. OOP assets get a standing scan every plan run; see the
   OOP table in `watchlist.md`.
4. **Defence stays cheap and rotates.** No premium defenders. Budget DEFs from
   smaller clubs, rotated on FDR — pick the pair with the softest next-2 and
   bench the other. Principle #2 does *not* apply to defence.

### Live tensions to manage

- **#2 vs #3.** The best OOP defenders right now are De Cuyper (BHA, xGI 1.76)
  and Kayode (BRE) — both small clubs. The top-club OOP options are O'Reilly
  (MCI) and R.James (CHE), and both currently fail the +2.0 promotion bar.
  Principle #4 gives cover here: cheap non-top-club defenders are allowed, so
  De Cuyper is *not* actually a violation — he sits under #4, not #2.
- **#4 vs the current squad.** Defence rotation needs at least two *playing*
  cheap defenders with divergent fixtures. Diop (IPS) and van Ewijk (COV) both
  play, so the rotation is live, but both sit behind poor defences
  (Diop xGC 5.43). Upgrade targets should be cheap DEFs at clubs with better
  clean-sheet odds, not more expensive ones.
- **#1 vs the watchlist.** Saka (£9.5m) and Palmer (£9.6m) are affordable only
  by selling B.Fernandes — which would swap one premium for a non-premium and
  leave the squad with a single £10m+ asset. That is *allowed* under #1 (which
  is a ceiling, not a floor), but it is a structural change, not a routine
  transfer. Flag it as such if it ever gets recommended.
- **Bench Boost is blocked by #4's current implementation.** Two bench slots
  (Hughes, Palmer) have zero minutes. Cheap-and-rotating requires cheap
  players who actually *play*. Fixing this is the precondition for BB —
  start the repair well before the April blank/double window.
