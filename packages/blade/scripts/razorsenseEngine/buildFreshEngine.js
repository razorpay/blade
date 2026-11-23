#!/usr/bin/env node
/* eslint-disable */
/**
 * Builds RazorSenseEngine/freshEngine.ts, the engine every RazorSense 2.0 component draws with, from the RazorSense system's own
 * engine (source/: 01-core.js, 02-gl.js and player.js, Razorsensation's studio and player) and its GPU speed-ups (gpu_raster.js).
 * The engine is the studio's, so it isn't rewritten here: it's patched, as text, into a factory (createFreshEngine) that mounts
 * one comp on one canvas, without the studio's page, its saving, or its globals. Every patch's `old` text must be in the source
 * exactly as many times as it says (once, unless noted), or the build stops: when source/ moves on, the patches move with it.
 *
 *   node scripts/razorsenseEngine/buildFreshEngine.js            writes src/components/Spark/RazorSenseEngine/freshEngine.ts
 *   node scripts/razorsenseEngine/buildFreshEngine.js --check    fails if the committed engine isn't what source/ builds
 *
 * Its patches, in order: the GPU speed-ups (raster, scissor, trim, box; gpu_raster.js); the factory (the export and the switches as
 * its arguments, the canvas, box and message from its host, no window globals or page listeners); no studio saving; shaders
 * compiled and linked without holding the page up (KHR_parallel_shader_compile, drawing once they're ready); then the factory's
 * start and its returned player. Then the main shader without the features no comp uses (and a check that none does), the shaders
 * without comments, and the whole engine minified with terser.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const BLADE = path.join(HERE, '..', '..');
const OUT = path.join(BLADE, 'src', 'components', 'Spark', 'RazorSenseEngine', 'freshEngine.ts');
const read = (name) => fs.readFileSync(path.join(HERE, 'source', name), 'utf8');

/** `old` in `src` exactly `n` times, replaced by `next` */
const sub = (src, old, next, n = 1) => {
  const found = src.split(old).length - 1;
  if (found !== n) {
    throw new Error(`expected ${n} x ${JSON.stringify(old.slice(0, 120))} in the engine, found ${found}: update the patch`);
  }
  return src.split(old).join(next);
};
/** every `pattern` (a global RegExp, or text) made `next`: at least one must be there, as sub() checks its text is */
const subAll = (src, pattern, next) => {
  const found = typeof pattern === 'string' ? src.split(pattern).length - 1 : (src.match(pattern) || []).length;
  if (found === 0) {
    throw new Error(`expected ${String(pattern)} in the engine, found none: update the patch`);
  }
  return typeof pattern === 'string' ? src.split(pattern).join(next) : src.replace(pattern, next);
};

let src = ['01-core.js', '02-gl.js', 'player.js'].map(read).join('\n');
src = sub(src, `function buildLayer(`, read("gpu_raster.js") + `function buildLayer(`);   // the GPU speed-ups, in before buildLayer
src = sub(src, `rasterShape(s, L, R.raw, xp);`, `if (gpuOk(s)) R.src = gpuRaster(s, L, R, xp); else { rasterShape(s, L, R.raw, xp); R.src = R.raw; }`);
src = sub(src, `blurPass(R.raw, A, [1, 0], bsx)`, `blurPass((R.src || R.raw), A, [1, 0], bsx)`);
src = sub(src, `blurPass(R.raw, B, [1, 0], bsx)`, `blurPass((R.src || R.raw), B, [1, 0], bsx)`);
src = sub(src, `blurPass(R.raw, B, [0, 1], bsy)`, `blurPass((R.src || R.raw), B, [0, 1], bsy)`);
src = sub(src, `L.tex = R.raw;`, `L.tex = R.src || R.raw;`);
src = sub(src, `function dropLayer(id) { const R = GL.layers.get(id); if (!R) return; gl.deleteTexture(R.raw);`, `function dropLayer(id) { const R = GL.layers.get(id); if (!R) return; gl.deleteTexture(R.raw); if (R.g) gl.deleteTexture(R.g.t);`);
src = sub(src, `for (const R of rc.layers.values()) { gl.deleteTexture(R.raw);`, `for (const R of rc.layers.values()) { gl.deleteTexture(R.raw); if (R.g) gl.deleteTexture(R.g.t);`);
src = sub(src, `if (aeG || P.accTrim) {`, `if (aeG || P.accTrim || GPU_TRIM) {`);
src = sub(src, `  return { s, sH, sV, kx, ky, rw, rh, padX, padY, rect: [-padX, -padY, rw / kx, rh / ky] };`, `  return { s, sH, sV, kx, ky, rw, rh, padX, padY, rect: [-padX, -padY, rw / kx, rh / ky], cb: grBox(s, sH, sV, kx, ky, xp) };`);
src = sub(src, `      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  };`, `      if (GPU_SCISSOR) grScissor(s, L, m ? lays.get(m.id) : null, ag, rect, aw, ah);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.SCISSOR_TEST); gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  };`);
src = sub(src, `  const fx = sH * k0 > SIGMA_WORK ? sH * k0 / SIGMA_WORK : 1, fy = sV * k0 > SIGMA_WORK ? sV * k0 / SIGMA_WORK : 1;`, `  const fx = grQf(sH * k0 > SIGMA_WORK ? sH * k0 / SIGMA_WORK : 1), fy = grQf(sV * k0 > SIGMA_WORK ? sV * k0 / SIGMA_WORK : 1);`);
src = sub(src, `  const padX = xp ? Math.ceil(3 * sH + maxD + 4) : 0, padY = xp ? Math.ceil(3 * sV + maxD + 4) : 0;`, `  const padX = grQp(xp ? Math.ceil(3 * sH + maxD + 4) : 0), padY = grQp(xp ? Math.ceil(3 * sV + maxD + 4) : 0);`);
src = sub(src, `const kS = typeof OPT === 'object' && OPT && +OPT.srcBudget > 0 ? Math.min(k0, Math.sqrt(+OPT.srcBudget / (D.comp.w * D.comp.h))) : k0;`, `const kS = typeof OPT === 'object' && OPT && +OPT.srcBudget > 0 ? Math.min(grQk(k0), Math.sqrt(+OPT.srcBudget / (D.comp.w * D.comp.h))) : grQk(k0);`);
src = sub(src, `rx = reach + 3 / ax + 2, ry = reach + 3 / ay + 2;`, `rx = GPU_STABLE ? Math.ceil((reach + 3 / ax + 2) / 32) * 32 : reach + 3 / ax + 2, ry = GPU_STABLE ? Math.ceil((reach + 3 / ay + 2) / 32) * 32 : reach + 3 / ay + 2;`);
src = sub(src, `function layerTarget(R, name, w, h) { const T = R[name]; if (T && T.w === w && T.h === h) return T; if (T) { gl.deleteTexture(T.t); gl.deleteFramebuffer(T.f); } return (R[name] = makeTarget(w, h)); }`, `function layerTarget(R, name, w, h) { const T = R[name]; if (T && T.w === w && T.h === h) return T; if (T) grPut(T); return (R[name] = grTake(w, h) || makeTarget(w, h)); }`);
src = sub(src, `function target(name, w, h) {
  const T = GL[name]; if (T && T.w === w && T.h === h) return T;
  if (T) { gl.deleteTexture(T.t); gl.deleteFramebuffer(T.f); }
  return (GL[name] = makeTarget(w, h));
}`, `function target(name, w, h) {
  const T = GL[name]; if (T && T.w === w && T.h === h) return T;
  if (T) grPut(T);
  return (GL[name] = grTake(w, h) || makeTarget(w, h));
}`);
src = sub(src, `  return { tex: ACC.t, clipTex, nbTex, ovTex, smask, cmask, freeTex, w: aw, h: ah, rect, cubic:`, `  return { cbox: GPU_BOX ? grUnion(lays, [...drawn, ...clips], matteOf, smask) : null, tex: ACC.t, clipTex, nbTex, ovTex, smask, cmask, freeTex, w: aw, h: ah, rect, cubic:`);
src = sub(src, `  gl.drawArrays(gl.TRIANGLES, 0, 3);
  STATS.cpu = performance.now() - t0; STATS.frames++;
}`, `  grMain(grSpec(pr), src, P, k0, (VW.ox + D.comp.w * VW.z * (1 - zP) / 2) * dpr, (VW.oy + D.comp.h * VW.z * (1 - zP) / 2) * dpr, dest, alphaOut, window.RZS_EXPORT ? hex2rgb(P.cBgCol) : [10 / 255, 10 / 255, 10 / 255]);
  STATS.cpu = performance.now() - t0; STATS.frames++;
}`);
src = sub(src, `if (!mt && !cuts.length) smask = { tex: L.tex, rect: L.rect, feather: F > 0, op: clamp(msh.op, 0, 1) };`, `if (!mt && !cuts.length) smask = { tex: L.tex, rect: L.rect, feather: F > 0, op: clamp(msh.op, 0, 1), cb: L.cb };`);
src = sub(src, `smask = { feather: F > 0, op: clamp(msh.op, 0, 1) };`, `smask = { feather: F > 0, op: clamp(msh.op, 0, 1), cb: L.cb };`);
src = sub(src, `  const pr = GL.pMain;
`, `  const pr = GL.pMain; grRecStart();
`);
src = sub(src, `if (GT) clearTo(GT, false);`, `if (GT) { clearTo(GT, false); GR_ACC = { T: GT, box: [0, 0, 0, 0] }; }`);
// Default Paused 2.0 (2026-11-24): a group put together on the page's own ground (group(name, { ground: true })), opaque, so laid over at
// weight w it's an exact crossfade into it: (1 - w) x the picture under it + w x its own, as the login mirror's second player over the
// first (its loop's start faded in over its end). Laid over whole (its ground is everywhere): no box. At weight 0 it isn't drawn at all
src = sub(
  src,
  `const vis = q.m.filter(([c, i]) => (i === 0 ? rootOp : c.op) > 1e-4), GT = !single && vis.length > 1 ? target('GRP_ACC', cv.width, cv.height) : null;
          if (GT) { clearTo(GT, false); GR_ACC = { T: GT, box: [0, 0, 0, 0] }; }`,
  `const vis = q.m.filter(([c, i]) => (i === 0 ? rootOp : c.op) > 1e-4), gnd = !GL_ALPHA && !!(GR[q.n] && GR[q.n].ground), GT = (!single && vis.length > 1) || gnd ? target('GRP_ACC', cv.width, cv.height) : null;
          if (GT) { clearTo(GT, gnd); GR_ACC = { T: GT, box: gnd ? null : [0, 0, 0, 0] }; }`,
);
src = sub(src, `if ('blend' in o) g.blend = o.blend;`, `if ('blend' in o) g.blend = o.blend; if ('ground' in o) g.ground = !!o.ground;`);
// Default Paused 2.0 (2026-11-24): a stack comp drawn with another's GPU state (its stack entry's rc: that comp's id). The crossfade's
// page is every comp again at another moment; each copy draws with its twin's layers, one after the other, so its layer textures aren't
// made twice (the piece's GPU memory 57.7 -> see _decisions). Every layer is drawn again each frame anyway (the alive clock moves
// every shape), and each cache keeps its own signature, so a copy never reads its twin's pixels as its own
src = sub(src, `grp: e.grp ? String(e.grp).slice(0, 24) : undefined, doc:`, `grp: e.grp ? String(e.grp).slice(0, 24) : undefined, rc: e.rc ? String(e.rc).slice(0, 40) : undefined, doc:`);
src = sub(src, `g: e.grp || 'main', pt: lv(e).pt`, `g: e.grp || 'main', rc: e.rc, pt: lv(e).pt`);
src = sub(src, `useRC(c.id); if (typeof compPath === 'function') compPath(c);`, `useRC(c.rc || c.id); if (typeof compPath === 'function') compPath(c);`, 2);
src = sub(src, `cmask = { tex: L.tex, rect: L.rect, op: clamp(cmsh.op, 0, 1) };`, `cmask = { tex: L.tex, rect: L.rect, op: clamp(cmsh.op, 0, 1), cb: L.cb };`);
src = sub(src, `  gl.enable(gl.BLEND); gl.blendFunc(gl[b[0]], gl[b[1]]); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
const WARM`, `  let lb = GR_LAY && GR_LAY.T === T ? GR_LAY.box : null; GR_LAY = null;   // (a clear picture: only its box has anything to lay)
  if (dst && GR_ACC && GR_ACC.T === dst) GR_ACC.box = lb && GR_ACC.box ? grJoin(GR_ACC.box, lb) : null;   // (a group's buffer: the boxes laid in it)
  else if (!dst && GR_ACC && GR_ACC.T === T) { lb = GR_ACC.box; GR_ACC = null; }   // (that buffer onto the page: only where its layers are)
  if (lb) { gl.enable(gl.SCISSOR_TEST); gl.scissor(lb[0], lb[1], lb[2], lb[3]); }
  gl.enable(gl.BLEND); gl.blendFunc(gl[b[0]], gl[b[1]]); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  if (lb) gl.disable(gl.SCISSOR_TEST);
}
const WARM`);
src = subAll(src, new RegExp("(?:window\\.)?RZS_EXPORT\\b", "g"), `__EXP`);
src = subAll(src, new RegExp("window\\.RZS_GPU\\b", "g"), `__GPU`);
src = sub(src, `const GR_STAT = window.__GR_STAT = { box: 0 };`, `const GR_STAT = { box: 0 };`);
src = sub(src, `window.RZS_PLAYER = {`, `const RZS_PLAYER = {`);
src = subAll(src, `location.search`, `__search`);
src = sub(src, `$('#gl')`, `__host.canvas`);
src = sub(src, `$('#vpc')`, `__host.box`);
src = sub(src, `$('#msg')`, `__host.msg`);
src = sub(src, `addEventListener('pagehide', () => { flushStore(SD, docValues); flushStore(SP, preValues); });`, ``);
src = sub(src, `function saveStore(st, get) { if (PLAYER) return; st.pending = true; clearTimeout(st.timer); st.timer = setTimeout(() => saveStoreNow(st, get), 250); }
function saveStoreNow(st, get) {
  if (PLAYER) return;
  st.pending = false; st.savedAt = Date.now();
  const body = JSON.stringify({ savedAt: st.savedAt, values: get() });
  try { localStorage.setItem(st.ls, body); } catch (e) { }
  if (STANDALONE) { st.ok = true; showSave(); return; }
  fetch(API(st.name), { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body, keepalive: body.length < 60000 })
    .then(r => { st.ok = r.ok; showSave(); }).catch(() => { st.ok = false; showSave(); });
}
function flushStore(st, get) {
  if (PLAYER) return;
  if (!st.pending) return;
  clearTimeout(st.timer); st.pending = false;   // r28: the debounced save must not fire later with another project's document
  st.savedAt = Date.now(); const body = JSON.stringify({ savedAt: st.savedAt, values: get() });
  try { localStorage.setItem(st.ls, body); } catch (e) { }
  if (!STANDALONE) try { navigator.sendBeacon(API(st.name), new Blob([body], { type: 'text/plain' })); } catch (e) { }
}

async function loadStore(st, field) {
  let best = null;
  try { const l = JSON.parse(localStorage.getItem(st.ls)); if (l && l.values && l.values[field]) best = l; } catch (e) { }
  if (STANDALONE) {   // what was saved in this browser, else what the file came with (whichever is newer)
    const s = STANDALONE.stores && STANDALONE.stores[st.name]; st.ok = true;
    if (s && s.values && s.values[field] && (!best || (s.savedAt || 0) > (best.savedAt || 0))) best = s;
    return best;
  }
  try {
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 1500);
    const r = await fetch(API(st.name), { cache: 'no-store', signal: ctl.signal }); clearTimeout(tm);
    st.ok = r.ok;
    if (r.ok) { const s = await r.json(); if (s && s.values && s.values[field] && (!best || (s.savedAt || 0) >= (best.savedAt || 0))) best = s; }
  } catch (e) { st.ok = false; }
  return best;
}
`, `function saveStore() {}
function flushStore() {}
async function loadStore() { return null; }
`);
src = sub(src, `const API = n => (location.protocol === 'file:' ? 'http://localhost:8737' : '') + '/api/settings/' + n;`, ``);
src = sub(src, "function program(fs) {\n  const p = gl.createProgram();\n  gl.attachShader(p, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);\n  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));\n  const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);\n  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace(/\\[0\\]$/, '')] = gl.getUniformLocation(p, info.name); }\n  return { p, u };\n}", "// Blade: with no KHR_parallel_shader_compile (Firefox, Chrome on many Android phones), asking whether a program is linked waits for\n// its compile (a first hover held the page about 0.3 s in Firefox; a first load over a second on a mid-range Android phone). A fence\n// put in after the link is asked instead, which never waits: once it has passed, the GPU has got through the link\nconst LINK_WAIT_MS = 150, LINK_WAIT_MAX_MS = 4000;\nfunction linkLater(vs, fs, attribs) {   // Blade: compiled and linked, not asked: progReady asks once the driver says it's done\n  const p = gl.createProgram(), v = gl.createShader(gl.VERTEX_SHADER), f = gl.createShader(gl.FRAGMENT_SHADER);\n  gl.shaderSource(v, vs); gl.compileShader(v); gl.shaderSource(f, fs); gl.compileShader(f);\n  gl.attachShader(p, v); gl.attachShader(p, f);\n  if (attribs) attribs.forEach((a, i) => gl.bindAttribLocation(p, i, a));\n  gl.linkProgram(p);\n  const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); gl.flush();   // Blade: passed once the GPU has got through the link\n  return { p, u: null, v, f, t0: performance.now(), fence };\n}\nfunction program(fs) { return linkLater(VS, fs); }\nfunction progReady(P, names) {   // Blade: true once P can draw (its uniforms found); false while the driver is still on it\n  if (P.u) return true;\n  if (GL.par && !gl.getProgramParameter(P.p, GL.par.COMPLETION_STATUS_KHR)) return false;\n  if (!GL.par) {   // Blade: no way to ask without waiting (Firefox, many Android phones): asked once the fence after its link has passed (asked without waiting), at least LINK_WAIT_MS on, at most LINK_WAIT_MAX_MS\n    const waited = performance.now() - P.t0;\n    if (waited < LINK_WAIT_MS) return false;\n    if (P.fence && waited < LINK_WAIT_MAX_MS && gl.getSyncParameter(P.fence, gl.SYNC_STATUS) !== gl.SIGNALED) return false;\n  }\n  if (P.fence) { gl.deleteSync(P.fence); P.fence = null; }\n  if (!gl.getProgramParameter(P.p, gl.LINK_STATUS)) throw new Error(gl.getShaderInfoLog(P.f) || gl.getShaderInfoLog(P.v) || gl.getProgramInfoLog(P.p));\n  const u = {};\n  if (names) for (const n of names) u[n] = gl.getUniformLocation(P.p, n);\n  else { const n = gl.getProgramParameter(P.p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(P.p, i); u[info.name.replace(/\\[0\\]$/, '')] = gl.getUniformLocation(P.p, info.name); } }\n  P.u = u; return true;\n}");
src = sub(src, `GL = { half: !!gl.getExtension('EXT_color_buffer_float'), vao: gl.createVertexArray(), pMain: program(FS_MAIN), pBlur: program(FS_BLUR), pComp: program(FS_COMP), lut: newTex(), ACC: null, layers: new Map() };`, `GL = { par: gl.getExtension('KHR_parallel_shader_compile'), half: !!gl.getExtension('EXT_color_buffer_float'), vao: gl.createVertexArray(), pMain: __d3d && GPU_SPEC && gl.getExtension('KHR_parallel_shader_compile') ? grStandIn(FS_MAIN) : program(FS_MAIN), pBlur: program(FS_BLUR), pComp: program(FS_COMP), pCompAE: program(FS_COMP_AE), pLayer: program(FS_LAYER), pFill: program(FS_FILL), lut: newTex(), ACC: null, layers: new Map() };`);
src = sub(src, `const pr = GL.pLayer || (GL.pLayer = program(FS_LAYER)),`, `const pr = GL.pLayer,`);
src = sub(src, `const F = GL.pFill || (GL.pFill = program(FS_FILL));`, `const F = GL.pFill;`);
src = sub(src, `use(ag ? (GL.pCompAE || (GL.pCompAE = program(FS_COMP_AE))) : GL.pComp);`, `use(ag && progReady(GL.pCompAE) ? GL.pCompAE : GL.pComp);`);
src = sub(src, `function render() {
  if (!gl || glLost) return;`, `function render() {
  if (!gl || glLost) return;
  if (!(progReady(GL.pMain) && progReady(GL.pBlur) && progReady(GL.pComp) && progReady(GL.pLayer) && progReady(GL.pFill))) {   // Blade: not linked yet: nothing drawn, again next frame
    if (!GL.wait) GL.wait = requestAnimationFrame(() => { GL.wait = 0; if (!__dead) { try { render(); } catch (e) { console.error(e); } } });
    return;
  }`);
// the main pass's copies for its switches (grSpec): where the browser can't compile them in the background (no
// KHR_parallel_shader_compile: Firefox, Chrome on many Android phones) each would hold the page up again mid-animation (a frame of
// over a second on a mid-range Android phone), so there the general program draws throughout
src = sub(src, `function grSpec(pr) {   // -> the program to draw the main pass with (pr itself until the copy for these switches is ready)
  if (!GPU_SPEC) return pr;`, `function grSpec(pr) {   // -> the program to draw the main pass with (pr itself until the copy for these switches is ready)
  if (!pr.standIn && (!GPU_SPEC || !GL.par || __d3d)) return pr;`);
src = sub(src, `Q = { p, vs, fs, ready: false, bad: false };`, `Q = { p, vs, fs, ready: false, bad: false, t0: performance.now() };`);
src = sub(src, `    if (S.ext && !gl.getProgramParameter(Q.p, S.ext.COMPLETION_STATUS_KHR)) { GR_STAT.waits = (GR_STAT.waits || 0) + 1; return pr; }`, `    if (S.ext && !gl.getProgramParameter(Q.p, S.ext.COMPLETION_STATUS_KHR)) { GR_STAT.waits = (GR_STAT.waits || 0) + 1; return pr.standIn ? grRescue(pr, false) : pr; }
    if (!S.ext && performance.now() - Q.t0 < LINK_WAIT_MS) { GR_STAT.waits = (GR_STAT.waits || 0) + 1; return pr; }   // Blade: asked once the driver has had time`);
// Direct3D (ANGLE on Windows): the general main pass takes ~50 s to compile on a GTX 1650 laptop, and a copy of it with its switches
// written in (grSpec) 0.1-0.7 s (the device test's shader lab). There the general one is never compiled: a stand-in with its uniforms'
// names takes its place (grStandIn), each frame's settings are recorded by name and drawn with the copy for its switches, and a frame
// whose copy isn't compiled yet is dropped before anything reaches the canvas (GR_MISS: the last frame, or the still, stays on). A
// copy that fails to compile falls back to the general one with its loops kept as loops (grLoops: ~11 s there), compiled only then
src = sub(src, `    if (!gl.getProgramParameter(Q.p, gl.LINK_STATUS)) { Q.bad = true; console.warn('spec main pass:', gl.getShaderInfoLog(Q.fs) || gl.getProgramInfoLog(Q.p)); return pr; }`, `    if (!gl.getProgramParameter(Q.p, gl.LINK_STATUS)) { Q.bad = true; console.warn('spec main pass:', gl.getShaderInfoLog(Q.fs) || gl.getProgramInfoLog(Q.p)); return pr.standIn ? grRescue(pr, true) : pr; }`);
src = sub(src, `  if (Q.bad) return pr;
  gl.useProgram(Q.p);`, `  if (Q.bad) return pr.standIn ? grRescue(pr, true) : pr;
  gl.useProgram(Q.p);`);
src = sub(src, `gl[n] = (L, ...a) => { if (GR_REC.on) GR_REC.calls.push([n, L, a]); return f(L, ...a); };`, `gl[n] = (L, ...a) => { if (GR_REC.on) GR_REC.calls.push([n, L, a]); return L && L.standIn ? undefined : f(L, ...a); };`);
src = sub(src, `const GR_SW = /^u(`, String.raw`const GR_MISS = { miss: true };   // Blade: thrown by grSpec: this frame is dropped (render)
function grStandIn(fs) {   // Blade: the general main pass's uniforms by name, nothing compiled (Direct3D: its frames go to the copies)
  const u = {};
  for (const m of fs.matchAll(/^uniform\s+(?:(?:lowp|mediump|highp)\s+)?\w+\s+([^;]+);/gm)) for (const d of m[1].split(',')) { const n = d.trim().replace(/\[.*$/, ''); if (n) u[n] = { standIn: n }; }
  return { p: null, u, standIn: true };
}
const grLoops = fs => fs.replace(/^(precision highp int;)$/m, '$1\nuniform int uLoop0;').replace(/for \(int (\w+) = (\d+); \1 < (\d+); \1\+\+\)/g, 'for (int $1 = $2; $1 < $3 + uLoop0; $1++)').replace(/for \(int (\w+) = (\d+); \1 >= 0; \1--\)/g, 'for (int $1 = $2 + uLoop0; $1 >= 0; $1--)');   // Blade: loop counts the compiler can't know (uLoop0 is 0), so Direct3D's keeps them as loops instead of unrolling them
function grRescue(pr, start) {   // Blade: no copy to draw with (compiling, or failed): the general one with its loops kept, once it's ready; till then the frame is dropped
  if (start && !GL.pMainLoops) GL.pMainLoops = program(grLoops(FS_MAIN));
  const R = GL.pMainLoops;
  if (!R || !progReady(R)) { GR_STAT.misses = (GR_STAT.misses || 0) + 1; throw GR_MISS; }
  gl.useProgram(R.p);
  for (const [n, L, a] of GR_REC.calls) { const k = GL.spec.names.get(L), M = k && R.u[k]; if (M) gl[n](M, ...a); }
  return R;
}
const GR_SW = /^u(`);
src = sub(src, `function render() {
  if (!gl || glLost) return;
  if (!(progReady(GL.pMain)`, `function render() {   // Blade: a frame whose main-pass copy isn't compiled yet (Direct3D, grSpec) is dropped whole, and tried again next frame
  try { renderFrame(); if (GL) GL.gpuWait = false; } catch (e) {
    if (e !== GR_MISS) throw e;
    GL.gpuWait = true;
    if (!GL.wait) GL.wait = requestAnimationFrame(() => { GL.wait = 0; if (!__dead) { try { render(); } catch (e) { console.error(e); } } });
  }
}
function renderFrame() {
  if (!gl || glLost) return;
  if (!(progReady(GL.pMain)`);
// the GPU raster's programs (grState) are made with the others as the context starts, not at its first shape: made then, a phone
// that can't compile in the background waited for them a second time, rastering the shapes on the CPU meanwhile
src = sub(src, `  gl.bindVertexArray(GL.vao);
  lutSig = '';`, `  gl.bindVertexArray(GL.vao);
  if (GPU_RASTER) grState();   // Blade: compiled with the rest, from the start
  lutSig = '';`);
// Direct3D (ANGLE on Windows): told apart by the GPU's name (__d3d), for its main pass (grStandIn, above)
src = sub(src, `  if (!gl) return false;
  GL = {`, `  if (!gl) return false;
  { const i = gl.getExtension('WEBGL_debug_renderer_info'); __d3d = /Direct3D|D3D1[01]/i.test(i ? String(gl.getParameter(i.UNMASKED_RENDERER_WEBGL)) : ''); }
  GL = {`);
src = sub(src, `function grProg(fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, VS_GR)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aP'); gl.bindAttribLocation(p, 1, 'aE'); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; for (const n of ['uOff', 'uSize', 'uCol', 'uClip', 'uClipOn']) u[n] = gl.getUniformLocation(p, n);
  return { p, u };
}`, `const GR_U = ['uOff', 'uSize', 'uCol', 'uClip', 'uClipOn'];
function grProg(fs) { return linkLater(VS_GR, fs, ['aP', 'aE']); }
function grReady() { const G = grState(); return progReady(G.fill, GR_U) && progReady(G.cvx, GR_U); }   // Blade: Canvas2D draws the shapes till then`);
src = sub(src, `const gpuOk = s => GPU_RASTER && !s.vsrc && !s.isrc && (s.fill || 'solid') === 'solid';`, `const gpuOk = s => GPU_RASTER && !s.vsrc && !s.isrc && (s.fill || 'solid') === 'solid' && grReady();`);
src = sub(src, `function frame(ts) {
  requestAnimationFrame(frame);`, `function frame(ts) {
  if (__dead || !__run) { __raf = 0; return; } __raf = requestAnimationFrame(frame);`);
// A restored context (after sleep(), or the browser's own loss) draws the frame it had again, at once, retried each frame while its
// programs compile: a paused engine, or one with reduced motion, runs no frames of its own to do it
src = sub(src, `cv.addEventListener('webglcontextrestored', () => { try { initGL(); glLost = false; touch(false); } catch (e) {`, `cv.addEventListener('webglcontextrestored', () => { try { initGL(); glLost = false; touch(false); __redraw(); } catch (e) {`);
src = sub(src, `function showMsg(t) {`, `function __redraw() {
  const n = STATS.frames, until = performance.now() + 10000;
  const go = () => { if (__dead || glLost || STATS.frames > n || performance.now() > until) return; try { render(); } catch (e) { } requestAnimationFrame(go); };
  requestAnimationFrame(go);
}
function showMsg(t) {`);
// a cap on the canvas's pixel ratio the page can set (sharpness(): the weak-device steps), over the comp's own and the device's;
// and a pixel budget the page can set (opts.maxPx: a canvas that grows to the window, the lone bottom wave's outcome splash, draws at
// a lower sharpness rather than more pixels; never under half a CSS px)
src = sub(src, `dpr = Math.min(window.devicePixelRatio || 1, Math.max(0.5, +OPT.dpr || +D.view.dpr || 1.6));`, `dpr = Math.min(window.devicePixelRatio || 1, Math.max(0.5, +OPT.dpr || +D.view.dpr || 1.6), __dprCap || Infinity, +OPT.maxPx > 0 ? Math.max(0.5, Math.sqrt(+OPT.maxPx / (w * h))) : Infinity);`);
// the canvas sized only when its size changes: setting it, even to the same size, resets its drawing buffer (the page's box placed
// again without a new size; the engine's own resize observer straight after the page's, which had sized it already)
src = sub(src, `cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);`, `const cw = Math.round(w * dpr), ch = Math.round(h * dpr); if (cv.width !== cw) cv.width = cw; if (cv.height !== ch) cv.height = ch;`);
// Made a step at a time (freshEngineSteps, below): making an engine is one long task otherwise, 190-330 ms on a mid-range Android
// phone (about 1 s on its first visit after the engine changes, the browser compiling the engine's code as it runs), which is the
// page frozen. Each yield is a point the page may draw a frame between: the studio's tables, its blank document, the comp read in,
// then the GPU context with its programs (sent to the GPU to compile), then the canvas sized. Each part is one task of its own
src = sub(src, `let D = defaults();`, `let D = defaults();\nyield;`);
src = sub(src, `const BUILTIN = builtins();`, `const BUILTIN = builtins();\nyield;`);
src = sub(src, `D = normalize(EXP.doc);`, `yield;\nD = normalize(EXP.doc);`);
src = sub(src, `if (!initGL()) document.body.textContent = 'This browser has no WebGL2.';
else { layout(); addEventListener('resize', layout); requestAnimationFrame(frame); }`, `const __start = () => { if (!__raf && !__dead && __run) { last = -1; __raf = requestAnimationFrame(frame); } };
yield;
if (!initGL()) { if (__host.onError) __host.onError('webgl2'); }
// (held: made ahead of its comp, it draws nothing, not even on a resize, till load gives it one)
else { yield; layout(); __ro = new ResizeObserver(() => { layout(); if (!D.tl.play && !__held) { try { render(); } catch (e) { } } }); __ro.observe(vpc); __start(); }
return {
  player: RZS_PLAYER,
  ok: !!gl,
  setRunning(on) { __run = !!on; if (__run) __start(); },
  destroy(soft) {
    __dead = true; if (__raf) cancelAnimationFrame(__raf); __raf = 0; if (__ro) __ro.disconnect();
    try { VID_USED.clear(); vidCleanup(); } catch (e) { }
    // Blade: soft (an engine that never drew): its context isn't lost by hand, which waits for the GPU process: one stuck compiling
    // its shaders (Direct3D) held the page 47 s on a GTX 1650 laptop. It goes with the canvas instead
    if (!soft) { const x = gl && gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
  },
  stats: GR_STAT,
  // Blade: another comp on this canvas (a new colour scheme or scale): its GPU context and compiled programs kept, so nothing
  // new is made or compiled (a colour scheme switch rebuilt every engine on the page at once: the Windows freeze). Only with the
  // same clear-background setting, which is the context's: false otherwise, and the stage makes a new engine
  load(exp) {
    if (__dead || !gl || !!(exp && exp.opts && exp.opts.alpha) !== GL_ALPHA) return false;
    __held = false;
    for (const k of Object.keys(OPT)) delete OPT[k];
    Object.assign(OPT, { loop: 'timeline', fit: 'cover' }, exp.opts || {});
    D = normalize(exp.doc); D.view.mode = 'final'; D.view.ref = false; D.view.fps = 0;
    if (OPT.loop === 'once') D.tl.loop = false;
    D.tl.t = 0; D.tl.play = !OPT.paused;
    HOLD.on = false; OFS.x = 0; OFS.y = 0; Object.assign(XF, { kx: 1, ky: 1, px: 0, py: 0, kb: 1 }); ADJ = {};
    PTH.t = null; PTH.up = 1; TLOOP.done = 0; live = 0; ALIVE.ofs = 0; ALIVE.t = 0; ALIVE.end = false;
    layout(); need = true; last = -1;
    return true;
  },
  // Blade: its GPU memory given back while it's out of sight (its context lost on purpose; everything else kept), and made again
  // (wake: the context restored, its programs compiled again, from the browser's shader cache). False when it can't
  sleep() { if (__dead || !gl || glLost || __sleepX) return false; const x = gl.getExtension('WEBGL_lose_context'); if (!x) return false; __sleepX = x; x.loseContext(); return true; },
  wake() { const x = __sleepX; __sleepX = null; if (x && !__dead) x.restoreContext(); },
  // Blade: its canvas's pixel ratio capped (0: as the comp and the device say): the weak-device tier's lower sharpness
  sharpness(cap) { const n = +cap > 0 ? +cap : 0; if (n === __dprCap || __dead) return; __dprCap = n; layout(); need = true; },
  // Blade: frames it has drawn (0: none yet, its programs still compiling, or its GPU not drawing)
  drawn() { return STATS.frames; },
  // Blade: whether its last frame was dropped only for the GPU (Direct3D: the main pass's copy still compiling, in the background):
  // its own work for its first frame is done, so another engine starting now doesn't land on top of it
  waitsOnGpu() { return !!(GL && GL.gpuWait); },
};`);

// A component's own states on the shapes it draws (the PR's states, 2026-11-23), as the RazorSense system's pages add them:
// - look(h): a hook on every shape and the page values, for the comp being drawn (its id: 'root' or a stack id) at its time. The voice
//   look morphs the remnant into the voice look by it (speechtest / speechtest2's player hooks). It runs before shapes() and offset(),
//   so what it lays out stretches and moves with the rest. tools: the engine's own evalTrack and lerpStops, for it
// - fade(k): every shape's opacity x k, the bands and the Colorama untouched, so it fades away under the Colorama (offline on the
//   landing: flow 10.5's fade(), mal9.js)
// Both carry over a load(): they're the component's, not the comp's
src = sub(
  src,
  `{ const ev0 = evShape; evShape = s => { const o = ev0(s);`,
  `const LOOK = { h: null, k: 1 };
{ const evL = evShape; evShape = s => { const o = evL(s); if (LOOK.h && LOOK.h.shape) LOOK.h.shape(o, rcCur ? rcCur.id : 'root', D.tl.t); return o; }; }
{ const ev0 = evShape; evShape = s => { const o = ev0(s);`,
);
src = sub(
  src,
  `{ const ep0 = evalParams; evalParams = () => {`,
  `{ const evF = evShape; evShape = s => { const o = evF(s); if (LOOK.k !== 1 && typeof o.op === 'number') o.op *= LOOK.k; return o; }; }
{ const epL = evalParams; evalParams = () => { const P = epL(); return LOOK.h && LOOK.h.params ? LOOK.h.params(P, rcCur ? rcCur.id : 'root', D.tl.t) : P; }; }
{ const ep0 = evalParams; evalParams = () => {`,
);
src = sub(
  src,
  `  get alive() { return aliveT(); }, set alive(v) {`,
  `  look(h) { LOOK.h = h || null; need = true; },
  // Default Paused 2.0 (2026-11-24): the part of the comp its canvas shows now ([x, y, w, h] comp px, null: as opts.fit says), for a box that
  // shows only what's on screen of a piece bigger than the page: its box resized, the canvas follows at once; dpr: its sharpness for that
  // size (its pixel budget), as opts.dpr
  region(r, dpr) { if (Array.isArray(r) && r[2] > 0 && r[3] > 0) OPT.region = [+r[0], +r[1], +r[2], +r[3]]; else delete OPT.region; if (+dpr > 0) OPT.dpr = +dpr; layout(); need = true; },
  fade(k) { const n = Math.max(0, Math.min(1, +k)); if (isFinite(n) && n !== LOOK.k) { LOOK.k = n; need = true; } },
  get faded() { return LOOK.k; },
  tools: { evalTrack, lerpStops },
  get alive() { return aliveT(); }, set alive(v) {`,
);

// the studio's undo and redo restore a snapshot through its editor (draw, afterDocChange), which a player doesn't have: never
// called here, so it's left out
src = sub(src, `function restoreSnap(s) {
  const t = D.tl.t, pl = D.tl.play, page = D.ui.page, tour = D.ui.tour, view = D.view;   // view settings (lines, snapping, mode) are not undone
  const st = D.stack;
  D = normalize(JSON.parse(s)); D.tl.t = clamp(t, 0, D.tl.dur); D.tl.play = pl; D.ui.page = page; D.ui.tour = tour; D.view = view;
  if (st) D.stack = st; relink();   // r6
  keySel.clear(); draw = null; afterDocChange();
}
`, `function restoreSnap() {}\n`);

// the two canvases an image is drawn on only to be read back (its grey copy, and its pixels for the shapes' levels): kept on the CPU
// (willReadFrequently), so the read isn't a GPU readback (22 ms of a 103 ms start-up task on a GTX 1650 laptop); the same pixels
src = sub(src, `c.width = w; c.height = h; const X = c.getContext('2d');
  X.drawImage(m.im, 0, 0); try { const d = X.getImageData(`, `c.width = w; c.height = h; const X = c.getContext('2d', { willReadFrequently: true });
  X.drawImage(m.im, 0, 0); try { const d = X.getImageData(`);
src = sub(src, `t.width = iw; t.height = ih; const X = t.getContext('2d'); X.drawImage(base, 0, 0);`, `t.width = iw; t.height = ih; const X = t.getContext('2d', { willReadFrequently: true }); X.drawImage(base, 0, 0);`);

// GPU memory the picture doesn't need (the review), with every draw the same:
// - a layer's blur ran its first pass into a target of its own (A) that it kept for good, though only the second pass reads it (and
//   made one even for a one-way blur, which never does): now a working target of that size comes from the pool and goes back after
//   (without stable sizes, where there's no pool, the layer keeps its own as before, and only for a two-way blur)
// - the pool of given-up targets held up to 96 MB; the loader's zoom filled it with sizes that never come back: 24 MB
// (measured at 2x: RazorSenseChat 153 -> 120 MB, RazorSenseLoader 51 -> 27 MB)
src = sub(src, `const A = layerTarget(R, 'A', L.rw, L.rh), B = layerTarget(R, 'B', L.rw, L.rh),`, `const B = layerTarget(R, 'B', L.rw, L.rh),`);
src = sub(
  src,
  `if (bsx > 0 && bsy > 0) { blurPass((R.src || R.raw), A, [1, 0], bsx); blurPass(A.t, B, [0, 1], bsy); }`,
  `if (bsx > 0 && bsy > 0) { const A = GPU_STABLE ? grTake(L.rw, L.rh) || makeTarget(L.rw, L.rh) : layerTarget(R, 'A', L.rw, L.rh); blurPass((R.src || R.raw), A, [1, 0], bsx); blurPass(A.t, B, [0, 1], bsy); if (GPU_STABLE) grPut(A); }`,
);
src = sub(src, `const GR_POOL_MAX = 96e6;   // bytes`, `const GR_POOL_MAX = 24e6;   // bytes`);

// The shaders' text without their comments and indentation (3 KB gzipped off the engine, the PR review), as the GPU sees them all the
// same. FS_COMP is left as it is: FS_COMP_AE is made from it at runtime by finding lines in it, comments included. Lines stay lines
// (the preprocessor's, and grSpec's '^uniform int uX;' edits of FS_MAIN, need them); `${...}` parts are left alone.
const SHADERS = ['VS', 'FS_BLUR', 'FS_MAIN', 'FS_LAYER', 'GR_CLIP', 'VS_GR', 'FS_GR', 'FS_GC', 'FS_FILL'];
/** where shader `name`'s text starts and ends in src (inside its backticks; `${...}` parts skipped) */
const shaderSpan = (name) => {
  const start = src.indexOf(`const ${name} = \``);
  if (start < 0) throw new Error(`shader ${name} not found: update SHADERS`);
  const open = src.indexOf('`', start) + 1;
  let i = open, depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '\\') { i++; continue; }
    if (src.startsWith('${', i)) { depth++; i++; continue; }
    if (src[i] === '}' && depth) { depth--; continue; }
    if (src[i] === '`' && !depth) break;
  }
  return [open, i];
};

// The main pass without the features no comp uses (the bundle review, #7: FS_MAIN 22.5 -> 13 KB): the effects stack (FX: fractal
// noise, warps, looks; every comp's fx list is empty), refraction (the glass flutes; no comp turns rOn on) and the studio's debug
// views (uMode 1-6: the player always draws 'final', view 0). Drawing is no faster (the switches' copies, grSpec, already dropped
// them on the GPU): this is download, and less for Direct3D to translate. The uniforms go with them, so the engine's setters skip
// them (UI and the rest set a uniform only where the program has it), and the switches' copies never write them in.
{
  const [open, close] = shaderSpan('FS_MAIN');
  let fs = src.slice(open, close);
  /** the text from `from` up to (not including) `to`, once in the shader */
  const span = (from, to) => {
    const a = fs.indexOf(from), b = fs.indexOf(to, a);
    if (a < 0 || b < 0 || fs.indexOf(from, a + 1) >= 0) throw new Error(`FS_MAIN: ${JSON.stringify(from.slice(0, 60))} .. ${JSON.stringify(to.slice(0, 60))} not found once: update the cut`);
    return fs.slice(a, b);
  };
  // the effects stack
  fs = sub(fs, span(`// ---------- the effects (Bands page) ----------\n`, `// integral of band i from its start to f;`), ``);
  fs = sub(fs, `uniform int uFxN;\nuniform vec4 uFx[48];   // the effects stack: 6 vec4 each (see FX in 01-core)\n`, ``);
  fs = sub(fs, span(`  // the effects, as AE stacks them:`, `  float u0 = dot(q, uAcross)`), ``);
  fs = sub(fs, `  for (int k = 0; k < 8; k++) { if (k >= uFxN) break; if (!fxWarp(int(uFx[k * 6].x + 0.5))) v = lookFx(v, qs[k], k * 6); }\n`, ``);
  // refraction
  fs = sub(fs, `uniform int uROn;\nuniform int uRProf;\nuniform int uRLightShape;\n`, ``);
  fs = sub(fs, `uniform float uRDepth, uRIor, uRBulge, uRFlat, uRValley, uRShear, uRDisp, uRFrost, uREFrost, uRHi, uRHiPos, uRHiW, uREdge, uRShade, uRShW;\n`, ``);
  fs = sub(fs, span(`// ---- razorsensation2 r2: refraction (a glass flute per band)`, `// the layer under the glass at p:`), ``);
  fs = sub(fs, span(`// what the glass shows at c:`, `void main() {`), ``);
  fs = sub(fs, `  bool refr = uBands == 1 && inMap > 0.5 && uROn == 1;\n  float rx = 0.0, rtl = 0.0;\n  if (uBands == 1 && inMap > 0.5 && uROn == 0) {`, `  if (uBands == 1 && inMap > 0.5) {`);
  fs = sub(fs, `  if (refr) d = refrD(uu, uRIor, rx, rtl);\n`, ``);
  fs = sub(fs, `  if (refr) glassRead(c, uu, st, RGB, AL, rx, rtl);\n  else { vec4 r1 = readAt(s, st); RGB = r1.rgb; AL = vec3(r1.a); }`, `  { vec4 r1 = readAt(s, st); RGB = r1.rgb; AL = vec3(r1.a); }`);
  fs = sub(fs, span(`  // the glass's own light:`, `  vec3 col; float oa = 1.0;`), `  bool after = uAfter == 1 && uColor == 1;\n`);
  fs = sub(fs, `    if (refr) { col = 1.0 - (1.0 - col) * (1.0 - Lt * lm); col *= 1.0 - Sd * lm; if (uRLightShape == 0 && uOut == 0 && uAlphaOut == 1) oa = max(oa, Lt); }\n`, ``);
  // the debug views (and the player always draws 'final': if it stops pinning it, this cut must go)
  sub(read('player.js'), `D.view.mode = 'final'; D.view.ref = false;`, ``);
  fs = sub(fs, `uniform int uMode;\n`, ``);
  fs = sub(fs, `  bool needStroke = uStrokes == 1 || uMode == 4 || uMode == 5 || uSOOn == 1;`, `  bool needStroke = uStrokes == 1 || uSOOn == 1;`);
  fs = sub(fs, span(`  if (uMode == 1) {`, `  else if (after) {`) + `  else if (after) {`, `  if (after) {`);
  fs = sub(fs, `if (uAlphaOut == 1 && uMode == 0) oa = clamp(A, 0.0, 1.0); else if (uStraight == 1 && uMode == 0)`, `if (uAlphaOut == 1) oa = clamp(A, 0.0, 1.0); else if (uStraight == 1)`);
  fs = sub(fs, `  if (uMode == 0 && (uOVOn == 1 || uSOOn == 1)) {`, `  if (uOVOn == 1 || uSOOn == 1) {`);
  fs = sub(fs, `  if (uClipOn == 1 && uMode == 0) {`, `  if (uClipOn == 1) {`);
  fs = sub(fs, `  if (uCMOn == 1 && uMode == 0) {`, `  if (uCMOn == 1) {`);
  const left = fs.match(/\b(uFxN|uFx|uROn|uRProf|uRLightShape|uRIor|uMode|refr|refrD|fluteX|glassRead|lookFx|warpFx|fractalAt|Lt|lm|Sd)\b/g);
  if (left) throw new Error(`FS_MAIN still names what was cut (${[...new Set(left)].join(', ')}): update the cut`);
  src = src.slice(0, open) + fs + src.slice(close);
}
// ...and no comp may use them: one that does would draw without them, with no error (fx and rOn are read where the engine reads
// them: a layer's list of effects, only those switched on; its refraction switch)
{
  const esbuild = require('esbuild');
  const vm = require('vm');
  const SPARK = path.join(BLADE, 'src', 'components', 'Spark');
  const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === '__tests__' ? [] : files(path.join(dir, e.name))) : /comps\.ts$/i.test(e.name) ? [path.join(dir, e.name)] : []));
  const uses = [];
  const walk = (v, where) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v.fx) && v.fx.some((f) => f && f.on)) uses.push(`${where}: an effect (fx)`);
    if (v.rOn) uses.push(`${where}: refraction (rOn)`);
    Object.values(v).forEach((x) => walk(x, where));
  };
  const comps = files(SPARK);
  if (!comps.length) throw new Error('no comps found under src/components/Spark: update the comps check');
  for (const file of comps) {
    const { code } = esbuild.transformSync(fs.readFileSync(file, 'utf8'), { loader: 'ts', format: 'cjs' });
    const mod = { exports: {} };
    vm.runInNewContext(code, { module: mod, exports: mod.exports, require: (name) => { throw new Error(`${file} requires ${name}`); }, JSON });
    for (const [name, v] of Object.entries(mod.exports)) walk(v, `${path.relative(BLADE, file)} ${name}`);
  }
  if (uses.length) throw new Error(`a comp uses what the engine no longer draws:\n  ${[...new Set(uses)].join('\n  ')}\nput the cut in FS_MAIN back (above) for it`);
}
const minifyShader = (text) => {
  const parts = text.split(/(\$\{[^}]*\})/);   // (the engine's interpolations hold no braces)
  const code = parts.map((p, i) => (i % 2 ? `\u0000${i}\u0000` : p)).join('');
  const out = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => parts[+i]);
};
for (const name of SHADERS) {
  const [open, i] = shaderSpan(name);
  const body = src.slice(open, i);
  const keepLead = body.startsWith('\n') ? '\n' : '';   // (GR_CLIP is spliced in after a line)
  src = src.slice(0, open) + keepLead + minifyShader(body) + (body.endsWith('\n') ? '\n' : '') + src.slice(i);
}

// The engine ships minified with terser (the bundle review, #9): Blade's build doesn't minify, the app's bundler does, and esbuild
// (Vite's) leaves it 5.6 KB gzipped bigger than terser does. Its factory's three arguments keep their names (the wrapper's types
// name them); everything inside is the engine's own, so it's free to rename. Prettier lays it out again after, so the file stays
// diffable a line at a time and prettier-clean; bundlers drop the whitespace.
const { minify_sync: minifySync } = require('terser');
const ENGINE_ARGS = ['__host', '__EXP', '__GPU'];
const minifyEngine = (body) => {
  const head = `function*__steps(${ENGINE_ARGS.join(',')}){`;
  const { code } = minifySync(`function* __steps(${ENGINE_ARGS.join(', ')}) {\n${body}\n}`, {
    ecma: 2020,
    compress: { passes: 2 },
    mangle: { reserved: ENGINE_ARGS },
    format: { comments: false },
  });
  if (!code.startsWith(head) || !code.endsWith('}')) throw new Error(`terser gave the engine back in a shape this build doesn't know: ${code.slice(0, 80)}`);
  return code.slice(head.length, -1);
};

const GEN =
  '// Generated by scripts/razorsenseEngine/buildFreshEngine.js from the RazorSense system\'s engine (scripts/razorsenseEngine/source). Do not edit: change the source or its patches and build again.\n';
const engine = GEN + `/* eslint-disable */
// @ts-nocheck
import type { FreshEngine, FreshEngineHost, FreshExport, FreshSwitches } from './types';

/**
 * Mounts Razorsensation's engine on one canvas (host.canvas, sized to host.box) and plays one exported comp (exp.doc, exp.opts),
 * a step at a time: each next() is one part of making it (one task each, so a slow phone draws frames between them), and the
 * engine is what the last one returns. A held host (host.isHeld) gets an engine that draws and runs nothing till load() gives it
 * its comp: made ahead, while the page is idle. Every engine is its own: its own document, WebGL2 context and frame loop.
 */
export function* freshEngineSteps(__host: FreshEngineHost, __EXP: FreshExport, __GPU: FreshSwitches): Generator<void, FreshEngine, void> {
` + minifyEngine(`let __raf = 0, __run = !__host.isHeld, __held = !!__host.isHeld, __dead = false, __ro = null, __d3d = false, __sleepX = null, __dprCap = 0;
const __search = '';
` + src) + `
}

/** Makes the engine at once: every step of freshEngineSteps in one go. */
export function createFreshEngine(__host: FreshEngineHost, __EXP: FreshExport, __GPU: FreshSwitches): FreshEngine {
  const steps = freshEngineSteps(__host, __EXP, __GPU);
  for (;;) {
    const step = steps.next();
    if (step.done) return step.value;
  }
}
`;
// the engine reads only what the component gives it: nothing of the host page's (a hook the studio renamed would otherwise
// still read the page's own, with no error). Its studio-only settings stay, unset in Blade.
const STUDIO_ONLY = ['RZS_NS', 'RZS_STANDALONE'];
const pageReads = (src.replace(/\/\/[^\n]*/g, '').match(/\bwindow\.RZS_\w+|\blocation\.\w+/g) || []).filter(
  (read) => !STUDIO_ONLY.includes(read.replace('window.', '')),
);
if (pageReads.length) {
  throw new Error(`the engine still reads the host page (${[...new Set(pageReads)].join(', ')}): patch it to read the component's`);
}
// prettier and eslint are the repo root's devDependencies: found there, or in this package where an install put them (the PR review)
const bin = (name) =>
  [path.join(BLADE, '..', '..', 'node_modules', '.bin', name), path.join(BLADE, 'node_modules', '.bin', name)].find((p) => fs.existsSync(p)) ||
  name;
const pretty = execFileSync(bin('prettier'), ['--stdin-filepath', OUT], { input: engine, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/**
 * The engine is the studio's code, so its style isn't Blade's (no style lint); it's linted for the mistakes that break it instead.
 * Two names are the studio's own hooks, only ever called behind a typeof check.
 */
const lint = () =>
  execFileSync(
    bin('eslint'),
    [
      '--no-eslintrc', '--no-ignore', '--no-inline-config',
      '--parser', '@typescript-eslint/parser',
      '--parser-options', 'ecmaVersion:2022,sourceType:module',
      '--env', 'browser,es2022',
      '--global', 'stopsView,compKey',
      '--rule', JSON.stringify({
        'no-undef': 'error', 'no-unreachable': 'error', 'no-dupe-keys': 'error', 'no-duplicate-case': 'error',
        'no-redeclare': 'error', 'no-self-assign': 'error', 'no-unsafe-finally': 'error', 'no-dupe-else-if': 'error',
        'no-const-assign': 'error', 'no-dupe-args': 'error', 'use-isnan': 'error', 'valid-typeof': 'error',
        'no-sparse-arrays': 'error', 'no-unsafe-negation': 'error', 'no-setter-return': 'error', 'getter-return': 'error',
        'no-compare-neg-zero': 'error', 'no-loss-of-precision': 'error',
      }),
      OUT,
    ],
    { stdio: 'inherit' },
  );

if (process.argv.includes('--check')) {
  if (fs.readFileSync(OUT, 'utf8') !== pretty) {
    console.error('freshEngine.ts is not what scripts/razorsenseEngine/source builds: run node scripts/razorsenseEngine/buildFreshEngine.js');
    process.exit(1);
  }
  lint();
  console.log('freshEngine.ts is up to date with its source, and lints clean');
} else {
  fs.writeFileSync(OUT, pretty);
  lint();
  console.log(`wrote ${path.relative(BLADE, OUT)} (${Math.round(pretty.length / 1024)} KB)`);
}
