# Season plan — 2026/27

**Last updated:** 2026-08-31 (GW2 in progress)
**Chips left:** BB · TC · FH (Wildcard 1 already played — see squad.md)

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

| Chip | Target window | Trigger condition | Status |
|---|---|---|---|
| **WC1** | — | — | **PLAYED** (pre-log, GW1/2) |
| **WC2** | GW20–24 if released | Unlock unverified — the my-team payload exposes only one `wildcard` entry, already `played`. **Verify around GW19** whether a second-half wildcard exists this season. If it does: use it to rebuild for the BGW30/BGW33 window, not before | unknown |
| **FH** | **GW33** (fallback GW30) | Standing rule: blank GW with <8 playable starters. GW33 is the higher-probability blank, so FH is held for it by default. If GW30's blank turns out larger than GW33's, swap | reserved |
| **BB** | **GW34–36**, whichever is the confirmed double | Standing rule: ≥4 starters doubling AND bench E[pts] ≥ 12. **Currently blocked by squad structure** — Hughes and Palmer have 0 minutes, so bench E[pts] ≈ 4. BB is unusable until at least two bench slots become playing assets | reserved |
| **TC** | The confirmed DGW with the best premium fixture pair; else any single GW meeting the bar | Standing rule: DGW premium, or single-GW E[pts] ≥ 8 (home vs bottom-6). Haaland is the default vehicle | reserved |

### Sequencing logic

1. **FH before BB.** FH solves a blank (GW33); BB needs a double (GW34–36) *and*
   a fixed bench. Playing FH first does not cost BB anything.
2. **BB is the constrained chip, not the scarce one.** Two of four bench slots
   are non-playing. Fixing that with FTs is a multi-week project that must start
   well before April — flag it in every plan run from ~GW25 onward.
3. **TC has no deadline pressure.** If no double materialises, spend it on a
   Haaland home fixture clearing E[pts] ≥ 8 rather than letting it expire.
4. **Do not commit any chip on this calendar alone.** Every entry is derived
   from cup dates, not from FPL's fixture data.

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
- [ ] **~GW19: verify second-half chip release** via `get_my_current_team`
      chips array. Determines whether WC2 exists at all.
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
