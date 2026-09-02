# Team stats — all 20 clubs
> Native FPL fields only. Refresh every plan run.

**Last refreshed:** 2026-08-31 (GW2 in progress) · Source: `analyze_fixtures`
per club + `bootstrap-static/` teams array.

> ⚠️ **Strength ratings and results are unavailable this season.** The
> `teams` array in bootstrap-static returns `strength: null` and
> `strength_attack_home` / `strength_attack_away` / `strength_defence_home` /
> `strength_defence_away` / `played` / `win` / `draw` / `loss` / `points` all
> as `0`. The `position` field returns a fixed ordering that is not a league
> table. So the columns SKILL.md asks for — attack/defence strength H/A,
> last-6 W-D-L, GF/GA, clean sheets — **cannot be filled from native fields**
> and are deliberately left out rather than faked or derived from player data.
> **Recheck at each plan run**; these usually populate once a few GWs are in.
>
> What *is* native and real right now: FPL's own 1–5 fixture difficulty. That
> is the whole basis of the table below.

## Next-6 fixture difficulty (GW3–GW8)

Ranked easiest to hardest by average FDR.

| # | Club | GW3 | GW4 | GW5 | GW6 | GW7 | GW8 | Avg | Next-3 avg |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Crystal Palace** | FUL A(3) | IPS H(2) | LEE A(3) | NFO H(3) | BHA A(3) | NEW H(2) | **2.67** | 2.67 |
| 2 | **Liverpool** | IPS A(2) | FUL H(2) | BOU A(3) | MCI H(4) | BRE A(3) | BHA H(2) | **2.67** | **2.33** |
| 3 | **Newcastle** | BOU H(3) | LEE A(3) | HUL H(2) | COV A(2) | AVL H(3) | CRY A(3) | **2.67** | 2.67 |
| 4 | **Coventry City** | MCI A(5) | BHA H(2) | NFO A(3) | NEW H(2) | TOT A(3) | FUL H(2) | **2.83** | 3.33 |
| 5 | **Fulham** | CRY H(3) | LIV A(4) | MUN H(4) | IPS A(2) | HUL H(2) | COV A(2) | **2.83** | 3.67 |
| 6 | Arsenal | CHE H(4) | SUN A(3) | BHA A(3) | LEE H(2) | NFO A(3) | EVE H(3) | 3.00 | 3.33 |
| 7 | Aston Villa | HUL A(2) | NFO H(3) | TOT A(3) | BRE H(3) | NEW A(3) | MCI H(4) | 3.00 | 2.67 |
| 8 | Brighton | LEE H(2) | COV A(2) | ARS H(4) | SUN A(3) | CRY H(3) | LIV A(4) | 3.00 | **2.67** |
| 9 | **Man City** | COV H(2) | MUN A(4) | SUN H(2) | LIV A(4) | IPS H(2) | AVL A(4) | 3.00 | **2.67** |
| 10 | Nott'm Forest | TOT H(3) | AVL A(4) | COV H(2) | CRY A(3) | ARS H(4) | IPS A(2) | 3.00 | 3.00 |
| 11 | Brentford | SUN H(2) | BOU A(3) | CHE H(4) | AVL A(4) | LIV H(4) | HUL A(2) | 3.17 | 3.00 |
| 12 | Chelsea | ARS A(5) | HUL H(2) | BRE A(3) | BOU H(3) | EVE A(3) | TOT H(3) | 3.17 | 3.33 |
| 13 | Hull City | AVL H(3) | CHE A(4) | NEW A(3) | EVE H(3) | FUL A(3) | BRE H(3) | 3.17 | 3.33 |
| 14 | **Man Utd** | EVE A(3) | MCI H(4) | FUL A(3) | TOT H(3) | LEE A(3) | BOU H(3) | 3.17 | 3.33 |
| 15 | Spurs | NFO A(3) | EVE H(3) | AVL H(3) | MUN A(4) | COV H(2) | CHE A(4) | 3.17 | 3.00 |
| 16 | Sunderland | BRE A(3) | ARS H(4) | MCI A(5) | BHA H(2) | BOU A(3) | LEE H(2) | 3.17 | **4.00** |
| 17 | Bournemouth | NEW A(3) | BRE H(3) | LIV H(4) | CHE A(4) | SUN H(2) | MUN A(4) | 3.33 | 3.33 |
| 18 | Everton | MUN H(4) | TOT A(3) | IPS H(2) | HUL A(2) | CHE H(4) | ARS A(5) | 3.33 | 3.00 |
| 19 | Ipswich Town | LIV H(4) | CRY A(3) | EVE A(3) | FUL H(2) | MCI A(5) | NFO H(3) | 3.33 | 3.33 |
| 20 | Leeds | BHA A(3) | NEW H(2) | CRY H(3) | ARS A(5) | MUN A(4) | SUN H(2) | 3.33 | 2.67 |

**Bold** = club you hold assets in.

## Reading it against the squad

- **Liverpool has the best next-3 in the league (2.33)** — IPS away, FUL home,
  BOU away. You own nobody. This is the fixture case for Isak, who is blocked
  on cash (see watchlist.md).
- **Man City's next-6 alternates 2-4-2-4-2-4.** Every soft home game is
  followed by a hard away one. Haaland, Gvardiol, Semenyo and any Cherki buy
  all sit on the same swing — that's four assets moving together.
- **Man Utd is flat 3s with one 4** (MCI at home, GW4). Your triple-up has no
  fixture spike either way; it lives or dies on Bruno's form.
- **Sunderland has the worst next-3 (4.00)** — BRE away, ARS home, MCI away.
  Relevant only as an opponent: Man City host them in GW5 (FDR 2).
- **Ipswich (Diop, A.Palmer) rank 19th** and face LIV, then MCI in GW7.
  Both are bench assets behind a defence with xGC 5.43. The clean-sheet
  lottery tickets are close to worthless here — this is the concrete argument
  for the principle #4 defence rotation being mis-implemented right now.
- **Coventry (van Ewijk) open with MCI away (5)** but then run 2-3-2-3-2 —
  the fixture swing turns in his favour from GW4.
