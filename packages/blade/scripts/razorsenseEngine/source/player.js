// ============================================================================================
// Razorsensation · exported player: one project's animation and nothing else (no studio, no reference UI). Runs on 01-core + 02-gl
// (the studio's own document model and renderer), with this project's document in window.RZS_EXPORT.doc.
//   ?once      play once and hold the last frame (default: as the timeline says: loop, loop range and count)
//   ?fit=contain  show the whole comp (default cover: fill the window, cropping the comp's edges)
//   ?t=1.25    hold that moment (no playback)
//   window.RZS_PLAYER: play(), pause(), restart(), seek(seconds[, alive]), time, duration, playing;
//     holdLoop(true)  keep looping the loop range for as long as the page around it needs (false: finish it as the timeline says)
//     alive           the alive clock (breathing etc.): read it from one effect and set it on the next for a seamless hand-over
//   opts.paused: wait at the start (nothing plays until play() / restart())
//   offset(x, y)    every shape moved by this much (comp px) while the bands stay where they are (flow 6's typing surge follows the
//                   text this way: the shapes go, the comp and its bands stay)
//   shapes(kx, ky, px, py[, kb])  every shape scaled round the point (px, py) (comp px, from the comp's middle): wider / taller, their
//                   blur with them (and x kb: softer, a wider glow), while the bands stay as they are (flow 6.2's typing / answer surges
//                   widen this way: the flutes never stretch)
//   adjust({ k: v, 'k*': m })  page values nudged live: v is added to the document's own (keyed) value, m multiplies it; e.g.
//                   { cShift: 0.04 } slides the colours, { 'cInGam*': 0.7 } takes the greys further along the Colorama (richer, its own
//                   colours: flow 6.2's surges' intensity); adjust({}) clears it
//   pathTime(s)     the path shift (Alive "Path shift") on this clock instead of the alive one (null: back to the alive clock), so a
//   pathUp(k)       the path shift's upward part x k (0-1; 1 = as made): the drift's other directions and timing as they are
//                   page can hold the path still while the breath and the drift go on (flow 6.24: it pauses with the landing's pulse)
//   opts.region [x, y, w, h]: only that part of the comp (comp px from its top-left), filling the page: a small page showing one spot of
//     the comp (a button) draws just that spot, not the whole screen. opts.dpr: its sharpness (default the document's, at most the device's)
// ============================================================================================
const VW = { z: 1, ox: 0, oy: 0, fit: true, w: 1, h: 1 };
let need = true;
function touch() { need = true; }
function lutChanged() { }
const EXP = window.RZS_EXPORT || {}, OPT = Object.assign({ loop: 'timeline', fit: 'cover' }, EXP.opts || {});
{ const q = new URLSearchParams(location.search); if (q.has('once')) OPT.loop = 'once'; if (q.get('fit')) OPT.fit = q.get('fit'); if (q.has('t')) OPT.hold = +q.get('t'); }
D = normalize(EXP.doc);
D.view.mode = 'final'; D.view.ref = false; D.view.fps = 0;
if (OPT.loop === 'once') D.tl.loop = false;
D.tl.t = isFinite(OPT.hold) ? clamp(OPT.hold, 0, D.tl.dur) : 0; D.tl.play = !isFinite(OPT.hold) && !OPT.paused;
const HOLD = { on: false };   // holdLoop(): the loop range repeats until released
const OFS = { x: 0, y: 0 };   // offset(): the shapes moved, the bands not
const XF = { kx: 1, ky: 1, px: 0, py: 0, kb: 1 };   // shapes(): the shapes scaled round a point, the bands not
let ADJ = {};   // adjust(): live nudges on the page's values
{ const ev0 = evShape; evShape = s => { const o = ev0(s);
  if (XF.kx !== 1 || XF.ky !== 1 || XF.kb !== 1) { o.x = XF.px + (o.x - XF.px) * XF.kx; o.y = XF.py + (o.y - XF.py) * XF.ky; o.sx *= XF.kx; o.sy *= XF.ky; o.bh *= XF.kx * XF.kb; o.bv *= XF.ky * XF.kb; }
  if (OFS.x || OFS.y) { o.x += OFS.x; o.y += OFS.y; } return o; }; }
const PTH = { t: null, up: 1 }, PTH0 = { t: null, up: 1, on: false };
function compPath(c) {   // patch 10: a comp's own path clock / upward part while it renders (c null: back to the page-wide ones)
  if (!c) { if (PTH0.on) { PTH.t = PTH0.t; PTH.up = PTH0.up; PTH0.on = false; } return; }
  if (!PTH0.on) { PTH0.t = PTH.t; PTH0.up = PTH.up; PTH0.on = true; }
  PTH.t = c.pt !== undefined ? c.pt : PTH0.t; PTH.up = c.pu != null ? c.pu : PTH0.up;
}   // pathTime(): the path shift on a clock of its own (null: the alive clock, as in the studio); pathUp(k): its upward part x k
{ const as0 = aliveShape;
  const shifted = s => { const q = shiftPts(s.pts, s.psA, PTH.t * (s.psSp ?? 1), s.brP, s.brSd); return PTH.up >= 0.999 ? q : q.map((p, i) => p.y < s.pts[i].y ? Object.assign({}, p, { y: s.pts[i].y + (p.y - s.pts[i].y) * PTH.up }) : p); };
  aliveShape = (s, t) => PTH.t == null || !(s.psA > 0.01) || !s.pts || s.pts.length < 2 ? as0(s, t)
  : as0(Object.assign({}, s, { pts: shifted(s), psA: 0 }), t); }   // shifted here, the breath on it there (the studio's order)
{ const ep0 = evalParams; evalParams = () => { const P = ep0(); for (const k in ADJ) { const m = k.endsWith('*'), n = m ? k.slice(0, -1) : k; if (typeof P[n] === 'number') P[n] = m ? P[n] * ADJ[k] : P[n] + ADJ[k]; } return P; }; }
// the comp in the window: cover (fill it) or contain (all of it), at the device's pixel ratio (capped like the studio)
function layout() {
  const w = Math.max(1, vpc.clientWidth), h = Math.max(1, vpc.clientHeight), dpr = Math.min(window.devicePixelRatio || 1, Math.max(0.5, +OPT.dpr || +D.view.dpr || 1.6));
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); VW.w = w; VW.h = h;
  if (OPT.fit === 'fixed') { VW.z = +OPT.scale || 1; VW.ox = 0; VW.oy = 0; need = true; return; }   // patch 11: the comp at a fixed scale from the top-left (placed by the page)
  const RG = Array.isArray(OPT.region) && OPT.region[2] > 0 && OPT.region[3] > 0 ? OPT.region : null;
  if (RG) { VW.z = Math.max(w / RG[2], h / RG[3]); VW.ox = w / 2 - (RG[0] + RG[2] / 2) * VW.z; VW.oy = h / 2 - (RG[1] + RG[3] / 2) * VW.z; need = true; return; }
  VW.z = (OPT.fit === 'contain' ? Math.min : Math.max)(w / D.comp.w, h / D.comp.h);
  VW.ox = (w - D.comp.w * VW.z) / 2; VW.oy = (h - D.comp.h * VW.z) / 2; need = true;
}
function loopRange() { const r = D.tl.range; if (!r || !(r[1] - r[0] > 1e-3)) return null; return [clamp(r[0], 0, D.tl.dur), clamp(r[1], 0, D.tl.dur)]; }   // = 05-timeline's
// the timeline, as the studio plays it: a loop range (N times, then on past it; or forever), then the end (loop or hold)
const TLOOP = { done: 0 };
function advance(dt) {
  const sp = D.tl.speed || 1, t0 = D.tl.t, a0 = aliveT(); D.tl.t += dt * sp; live += dt * sp; frameNo++;
  const rg = loopRange(), N = rg ? (HOLD.on ? 1e9 : Math.max(0, Math.round(+D.tl.rangeN || 0))) : 0;
  if (rg && N > 0) {
    if (t0 < rg[1] && D.tl.t >= rg[1] && TLOOP.done < N - 1) { D.tl.t = rg[0] + (D.tl.t - rg[1]) % (rg[1] - rg[0]); TLOOP.done++; }
    else if (D.tl.t >= D.tl.dur) { if (D.tl.loop) { D.tl.t %= Math.max(D.tl.dur, 1e-3); TLOOP.done = 0; } else { D.tl.t = D.tl.dur; D.tl.play = false; } }
  } else if (rg) { if (D.tl.t >= rg[1] || D.tl.t < rg[0] - 1e-6) { if (D.tl.loop || D.tl.t < rg[0]) D.tl.t = D.tl.t >= rg[1] ? rg[0] + (D.tl.t - rg[1]) % (rg[1] - rg[0]) : rg[0]; else { D.tl.t = rg[1]; D.tl.play = false; } } }
  else if (D.tl.t >= D.tl.dur) { if (D.tl.loop) D.tl.t %= Math.max(D.tl.dur, 1e-3); else { D.tl.t = D.tl.dur; D.tl.play = false; } }
  aliveTo(a0 + dt * sp);   // live motion goes on through every wrap
  if (!D.tl.play) ALIVE.end = true;   // played once to its end: the last frame holds, but anything alive keeps living
}
let last = -1;
function frame(ts) {
  requestAnimationFrame(frame);
  const t = ts / 1000, dt = last < 0 ? 0 : Math.min(t - last, 0.1); last = t;
  if (D.tl.play) { advance(dt); need = true; }
  else if (ALIVE.end && anyAlive()) { aliveHold(dt); need = true; }
  if (need) { need = false; try { render(); } catch (e) { console.error(e); } }
}
function startTime() { const rg = loopRange(); return rg && !(+D.tl.rangeN > 0) ? rg[0] : 0; }
window.RZS_PLAYER = {
  play() { if (D.tl.t >= D.tl.dur - 1e-3) D.tl.t = startTime(); ALIVE.end = false; D.tl.play = true; },
  pause() { D.tl.play = false; ALIVE.end = false; },
  restart() { D.tl.t = startTime(); live = 0; TLOOP.done = 0; ALIVE.ofs = 0; ALIVE.t = D.tl.t; ALIVE.end = false; D.tl.play = true; need = true; },
  seek(s, alive) { D.tl.t = clamp(+s || 0, 0, D.tl.dur); ALIVE.end = false; if (alive != null && isFinite(alive)) { ALIVE.t = D.tl.t; ALIVE.ofs = +alive - D.tl.t; } need = false; try { render(); } catch (e) { console.error(e); } },   // drawn at once (the canvas holds that frame now); alive: the live clock too (flow 6.2 drives the time itself: a loop that wraps keeps breathing on)
  get time() { return D.tl.t; }, get duration() { return D.tl.dur; }, get playing() { return D.tl.play; },
  holdLoop(on) { HOLD.on = !!on; if (!on) { const n = Math.max(0, Math.round(+D.tl.rangeN || 0)); TLOOP.done = Math.max(TLOOP.done, n - 1); } },
  offset(x, y) { x = +x || 0; y = +y || 0; if (x !== OFS.x || y !== OFS.y) { OFS.x = x; OFS.y = y; need = true; } },
  shapes(kx, ky, px, py, kb) { kx = +kx || 1; ky = +ky || 1; px = +px || 0; py = +py || 0; kb = +kb || 1; if (kx !== XF.kx || ky !== XF.ky || px !== XF.px || py !== XF.py || kb !== XF.kb) { Object.assign(XF, { kx, ky, px, py, kb }); need = true; } },
  pathUp(k) { const n = Math.max(0, Math.min(1, +k)); if (isFinite(n) && n !== PTH.up) { PTH.up = n; need = true; } },   // 2026-10-23 (flow 6.3): the path drift's upward part only
  pathTime(v) { const n = v == null || !isFinite(+v) ? null : +v; if (n !== PTH.t) { PTH.t = n; need = true; } },
  adjust(o) { const n = {}; for (const k in o || {}) if (isFinite(+o[k]) && (k.endsWith('*') ? +o[k] !== 1 : +o[k])) n[k] = +o[k]; if (JSON.stringify(n) !== JSON.stringify(ADJ)) { ADJ = n; need = true; } },
  // ds (2026-11-03): comp(id, { op, t }) = that comp's opacity from the page (x the doc's own; 0 = not drawn: 'root' too) and its own clock
  // (seconds; null = the shared one): one canvas plays a chain of states (a remnant idling on its clock while the root starts thinking again)
  comp(id, o) { const r = rootDoc(), e = id === 'root' ? r : (r.stack || []).find(x => x.id === id); if (!e || !o) return; const L = e._live || (e._live = {});
    if ('op' in o) L.op = o.op == null ? null : clamp(+o.op, 0, 1); if ('t' in o) L.t = o.t == null || !isFinite(+o.t) ? null : +o.t;
    if ('al' in o) L.al = o.al == null || !isFinite(+o.al) ? null : +o.al;
    if ('pt' in o) L.pt = o.pt == null || !isFinite(+o.pt) ? null : +o.pt; if ('pu' in o) L.pu = o.pu == null ? null : clamp(+o.pu, 0, 1); need = true; },   // pt: its path clock (null: the alive one), pu: its upward part (patch 10)   // al: its own alive clock (patch 9)
  group(n, o) { const r = rootDoc(), G = r._groups || (r._groups = {}), g = G[n] || (G[n] = {}); if (!o) return;   // patch 9: a group's opacity and blend ('add' = plus-lighter)
    if ('op' in o) g.op = o.op == null ? null : clamp(+o.op, 0, 1); if ('blend' in o) g.blend = o.blend;
    if ('dx' in o) g.dx = +o.dx || 0; if ('dy' in o) g.dy = +o.dy || 0; need = true; },   // dx, dy: where the group's page sits (CSS px, patch 11)
  get alive() { return aliveT(); }, set alive(v) { aliveT(); ALIVE.ofs = (+v || 0) - D.tl.t; ALIVE.t = D.tl.t; need = true; },
};
if (!initGL()) document.body.textContent = 'This browser has no WebGL2.';
else { layout(); addEventListener('resize', layout); requestAnimationFrame(frame); }
