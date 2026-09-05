#!/usr/bin/env node
// build-dashboard.js — renders coverage/dashboard.html from the template.
//
// Inputs:  coverage/dashboard-input.json  (squad element ids from authenticated
//          MCP, watchlist names, elite panel ids)
// Live:    fantasy.premierleague.com/api/bootstrap-static/  (players, teams, events)
//          fantasy.premierleague.com/api/fixtures/          (FDR grid, league table)
//          fantasy.premierleague.com/api/entry/{id}/event/{gw}/picks/  (elite squads)
// Output:  coverage/dashboard.html  — ONLY the JSON block in the template is replaced.
//
// View gameweek = the first event whose deadline is still in the future, so the
// page rolls to the next GW automatically once a deadline passes.
// Projections use the SKILL.md model with the FPL API's Opta xG/xA fields.

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '../../../..');
const TPL = path.join(__dirname, 'dashboard_template.html');
const OUT = path.join(ROOT, 'coverage', 'dashboard.html');
const INPUT = path.join(ROOT, 'coverage', 'dashboard-input.json');
const RE = /(<script id="fpl-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

const PPGI = { GK: 6.9, DEF: 6.9, MID: 6.6, FWD: 5.7 };
const PCS = { 1: 0.55, 2: 0.45, 3: 0.30, 4: 0.20, 5: 0.12 };
const POS = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' };
const mult = d => 1 + 0.15 * (3 - d);

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'fpl-analyst-dashboard/1.0' } }, r => {
      if (r.statusCode !== 200) { r.resume(); return rej(new Error(r.statusCode + ' ' + url)); }
      let b = ''; r.setEncoding('utf8'); r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
    }).on('error', rej);
  });
}

(async () => {
  const input = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  const [bs, fixtures] = await Promise.all([
    get('https://fantasy.premierleague.com/api/bootstrap-static/'),
    get('https://fantasy.premierleague.com/api/fixtures/'),
  ]);

  const teams = {}; bs.teams.forEach(t => teams[t.id] = t);
  const players = {}; bs.elements.forEach(p => players[p.id] = p);
  const now = Date.now();
  const viewEv = bs.events.find(e => new Date(e.deadline_time).getTime() > now) || bs.events[bs.events.length - 1];
  const GW = viewEv.id;
  const lastDone = Math.max(0, ...bs.events.filter(e => new Date(e.deadline_time).getTime() <= now).map(e => e.id));

  // --- league table + games played (finished fixtures only) ---
  const tbl = {}; bs.teams.forEach(t => tbl[t.id] = { name: t.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  fixtures.filter(f => f.finished).forEach(f => {
    const h = tbl[f.team_h], a = tbl[f.team_a], hs = f.team_h_score, as = f.team_a_score;
    h.p++; a.p++; h.gf += hs; h.ga += as; a.gf += as; a.ga += hs;
    if (hs > as) { h.w++; a.l++; h.pts += 3 } else if (hs < as) { a.w++; h.l++; a.pts += 3 } else { h.d++; a.d++; h.pts++; a.pts++ }
  });
  const order = Object.keys(tbl).map(Number).sort((x, y) => tbl[y].pts - tbl[x].pts || (tbl[y].gf - tbl[y].ga) - (tbl[x].gf - tbl[x].ga) || tbl[y].gf - tbl[x].gf || tbl[x].name.localeCompare(tbl[y].name));
  order.forEach((id, i) => tbl[id].pos = i + 1);

  // --- fixtures by team by event (unplayed) ---
  const fxByTeam = {}; bs.teams.forEach(t => fxByTeam[t.id] = {});
  fixtures.forEach(f => {
    if (!f.event) return;
    (fxByTeam[f.team_h][f.event] = fxByTeam[f.team_h][f.event] || []).push({ opp: teams[f.team_a].short_name, ha: 'H', d: f.team_h_difficulty });
    (fxByTeam[f.team_a][f.event] = fxByTeam[f.team_a][f.event] || []).push({ opp: teams[f.team_h].short_name, ha: 'A', d: f.team_a_difficulty });
  });
  const next3 = tid => [GW, GW + 1, GW + 2].flatMap(g => fxByTeam[tid][g] || []);
  const thisGw = tid => fxByTeam[tid][GW] || [];

  // --- projection (SKILL.md model) ---
  function project(p) {
    const tid = p.team, gp = Math.max(tbl[tid].p, 1);
    const pos = POS[p.element_type];
    const minPg = p.minutes / gp;
    const pStart = p.minutes === 0 ? 0 : Math.min(0.9, p.starts / gp);
    const projMin = Math.min(90, minPg || 0);
    const xgi90 = Number(p.expected_goal_involvements_per_90 || 0);
    const form = Number(p.form || 0);
    const fx = next3(tid);
    let e3 = 0;
    fx.forEach(f => {
      const cs = (pos === 'GK' || pos === 'DEF') ? 4 * (PCS[f.d] || 0.3) : 0;
      const base = 0.5 * form + 0.5 * (xgi90 * projMin / 90 * PPGI[pos] + 2 + cs);
      e3 += base * mult(f.d);
    });
    e3 *= pStart;
    const sm = fx.reduce((s, f) => s + mult(f.d), 0);
    const xg3 = Number(p.expected_goals) / gp * sm, xa3 = Number(p.expected_assists) / gp * sm;
    const fdr3 = fx.length ? fx.reduce((s, f) => s + f.d, 0) / fx.length : 0;
    return { e3, xg3, xa3, fdr3, pStart, pos, fx };
  }
  const r2 = x => Math.round(x * 100) / 100, r1 = x => Math.round(x * 10) / 10;

  function card(id, extra) {
    const p = players[id]; if (!p) throw new Error('unknown element id ' + id);
    const pr = project(p);
    const tg = thisGw(p.team);
    return Object.assign({
      name: p.web_name, club: teams[p.team].short_name, pos: pr.pos,
      fixture: tg.length ? tg.map(f => f.opp + ' (' + f.ha + ')').join(' + ') : 'BLANK',
      fdr: tg.length ? Math.round(tg.reduce((s, f) => s + f.d, 0) / tg.length) : 3,
      xg3: r2(pr.xg3), xa3: r2(pr.xa3), price: p.now_cost / 10, e3: r1(pr.e3), pstart: pr.pStart,
    }, extra || {});
  }
  const xi = input.squad.xi.map(id => card(id, { cap: id === input.squad.captain, vice: id === input.squad.vice }));
  const bench = input.squad.bench.map(id => card(id));

  // --- watchlist ---
  function resolve(w) {
    const t = bs.teams.find(t => t.short_name === w.team);
    const cands = bs.elements.filter(p => p.team === t.id && (p.web_name === w.name || p.web_name.replace(/^[A-Z]\./, '') === w.name.replace(/^[A-Z]\./, '') || p.second_name === w.name));
    if (cands.length !== 1) throw new Error('watchlist resolve ' + w.name + '/' + w.team + ' -> ' + cands.map(c => c.web_name).join(','));
    return cands[0];
  }
  const baseline = {};
  ['GK', 'DEF', 'MID', 'FWD'].forEach(pos => {
    const starters = xi.filter(c => c.pos === pos && c.pstart >= 0.5);
    baseline[pos] = starters.length ? Math.min(...starters.map(c => c.e3)) : 0;
  });
  const watchlist = input.watchlist.map(w => {
    const p = resolve(w), pr = project(p);
    return {
      name: p.web_name, club: w.team, pos: pr.pos, price: p.now_cost / 10,
      xg4: Number(p.expected_goals), xa4: Number(p.expected_assists), xgi90: Number(p.expected_goal_involvements_per_90),
      start_pct: Math.round(100 * p.starts / Math.max(tbl[p.team].p, 1)),
      fdr3: r1(pr.fdr3), xg3: r2(pr.xg3), xa3: r2(pr.xa3), e3: r1(pr.e3),
      delta: r1((pr.e3 - baseline[pr.pos] - 2.0) / 3),
    };
  });

  // --- elite squads (last GW whose deadline has passed) ---
  const eliteGw = lastDone || GW;
  const tally = {};
  const panel = [];
  for (const m of input.elite) {
    try {
      const pk = await get('https://fantasy.premierleague.com/api/entry/' + m.id + '/event/' + eliteGw + '/picks/');
      panel.push(m.label + (pk.active_chip ? ' [' + {wildcard:'WC',freehit:'FH',bboost:'BB','3xc':'TC'}[pk.active_chip] + ']' : ''));
      pk.picks.forEach(x => tally[x.element] = (tally[x.element] || 0) + 1);
    } catch (e) { console.error('elite skip', m.label, e.message); }
  }
  const mine = new Set([...input.squad.xi, ...input.squad.bench]);
  const elitePlayers = [], singles = [];
  Object.entries(tally).forEach(([id, held]) => {
    const p = players[id];
    if (held >= 2) { const pr = project(p); elitePlayers.push({ name: p.web_name, club: teams[p.team].short_name, pos: pr.pos, price: p.now_cost / 10, held, xg3: r2(pr.xg3), xa3: r2(pr.xa3), owned: mine.has(Number(id)) }); }
    else singles.push(p.web_name);
  });

  // --- FDR grid next 6 ---
  const gws = [0, 1, 2, 3, 4, 5].map(i => 'GW' + (GW + i));
  const fdrTeams = order.map(tid => {
    const cells = [0, 1, 2, 3, 4, 5].map(i => { const f = fxByTeam[tid][GW + i] || []; return f.length ? f[0] : { opp: '—', ha: '', d: 3 }; });
    const avg = r1(cells.reduce((s, c) => s + c.d, 0) / cells.length);
    return { name: teams[tid].name, pos: tbl[tid].pos, p: tbl[tid].p, gf: tbl[tid].gf, ga: tbl[tid].ga, cells, avg };
  });

  // --- assemble ---
  const dl = new Date(viewEv.deadline_time);
  const fmtPT = (d, o) => new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: 'America/Los_Angeles' }, o)).format(d);
  const data = {
    sample: false,
    generated: fmtPT(new Date(), { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' PT',
    gw: GW, deadline_iso: dl.toISOString(),
    deadline_local: fmtPT(dl, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) + ' PT',
    bank: input.bank, fts: input.fts, chips: input.chips_note.split(' · '),
    squad: { xi: xi.map(({ pstart, e3, ...c }) => c), bench: bench.map(({ pstart, e3, cap, vice, ...c }) => c) },
    watchlist, elite: { gw: 'GW' + eliteGw, n: panel.length, panel, players: elitePlayers, singles },
    fdr: { gws, teams: fdrTeams },
    baselines: baseline,
  };

  // --- validate + write ---
  const errs = [];
  if (xi.length !== 11 || bench.length !== 4) errs.push('squad size');
  const f = {}; xi.forEach(p => f[p.pos] = (f[p.pos] || 0) + 1);
  if (f.GK !== 1 || f.DEF < 3 || f.DEF > 5 || f.MID < 2 || f.MID > 5 || f.FWD < 1 || f.FWD > 3) errs.push('formation ' + JSON.stringify(f));
  if (bench[0].pos !== 'GK') errs.push('bench[0] not GK');
  if (fdrTeams.length !== 20) errs.push('fdr teams');
  const html = fs.readFileSync(TPL, 'utf8').replace(RE, (_, a, __, c) => a + '\n' + JSON.stringify(data) + '\n' + c);
  if (/pl_profile|csrftoken|sessionid|Bearer\s|refresh[_-]?token|api[_-]?key|client[_-]?secret|password/i.test(html)) errs.push('credential-shaped string in output');
  if (errs.length) { console.error('VALIDATION FAILED: ' + errs.join('; ')); process.exit(1); }
  fs.writeFileSync(OUT, html, 'utf8');

  console.log(`OK GW${GW} view (deadline ${data.deadline_local}); elite from GW${eliteGw} (${panel.length} squads); ${html.length} bytes`);
  console.log('XI:', xi.map(c => c.name + (c.cap ? '(C)' : c.vice ? '(V)' : '') + ' ' + c.fixture + ' e3=' + c.e3).join(' | '));
  console.log('baselines:', JSON.stringify(baseline));
  console.log('watch:', watchlist.map(w => w.name + ' e3=' + w.e3 + ' Δ/GW=' + w.delta).join(' | '));
  console.log('elite top:', elitePlayers.sort((a, b) => b.held - a.held).slice(0, 12).map(p => p.name + ' ' + p.held).join(' | '));
  const wissa = elitePlayers.find(p => p.name === 'Wissa'); console.log('Wissa held by', wissa ? wissa.held : (singles.includes('Wissa') ? 1 : 0));
})().catch(e => { console.error(e); process.exit(1); });
