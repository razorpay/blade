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
 * start and its returned player.
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
src = src.replace(new RegExp("(?:window\\.)?RZS_EXPORT\\b", "g"), `__EXP`);
src = src.replace(new RegExp("window\\.RZS_GPU\\b", "g"), `__GPU`);
src = sub(src, `const GR_STAT = window.__GR_STAT = { box: 0 };`, `const GR_STAT = { box: 0 };`);
src = sub(src, `window.RZS_PLAYER = {`, `const RZS_PLAYER = {`);
src = src.split(`location.search`).join(`__search`);
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
  // Blade: frames it has drawn (0: none yet, its programs still compiling, or its GPU not drawing)
  drawn() { return STATS.frames; },
  // Blade: whether its last frame was dropped only for the GPU (Direct3D: the main pass's copy still compiling, in the background):
  // its own work for its first frame is done, so another engine starting now doesn't land on top of it
  waitsOnGpu() { return !!(GL && GL.gpuWait); },
};`);

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
  const body = src.slice(open, i);
  const keepLead = body.startsWith('\n') ? '\n' : '';   // (GR_CLIP is spliced in after a line)
  src = src.slice(0, open) + keepLead + minifyShader(body) + (body.endsWith('\n') ? '\n' : '') + src.slice(i);
}

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
let __raf = 0, __run = !__host.isHeld, __held = !!__host.isHeld, __dead = false, __ro = null, __d3d = false;
const __search = '';
` + src + `
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
const pretty = execFileSync(path.join(BLADE, 'node_modules', '.bin', 'prettier'), ['--stdin-filepath', OUT], { input: engine, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/**
 * The engine is the studio's code, so its style isn't Blade's (no style lint); it's linted for the mistakes that break it instead.
 * Two names are the studio's own hooks, only ever called behind a typeof check.
 */
const lint = () =>
  execFileSync(
    path.join(BLADE, '..', '..', 'node_modules', '.bin', 'eslint'),
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
