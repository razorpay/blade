// ============================================================================================
// 01-core: constants, the document, keyframes, undo, saving, presets, colour
// ============================================================================================
// 2026-10-16: one set of sources, two pages. razorsensation.html keeps its keys; razorsensation2.html (make_razorsensation.py --two)
// sets window.RZS_NS = 'rzs2': its own projects, presets, references and chat (settings/ray-rzs2-*), starting with one blank tab
const RZS_NS = window.RZS_NS || null, PJPRE = RZS_NS ? 'ray-' + RZS_NS + '-' : 'ray-rzs-';
const NAME = RZS_NS ? 'ray-' + RZS_NS : 'ray-razorsensation', PNAME = NAME + '-presets';
const COMP_BLENDS = ['normal', 'screen', 'add', 'multiply', 'under'];   // r6: how a comp sits on the ones under it   // ds (2026-11-03): 'under' = under the first comp
const API = n => (location.protocol === 'file:' ? 'http://localhost:8737' : '') + '/api/settings/' + n;
// r33: a standalone copy to share (make_razorsensation.py --standalone): no serve.py, nothing fetched or posted — it saves in the
// browser only, and starts from the projects, presets and reference PNGs it was made with (window.RZS_STANDALONE: { stores, assets })
const STANDALONE = window.RZS_STANDALONE || null;
const assetURL = src => (STANDALONE && STANDALONE.assets && STANDALONE.assets[src]) || src;
const BLUR_SIGMA = 0.5;       // Gaussian sigma (comp px) = blurriness x 0.5
const SIGMA_WORK = 5;         // a big blur runs on a smaller copy where its sigma is this many texels
const LUT_N = 1024, FPS = 30, MAXB = 8;
const EASES = { linear: [0, 0, 1, 1], easy: [0.33, 0, 0.67, 1], in: [0.42, 0, 1, 1], out: [0, 0, 0.58, 1], inout: [0.65, 0, 0.35, 1] };
const CH = [['r', 'Red'], ['g', 'Green'], ['b', 'Blue'], ['a', 'Alpha'], ['lum', 'Luminance'], ['hue', 'Hue'], ['light', 'Lightness'], ['sat', 'Saturation'], ['full', 'Full'], ['half', 'Half'], ['off', 'Off']];
const CHI = Object.fromEntries(CH.map(([v], i) => [v, i]));
const STAGES = ['shape', 'bands', 'strokes', 'color', 'post'];   // r17 (2026-10-22): + Post, the effect as a whole (last, after everything)
// razorsensation2 r2: the order the pages run in (and show in the page tabs): with the bands over the Colorama, Colorama comes second
const stageOrder = () => (typeof D !== 'undefined' && D && D.p && D.p.bAfter) ? ['shape', 'color', 'bands', 'strokes', 'post'] : STAGES;
const STAGE_LABEL = { shape: 'Shape', bands: 'Bands', strokes: 'Strokes', color: 'Colorama', post: 'Post' };
const STAGE_ICON = { shape: '✒', bands: '▥', strokes: '⫽', color: '◐', post: '◎' };
const STAGE_HINT = {
  shape: 'Draw shapes with the pen, move, size and key them; each shape has its own blur (horizontal and vertical apart).',
  bands: 'The banded displacement map: long angled bands, each with its own black → white ramp. They refract the blurred shape (AE Displacement Map).',
  strokes: 'Strokes on the band edges, masked by the blurred shape (choked) so they fade out with it. They are added before the Colorama, which colours them.',
  color: 'Colorama: the brightness of everything below picks a colour along a line, black end on the left, white end on the right (a gradient map).',
  post: 'After everything: the effect as a whole. On Base (comp 1) it is the whole effect, every comp together; on another comp, that comp.',
};
// ---------- the Bands page's effects (AE-style, on the displacement map, applied top to bottom) ----------
// kind: warp = bends where the map is read (the bands and their strokes follow), look = changes its greys.
// P: each value — a number (keyframable as 'fx:<id>:<name>': min / max / d / u / open), sel (choices) or tog (on / off); g = its group.
// pack(v, a, o) writes the effect for the shader: 6 vec4 (24 floats) from a[o]; the first float is its type.
const BLEND_FX = [['normal', 'Normal'], ['add', 'Add'], ['mul', 'Multiply'], ['screen', 'Screen'], ['overlay', 'Overlay'], ['soft', 'Soft Light'], ['linlight', 'Linear Light'], ['diff', 'Difference']];
const fxSel = (opts, v) => Math.max(0, opts.findIndex(o => o[0] === v));
const fxPos = (v, k) => ({ l: 'Center ' + k.toUpperCase(), min: -3000, max: 3000, d: 0, u: 'px', def: 0, open: 1, n: k === 'y' ? 'From the middle of the map.' : undefined });
const FX = {
  fractal: { name: 'Fractal Noise', kind: 'look', note: 'AE’s Fractal Noise, blended onto the map’s greys.', P: {
    ftype: { l: 'Fractal Type', sel: [['basic', 'Basic'], ['tsmooth', 'Turbulent Smooth'], ['tsharp', 'Turbulent Sharp'], ['strings', 'Strings']], def: 'basic' },
    ntype: { l: 'Noise Type', sel: [['block', 'Block'], ['linear', 'Linear'], ['soft', 'Soft Linear'], ['spline', 'Spline']], def: 'soft' },
    inv:   { l: 'Invert', tog: 1, def: false },
    con:   { l: 'Contrast', min: 0, max: 400, d: 1, def: 100, open: 1 },
    bri:   { l: 'Brightness', min: -100, max: 100, d: 1, def: 0, open: 1 },
    ovf:   { l: 'Overflow', sel: [['clip', 'Clip'], ['soft', 'Soft Clamp'], ['wrap', 'Wrap Back']], def: 'clip' },
    band:  { l: 'Follow the bands', tog: 1, def: true, g: 'Transform', n: 'On: the noise lines up with the bands (width = across them, height = along).' },
    rot:   { l: 'Rotation', min: -360, max: 360, d: 1, u: '°', def: 0, open: 1, g: 'Transform' },
    size:  { l: 'Scale', min: 10, max: 3000, d: 0, u: 'px', def: 400, open: 1, g: 'Transform' },
    sw:    { l: 'Scale Width', min: 5, max: 1000, d: 0, u: '%', def: 100, open: 1, g: 'Transform' },
    sh:    { l: 'Scale Height', min: 5, max: 1000, d: 0, u: '%', def: 100, open: 1, g: 'Transform' },
    ox:    { l: 'Offset X', min: -3000, max: 3000, d: 0, u: 'px', def: 0, open: 1, g: 'Transform' },
    oy:    { l: 'Offset Y', min: -3000, max: 3000, d: 0, u: 'px', def: 0, open: 1, g: 'Transform' },
    cx:    { l: 'Complexity', min: 1, max: 10, d: 1, def: 6 },
    si:    { l: 'Sub Influence', min: 0, max: 100, d: 0, u: '%', def: 70, g: 'Sub Settings' },
    ss:    { l: 'Sub Scaling', min: 20, max: 100, d: 0, u: '%', def: 56, g: 'Sub Settings' },
    sr:    { l: 'Sub Rotation', min: -360, max: 360, d: 0, u: '°', def: 0, g: 'Sub Settings' },
    ev:    { l: 'Evolution', min: -720, max: 720, d: 0, u: '°', def: 0, open: 1, g: 'Evolution' },
    es:    { l: 'Evolution speed', min: -720, max: 720, d: 0, u: '°/s', def: 45, open: 1, g: 'Evolution', n: 'Turns the evolution while playing (or key Evolution).' },
    seed:  { l: 'Random Seed', min: 0, max: 1000, d: 0, def: 0, open: 1, g: 'Evolution' },
    op:    { l: 'Opacity', min: 0, max: 100, d: 0, u: '%', def: 50, g: 'Blend' },
    blend: { l: 'Blending Mode', sel: BLEND_FX, def: 'linlight', g: 'Blend' },
  }, pack(v, a, o) {
    const S = FX.fractal.P, r = v.rot * Math.PI / 180, sz = Math.max(1, v.size);
    a.set([1, fxSel(S.ftype.sel, v.ftype), fxSel(S.ntype.sel, v.ntype), fxSel(BLEND_FX, v.blend),
      v.con / 100, v.bri / 100, fxSel(S.ovf.sel, v.ovf), v.inv ? 1 : 0,
      Math.cos(r), Math.sin(r), 100 / (sz * Math.max(1, v.sw)), 100 / (sz * Math.max(1, v.sh)),
      clamp(v.cx, 1, 10), clamp(v.si, 0, 100) / 100, 100 / clamp(v.ss, 20, 100), v.sr * Math.PI / 180,
      v.ox, v.oy, (v.ev + v.es * live) / 360, (v.seed || 0) * 17.31,
      clamp(v.op, 0, 100) / 100, v.band ? 1 : 0, 0, 0], o);
  } },
  turb: { name: 'Turbulent Displace', kind: 'warp', note: 'Bends the bands with fractal noise.', P: {
    dt:    { l: 'Displacement', sel: [['both', 'Turbulent'], ['across', 'Across the bands'], ['along', 'Along the bands'], ['twist', 'Twist']], def: 'both' },
    amt:   { l: 'Amount', min: 0, max: 400, d: 1, u: 'px', def: 60, open: 1 },
    size:  { l: 'Size', min: 10, max: 3000, d: 0, u: 'px', def: 500, open: 1 },
    cx:    { l: 'Complexity', min: 1, max: 6, d: 1, def: 2 },
    ox:    { l: 'Offset X', min: -3000, max: 3000, d: 0, u: 'px', def: 0, open: 1 },
    oy:    { l: 'Offset Y', min: -3000, max: 3000, d: 0, u: 'px', def: 0, open: 1 },
    ev:    { l: 'Evolution', min: -720, max: 720, d: 0, u: '°', def: 0, open: 1, g: 'Evolution' },
    es:    { l: 'Evolution speed', min: -720, max: 720, d: 0, u: '°/s', def: 45, open: 1, g: 'Evolution', n: 'Runs while playing.' },
    seed:  { l: 'Random Seed', min: 0, max: 1000, d: 0, def: 0, open: 1, g: 'Evolution' },
  }, pack(v, a, o) {
    a.set([2, fxSel(FX.turb.P.dt.sel, v.dt), clamp(v.cx, 1, 6), v.amt, 1 / Math.max(1, v.size), (v.ev + v.es * live) / 360, (v.seed || 0) * 17.31, 0, v.ox, v.oy, 0, 0], o);
  } },
  wave: { name: 'Wave Warp', kind: 'warp', note: 'Waves running through the bands.', P: {
    wt:    { l: 'Wave Type', sel: [['sine', 'Sine'], ['square', 'Square'], ['tri', 'Triangle'], ['saw', 'Sawtooth'], ['noise', 'Smooth Noise']], def: 'sine' },
    ht:    { l: 'Wave Height', min: 0, max: 400, d: 1, u: 'px', def: 25, open: 1 },
    wd:    { l: 'Wave Width', min: 10, max: 3000, d: 0, u: 'px', def: 400, open: 1 },
    band:  { l: 'Follow the bands', tog: 1, def: true, n: 'On: Direction is from the bands (90° = the waves run along them and push them sideways). Off: from the screen, as in AE (90° = they travel right and push up and down).' },
    dir:   { l: 'Direction', min: -360, max: 360, d: 1, u: '°', def: 90, open: 1 },
    spd:   { l: 'Wave Speed', min: -10, max: 10, d: 2, u: '/s', def: 0.5, open: 1, n: 'Waves per second, while playing.' },
    ph:    { l: 'Phase', min: -360, max: 360, d: 0, u: '°', def: 0, open: 1 },
  }, pack(v, a, o) {
    const r = v.dir * Math.PI / 180;
    a.set([3, fxSel(FX.wave.P.wt.sel, v.wt), v.ht, 1 / Math.max(1, v.wd), Math.sin(r), -Math.cos(r), v.ph / 360 - v.spd * live, v.band ? 1 : 0], o);
  } },
  twirl: { name: 'Twirl', kind: 'warp', note: 'Swirls the bands round a point.', P: {
    ang:   { l: 'Angle', min: -1440, max: 1440, d: 1, u: '°', def: 120, open: 1 },
    rad:   { l: 'Twirl Radius', min: 10, max: 4000, d: 0, u: 'px', def: 700, open: 1 },
    cx: fxPos(0, 'x'), cy: fxPos(0, 'y'),
  }, pack(v, a, o) { a.set([4, v.ang * Math.PI / 180, Math.max(1, v.rad), 0, v.cx, v.cy, 0, 0], o); } },
  ripple: { name: 'Ripple', kind: 'warp', note: 'Rings spreading out from a point.', P: {
    ht:    { l: 'Wave Height', min: 0, max: 200, d: 1, u: 'px', def: 18, open: 1 },
    wl:    { l: 'Wave Width', min: 5, max: 2000, d: 0, u: 'px', def: 160, open: 1 },
    rad:   { l: 'Radius', min: 10, max: 6000, d: 0, u: 'px', def: 1400, open: 1, n: 'The rings fade out by here.' },
    spd:   { l: 'Wave Speed', min: -10, max: 10, d: 2, u: '/s', def: 1, open: 1, n: 'Rings per second, while playing.' },
    ph:    { l: 'Phase', min: -360, max: 360, d: 0, u: '°', def: 0, open: 1 },
    cx: fxPos(0, 'x'), cy: fxPos(0, 'y'),
  }, pack(v, a, o) { a.set([5, v.ht, 1 / Math.max(1, v.wl), Math.max(1, v.rad), v.cx, v.cy, v.ph / 360 - v.spd * live, 0], o); } },
  poster: { name: 'Posterize', kind: 'look', note: 'Steps the greys (so the displacement steps too).', P: {
    lv:    { l: 'Level', min: 2, max: 32, d: 0, def: 6 },
  }, pack(v, a, o) { a.set([6, Math.round(clamp(v.lv, 2, 64)), 0, 0], o); } },
  grain: { name: 'Noise', kind: 'look', note: 'Grain on the map: a fine jitter in the displacement.', P: {
    amt:   { l: 'Amount of Noise', min: 0, max: 100, d: 0, u: '%', def: 12 },
    gs:    { l: 'Grain size', min: 1, max: 60, d: 0, u: 'px', def: 3, open: 1 },
    anim:  { l: 'Animated', tog: 1, def: true, n: 'A new grain every frame while playing.' },
    seed:  { l: 'Random Seed', min: 0, max: 1000, d: 0, def: 0, open: 1 },
  }, pack(v, a, o) { a.set([7, clamp(v.amt, 0, 100) / 100, Math.max(1, v.gs), (v.seed || 0) * 13.7 + (v.anim ? (frameNo % 997) * 3.1 : 0)], o); } },
};
const FX_MAX = 8;
function newFx(t, id) { const v = {}; for (const [k, m] of Object.entries(FX[t].P)) v[k] = m.def; return { id, t, on: true, v }; }
function normFx(list) {
  return (Array.isArray(list) ? list : []).filter(f => f && FX[f.t] && f.id).slice(0, FX_MAX).map(f => {
    const n = newFx(f.t, String(f.id)); n.on = f.on !== false;
    for (const k in n.v) if (f.v && f.v[k] !== undefined) n.v[k] = f.v[k];
    return n;
  });
}
const fxById = id => ((D.p && D.p.fx) || []).find(f => f.id === id);
const fxKeyLive = (k, doc) => { const [, id, prop] = k.split(':'), f = ((doc || D).p.fx || []).find(x => x.id === id); return !!(f && FX[f.t].P[prop] && FX[f.t].P[prop].min !== undefined); };
// the map's average grey after the look effects (for "Keep the shape in place"); the noise means were measured from the renders
const FX_NMEAN = {   // [Block, Linear, Soft Linear, Spline] at complexity 6, contrast 100 (measured r17)
  basic: [0.512, 0.517, 0.516, 0.501], tsmooth: [0.861, 0.374, 0.485, 0.219], tsharp: [0.767, 0.43, 0.501, 0.327], strings: [0.214, 0.443, 0.374, 0.573] };
function fxMean(m, P) {
  for (const f of (P.fx || [])) {
    if (!f.on || f.t !== 'fractal') continue;
    const v = f.v, nm = (FX_NMEAN[v.ftype] || FX_NMEAN.basic)[fxSel(FX.fractal.P.ntype.sel, v.ntype)]; let n = clamp((nm - 0.5) * v.con / 100 + 0.5 + v.bri / 100, 0, 1); if (v.inv) n = 1 - n;
    const b = { normal: n, add: m + n, mul: m * n, screen: 1 - (1 - m) * (1 - n), overlay: m < 0.5 ? 2 * m * n : 1 - 2 * (1 - m) * (1 - n), soft: (1 - 2 * n) * m * m + 2 * n * m, linlight: m + 2 * n - 1, diff: Math.abs(m - n) }[v.blend];
    m = clamp(m + (clamp(b ?? n, 0, 1) - m) * clamp(v.op, 0, 100) / 100, 0, 1);
  }
  return m;
}

const VIEWS = [['final', 'Final'], ['shape', 'Shape layer'], ['map', 'Map'], ['disp', 'Displaced'], ['strokes', 'Strokes'], ['mask', 'Stroke mask'], ['vec', 'Vectors']];

// numeric scene values: every one is keyframable. s = stage, l = label, d = decimals, u = unit, open = typing may go past the slider
const PM = {
  lbg:    { s: 'shape', l: 'Layer background', min: 0, max: 1, d: 2, n: 'Grey under the shapes (0 = black, as on a black solid).' },
  bOp:    { s: 'bands', l: 'Opacity', min: 0, max: 1, d: 2, open: 1, n: 'Fades the bands in and out: 0 = the layer as it is under them, 1 = the full bands (their bend and their glass light). Key it for a smooth fade.' },   // r21 (2026-10-23)
  bAng:   { s: 'bands', l: 'Angle', min: -90, max: 90, d: 2, u: '°', open: 1 },
  bScale: { s: 'bands', l: 'Scale', min: 0.1, max: 5, d: 3, open: 1, n: 'Multiplies every band width (1 = the pattern below).' },
  bOff:   { s: 'bands', l: 'Offset', min: -500, max: 500, d: 1, u: 'px', open: 1 },
  bDrift: { s: 'bands', l: 'Drift', min: -300, max: 300, d: 1, u: 'px/s', open: 1, n: 'Slides the bands sideways while playing.' },
  bSoftH: { s: 'bands', l: 'Horizontal softness', min: 0, max: 40, d: 1, u: 'px', open: 1 },   // a blur of the map, H and V apart (0 = crisp; it is anti-aliased anyway)
  bSoftV: { s: 'bands', l: 'Vertical softness', min: 0, max: 40, d: 1, u: 'px', open: 1 },
  bLo:    { s: 'bands', l: 'Black level', min: 0, max: 1, d: 2 },
  bHi:    { s: 'bands', l: 'White level', min: 0, max: 1, d: 2 },
  bPhG:   { s: 'bands', l: 'Green shift', min: -1, max: 1, d: 3, n: 'Moves the green channel along the pattern (then Red and Green displace differently).' },
  bPhB:   { s: 'bands', l: 'Blue shift', min: -1, max: 1, d: 3 },
  mapW:   { s: 'bands', l: 'Map width', min: 0, max: 6000, d: 0, u: 'px', open: 1, n: '0 = the composition size.' },
  mapH:   { s: 'bands', l: 'Map height', min: 0, max: 6000, d: 0, u: 'px', open: 1 },
  mapX:   { s: 'bands', l: 'Map X', min: -3000, max: 3000, d: 0, u: 'px', open: 1 },
  mapY:   { s: 'bands', l: 'Map Y', min: -3000, max: 3000, d: 0, u: 'px', open: 1 },
  dMaxH:  { s: 'bands', l: 'Max Horizontal Displacement', min: -300, max: 300, d: 1, open: 1 },
  dMaxV:  { s: 'bands', l: 'Max Vertical Displacement', min: -300, max: 300, d: 1, open: 1 },
  // razorsensation2 r2: Refraction, a glass flute per band (instead of the displacement): the shape behind is bent through a curved surface
  rDepth: { s: 'bands', l: 'Depth', min: -600, max: 600, d: 1, u: 'px', open: 1, n: 'How far behind the glass the shape sits: the bend grows with it. + = each flute shows more of the shape (shrinks it, as on the RazorSense site); − = each flute zooms in.' },
  rIor:   { s: 'bands', l: 'Index of refraction', min: 1, max: 2.5, d: 3, n: '1 = no bend (air), 1.5 = glass, 2.4 = diamond. How hard a tilted surface bends the light.' },
  rBulge: { s: 'bands', l: 'Bulge', min: 0, max: 4, d: 2, open: 1, n: 'How tall each flute is for its width: 0 = flat glass, 1 = a half cylinder, more = steeper sides.' },
  rFlat:  { s: 'bands', l: 'Flat top', min: 0, max: 0.95, d: 2, n: 'Flat top profile only: how much of the flute is flat (only its sides bend).' },
  rValley: { s: 'bands', l: 'Valley rounding', min: 0, max: 0.5, d: 3, n: 'Rounds the crease where two flutes meet (part of the flute width): 0 = a sharp cut, more = a soft trough.' },
  rShear: { s: 'bands', l: 'Shear along', min: -300, max: 300, d: 1, u: 'px', open: 1, n: 'Each flute also shifts the shape along itself, more on one side than the other (the stepped / sawtooth ends).' },
  rDisp:  { s: 'bands', l: 'Dispersion', min: 0, max: 0.3, d: 3, n: 'Red and blue bend by different amounts: colour fringes at the bent edges (each channel goes through the Colorama on its own).' },
  rFrost: { s: 'bands', l: 'Frost', min: 0, max: 80, d: 1, u: 'px', open: 1, n: 'Blurs what is seen through each flute, across it (frosted glass).' },
  rEFrost: { s: 'bands', l: 'Edge frost', min: 0, max: 80, d: 1, u: 'px', open: 1, n: 'Extra frost towards each flute’s sides, where the glass is steepest.' },
  rHi:    { s: 'bands', l: 'Highlight', min: 0, max: 1, d: 2, n: 'A line of light along each flute (added to the brightness, so the Colorama colours it).' },
  rHiPos: { s: 'bands', l: 'Highlight place', min: -1, max: 1, d: 2, n: 'Where the light line sits across the flute: −1 = its left side, 0 = the middle, 1 = its right side.' },
  rHiW:   { s: 'bands', l: 'Highlight width', min: 0.01, max: 1, d: 2, n: 'Part of the flute it covers.' },
  rEdge:  { s: 'bands', l: 'Edge light', min: 0, max: 1, d: 2, n: 'The glass reflects more where it is steep (Fresnel): the flute sides brighten.' },
  rShade: { s: 'bands', l: 'Valley shadow', min: 0, max: 1, d: 2, n: 'Darkens the trough between flutes.' },
  rShW:   { s: 'bands', l: 'Shadow width', min: 0.01, max: 1, d: 2, n: 'How far into the flute the shadow reaches.' },
  sWidth: { s: 'strokes', l: 'Width', min: 0, max: 80, d: 1, u: 'px', open: 1 },
  sGrad:  { s: 'strokes', l: 'Gradient', min: 0, max: 4, d: 2, n: '0 = solid stroke, 1 = linear fade across it, more = a sharper fade.' },
  sOff:   { s: 'strokes', l: 'Offset', min: -40, max: 40, d: 1, u: 'px', open: 1 },
  sInt:   { s: 'strokes', l: 'Intensity', min: 0, max: 1, d: 2 },
  sChoke: { s: 'strokes', l: 'Choke', min: 0, max: 1, d: 2, n: 'Shrinks the shape mask: strokes only where the blurred shape is above this.' },
  sSoft:  { s: 'strokes', l: 'Mask softness', min: 0, max: 1, d: 2 },
  sFeather: { s: 'strokes', l: 'Feather inwards', min: 0, max: 400, d: 1, u: 'px', open: 1, n: 'The strokes fade in from the shape’s edge over this distance, inside it only (0 = a hard edge).' },
  cInLo:  { s: 'color', l: 'Input black', min: 0, max: 1, d: 2 },
  cInHi:  { s: 'color', l: 'Input white', min: 0, max: 1, d: 2 },
  cInGam: { s: 'color', l: 'Input gamma', min: 0.1, max: 5, d: 2 },
  cRep:   { s: 'color', l: 'Stretch', min: 0.1, max: 8, d: 2, open: 1, n: '1 = black to white runs the whole line. More: the line runs out sooner and the brightest parts keep its last colour. Less: white stops partway along.' },
  cShift: { s: 'color', l: 'Offset', min: -1, max: 1, d: 3, open: 1, n: 'Slides the line under the brightness (key it to move the colours). Past the ends the end colours hold.' },
  cBlend: { s: 'color', l: 'Blend With Original', min: 0, max: 1, d: 2 },
  dither: { s: 'color', l: 'Dither', min: 0, max: 4, d: 1, u: '/255', n: 'A little noise on the colours at the very end, so big soft gradients never band.' },
  // razorsensation2 r3: Colorama as After Effects does it (Cycle mode): the output cycle wraps, repetitions and phase shift as in AE
  cMaskF: { s: 'color', l: 'Mask feather', min: 0, max: 1500, d: 0, u: 'px', open: 1, n: 'How soft the mask’s edge is, on the final colours (a blurred outline, not a grey ramp through the colour line).' },   // r6
  cPh:    { s: 'color', l: 'Phase Shift', min: -3600, max: 3600, d: 1, u: '°', open: 1, n: 'AE’s Phase Shift: turns the cycle under the brightness (360° = once round). Key it to make the colours travel.' },
  cPost:  { s: 'color', l: 'Posterize', min: 0, max: 1024, d: 0, n: 'AE’s Interpolate Palette off: the cycle in this many steps, each the colour at its start (AE: 256). 0 = smooth.' },   // r3+
  ovOp:   { s: 'shape', l: 'Over the Colorama: opacity', min: 0, max: 1, d: 3, n: 'Fades everything drawn over the Colorama together, as one layer (AE: the opacity of a precomp above the glass).' },   // r3+
  // r3: the band overlay: colour drawn over the Colorama across every band (AE stripes in their own colours), masked like the strokes
  soOp:   { s: 'strokes', l: 'Overlay opacity', min: 0, max: 1, d: 2 },
  soOff:  { s: 'strokes', l: 'Overlay offset', min: -400, max: 400, d: 1, u: 'px', open: 1, n: 'Slides the overlay across the bands (it repeats with them).' },
  soBlur: { s: 'strokes', l: 'Overlay softness', min: 0, max: 80, d: 1, u: 'px', open: 1, n: 'Blurs the overlay across the band (Gaussian blurriness).' },
  so2Op:   { s: 'strokes', l: 'Overlay 2 opacity', min: 0, max: 1, d: 2 },
  so2Off:  { s: 'strokes', l: 'Overlay 2 offset', min: -400, max: 400, d: 1, u: 'px', open: 1 },
  so2Blur: { s: 'strokes', l: 'Overlay 2 softness', min: 0, max: 80, d: 1, u: 'px', open: 1 },
  // razorsensation2 r2: gradient smoothing (the colour line's creases and steps)
  cSmooth: { s: 'color', l: 'Line smoothing', min: 0, max: 0.3, d: 3, n: 'Blurs the colour line itself, so colours meet without a crease at each stop (creases read as bands inside the bands). Part of the line.' },
  // r17 (2026-10-22; the user: "another tab at the bottom called Post: overall opacity of the effect itself; more later")
  pOp: { s: 'post', l: 'Opacity', min: 0, max: 1, d: 2, open: 1, n: '1 = as made, 0 = gone.' },
  pZoom: { s: 'post', l: 'Zoom', min: 0.05, max: 4, d: 3, open: 1, n: 'The whole comp scaled round its middle, as a camera would: shapes, blur, bands and displacement together, the colours as they are. 1 = as made. Keyable (ds, 2026-10-30).' },
  cInDither: { s: 'color', l: 'Input dither', min: 0, max: 4, d: 2, u: '/1000', n: 'A little noise on the brightness before it goes through the line: breaks up contour steps where a small brightness change crosses a steep stretch of colour.' },
};
const SPM = {
  x:   { l: 'X', min: -3000, max: 3000, d: 1, u: 'px', open: 1 },
  y:   { l: 'Y', min: -3000, max: 3000, d: 1, u: 'px', open: 1 },
  sx:  { l: 'Width', min: -4, max: 4, d: 3, open: 1 },          // keyed as a factor; the panel shows it in px (W)
  sy:  { l: 'Height', min: -4, max: 4, d: 3, open: 1 },
  s:   { l: 'Scale', min: 0.05, max: 4, d: 3, open: 1 },
  r:   { l: 'Rotation', min: -180, max: 180, d: 1, u: '°', open: 1 },
  sk:  { l: 'Skew', min: -70, max: 70, d: 1, u: '°' },
  ska: { l: 'Skew axis', min: -180, max: 180, d: 1, u: '°', open: 1 },
  ax:  { l: 'Anchor X', min: -2000, max: 2000, d: 1, u: 'px', open: 1 },   // the pivot, in the shape's own units (rotation / scale / skew turn round it; X / Y place it)
  ay:  { l: 'Anchor Y', min: -2000, max: 2000, d: 1, u: 'px', open: 1 },
  lv:  { l: 'Fill level', min: 0, max: 1, d: 2 },
  lv2: { l: 'End level', min: 0, max: 1, d: 2 },
  ga:  { l: 'Gradient angle', min: -180, max: 180, d: 1, u: '°', open: 1 },
  gs:  { l: 'Gradient size', min: 0.1, max: 3, d: 2, open: 1 },
  op:  { l: 'Opacity', min: 0, max: 1, d: 2 },
  // r29: a gradient that cycles (black <-> white bands sliding across) and the outline's breath
  gc:  { l: 'Cycles', min: 0, max: 8, d: 2, open: 1, n: '0 = one plain gradient; more = that many black ↔ white bands across, smoothly repeating.' },
  gv:  { l: 'Cycle speed', min: -4, max: 4, d: 2, u: '/s', open: 1, n: 'The bands slide along this many cycles a second (on the timeline, so it loops cleanly when it divides the loop).' },
  gp:  { l: 'Cycle phase', min: -2, max: 2, d: 3, open: 1 },
  brA: { l: 'Breath', min: 0, max: 300, d: 1, u: 'px', open: 1, n: 'The outline breathes: it swells and dips this much in soft lobes that drift round, with a slight scale in and out. 0 = still.' },
  brP: { l: 'Period', min: 0.2, max: 20, d: 2, u: 's', open: 1, n: 'One whole cycle of everything here; it repeats exactly, so make it divide your loop.' },
  brL: { l: 'Lobes', min: 1, max: 8, d: 0 },
  brSp: { l: 'Breath speed', min: 0.05, max: 3, d: 2, u: '×', open: 1, n: 'How fast the breath moves: 1 = one swing per Period, 0.25 = four times slower (softer). For a seamless loop, Period ÷ speed should divide the loop.' },   // r11
  alSp: { l: 'Drift speed', min: 0.05, max: 3, d: 2, u: '×', open: 1, n: 'How fast it drifts (and pulses / swells): 1 = one figure of eight per Period, 0.25 = four times slower (softer).' },   // r11
  brSd: { l: 'Seed', min: 0, max: 100, d: 0, n: 'Picks a different, equally smooth pattern for all of the above.' },
  // r15 (the user, in the tool's chat: "a path shifting slider where the path slowly shifts around: shift amount and shift speed")
  psA: { l: 'Path shift', min: 0, max: 400, d: 1, u: 'px', open: 1, n: 'Each point of the outline wanders slowly round its own place by up to this much (its handles go with it): the whole path shifts around. 0 = still.' },
  psSp: { l: 'Path shift speed', min: 0.05, max: 3, d: 2, u: '×', open: 1, n: 'How fast the path shifts: 1 = one round per Period, 0.25 = four times slower (softer). For a seamless loop, Period ÷ speed should divide the loop.' },
  // r30: the rest of "alive", on the same period as the breath (so it loops with it)
  alP: { l: 'Pulse', min: 0, max: 50, d: 1, u: '%', open: 1, n: 'The whole shape scales in and out by this much.' },
  alD: { l: 'Drift', min: 0, max: 600, d: 0, u: 'px', open: 1, n: 'It wanders round its place in a slow figure of eight (the comp\u2019s px).' },
  alB: { l: 'Blur variance', min: 0, max: 600, d: 0, open: 1, n: 'Its blur (H and V) swells and settles by this much (blurriness, as in Gaussian Blur).' },
  bh:  { l: 'Blur H', min: 0, max: 1000, d: 1, open: 1 },     // each shape's own Gaussian blur (sigma = blurriness x 0.5, comp px)
  bv:  { l: 'Blur V', min: 0, max: 1000, d: 1, open: 1 },
  // r3 add-ons
  gn:  { l: 'Grain', min: 0, max: 400, d: 0, u: '%', open: 1, n: 'AE’s Noise Alpha: noise on the shape’s coverage (Amount %).' },
  gsd: { l: 'Grain seed', min: -3600, max: 3600, d: 0, u: '°', open: 1, n: 'AE’s Random Seed (a new grain every whole degree); for the animated grains the Noise Phase (a new grain every 360°, eased between).' },
  gcy: { l: 'Grain cycle', min: 0, max: 88, d: 0, n: 'Animated grains repeat every this many revolutions (AE Cycle Noise); 0 = never.' },
  vA:  { l: 'Video start', min: -60, max: 600, d: 3, u: 's', open: 1, n: 'Where the video’s first frame sits on the timeline.' },
  vB:  { l: 'Video end', min: -60, max: 600, d: 3, u: 's', open: 1, n: 'Where it ends (stretched to fit, as AE’s time remap: its last frame shows until here, then holds). Same as the start = plays at its own speed.' },
  vRep: { l: 'Video cycle repetitions', min: 0, max: 20, d: 3, open: 1 },
  vPh: { l: 'Video phase shift', min: -3600, max: 3600, d: 1, u: '°', open: 1 },
  vPost: { l: 'Video posterize', min: 0, max: 1024, d: 0, n: 'AE’s Interpolate Palette off on the video’s Colorama: its cycle in this many steps (256). 0 = smooth.' },   // r3+
  vfps: { l: 'Video frame rate', min: 0, max: 120, d: 3, u: 'fps', open: 1, n: 'Its frames, as After Effects shows them: the timeline maps exactly from start to end and each moment shows one whole frame. 0 = any moment of the video (smooth).' },   // r3+
};
const SHAPE_DEF = { x: 0, y: 0, sx: 1, sy: 1, s: 1, r: 0, sk: 0, ska: 0, ax: 0, ay: 0, bh: 400, bv: 400, lv: 1, lv2: 0, ga: 90, gs: 1, op: 1, gc: 0, gv: 0, gp: 0, brA: 0, brP: 2, brL: 3, brSd: 0, brSp: 1, alSp: 1, psA: 0, psSp: 1, alP: 0, alD: 0, alB: 0, gn: 0, gsd: 0, gcy: 0, vA: 0, vB: 0, vRep: 1, vPh: 0, vfps: 0, vPost: 0 };
const SHAPE_PROPS = ['path', 'x', 'y', 'sx', 'sy', 's', 'r', 'sk', 'ska', 'ax', 'ay', 'bh', 'bv', 'lv', 'lv2', 'ga', 'gs', 'gc', 'gv', 'gp', 'brA', 'brP', 'brL', 'brSd', 'brSp', 'alSp', 'psA', 'psSp', 'alP', 'alD', 'alB', 'op', 'gn', 'gsd', 'gcy', 'vA', 'vB', 'vRep', 'vPh', 'vstops'];
// values that are not numbers (not keyframable), per stage
const NONNUM = {
  shape: ['lvHi', 'ovClip'],   // r3+: ovClip { x, y, w, h, on } = the shapes over the Colorama show only inside this box (a precomp's frame)
  bands: ['pattern', 'bSoftLink', 'bInv', 'dChH', 'dChV', 'dKeep', 'dBeh', 'dWrap', 'dExpand', 'dSpace', 'dFlip', 'fx', 'rOn', 'rProf', 'rLightShape', 'bAfter', 'mapBox', 'mapBoxOn', 'dClip'],
  strokes: ['sEdges', 'sSide', 'sBlend', 'sFollow', 'sInv', 'sMask', 'soOn', 'soStops', 'soBlend', 'sMaskOwn', 'so2On', 'so2Stops', 'so2Blend', 'soImg', 'soV', 'so2Img', 'so2V'],
  color: ['stops', 'cFrom', 'cInterp', 'cSpace', 'cOut', 'cBgCol', 'cLine', 'cHiP', 'cMode', 'cStraight', 'cMask', 'cMaskInv'],
};
const stageKeys = st => Object.keys(PM).filter(k => PM[k].s === st).concat(NONNUM[st]);
const keyStage = k => k.startsWith('s:') ? 'shape' : k.startsWith('fx:') ? 'bands' : k === 'stops' ? 'color' : k === 'pattern' ? 'bands' : k === 'cStraight' ? 'color' : (PM[k] ? PM[k].s : null);   // ds (2026-10-30): + the band profile and the edge treatment   // r35: 'stops' = the Colorama line, keyed whole

// From Figma 180-6902 (the AE "Fractal" map, 3000 x 2000): a pair of bands repeating every 80 px at 15° (measured from the pixels).
// A: 38.65 px, ramp 0 -> 1 over 26.1 px, then white. B: 41.37 px, ramp 0 -> 0.46 over 26.1 px, then white.
const RAY_PATTERN = [{ w: 38.65, r: 26.1, lo: 0, hi: 1, pl: 1 }, { w: 41.37, r: 26.1, lo: 0, hi: 0.46, pl: 1 }];
// From Figma 181-6913 (AE Colorama output cycle): stop phase (clockwise from the top) and colour, measured from the wheel.
const RAY_WHEEL = [[0.126, '#f5f5f6'], [0.270, '#d8dcdd'], [0.328, '#eff4ef'], [0.389, '#d9e1d1'], [0.448, '#9cc8fa'], [0.572, '#334fd8'], [0.720, '#3251d8'], [0.981, '#7e7f85']];

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const roundTo = (v, d) => { const k = Math.pow(10, d); return Math.round(v * k) / k; };
const fmt = (v, d) => (typeof v === 'number' && isFinite(v)) ? v.toFixed(d) : '—';
const clone = v => v === undefined ? v : JSON.parse(JSON.stringify(v));
// r35: a key's array value is a path (points) or the Colorama line (stops { p, c })
const isStops = v => Array.isArray(v) && v.length > 0 && !!v[0] && typeof v[0] === 'object' && 'c' in v[0] && !('x' in v[0]);
const isPattern = v => Array.isArray(v) && v.length > 0 && !!v[0] && typeof v[0] === 'object' && 'w' in v[0] && 'lo' in v[0];   // ds (2026-10-30): a keyed band profile
function lerpPattern(a, b, w) {   // ds: band by band (the same bands): width, ramp, levels; a different band count holds, then snaps
  if (a.length !== b.length) return w < 1 ? a : b;
  return a.map((x, i) => { const y = b[i], o = Object.assign({}, x); for (const k of ['w', 'r', 'lo', 'hi', 'pl']) if (typeof x[k] === 'number' && typeof y[k] === 'number') o[k] = x[k] + (y[k] - x[k]) * w; return o; });
}
const clonePts = pts => isStops(pts) ? pts.map(s => ({ p: s.p, c: s.c })) : pts.map(a => ({ x: a.x, y: a.y, ix: a.ix, iy: a.iy, ox: a.ox, oy: a.oy, sm: !!a.sm, mir: a.mir || (a.sm ? 'both' : 'none') }));
const skey = (id, prop) => 's:' + id + ':' + prop;
function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function capture(t, e) { try { t.setPointerCapture(e.pointerId); } catch (err) { } }
function blob(rx, ry, f) {
  const n = f.length, k = 4 / 3 * Math.tan(Math.PI / (2 * n)), pts = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n, r = f[i];
    const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r, tx = -Math.sin(a) * rx * r * k, ty = Math.cos(a) * ry * r * k;
    pts.push({ x: roundTo(x, 2), y: roundTo(y, 2), ix: roundTo(-tx, 2), iy: roundTo(-ty, 2), ox: roundTo(tx, 2), oy: roundTo(ty, 2), sm: true, mir: 'both' });
  }
  return pts;
}

// shape tools: a rectangle (corner radius), ellipse, polygon (sides) or star (points, inner radius) as an editable path, w x h round 0,0
function genShape(kind, w, h, o) {
  o = o || {}; const hw = w / 2, hh = h / 2, pts = [];
  const P = (x, y, ix, iy, ox, oy, mir) => pts.push({ x: roundTo(x, 2), y: roundTo(y, 2), ix: roundTo(ix || 0, 2), iy: roundTo(iy || 0, 2), ox: roundTo(ox || 0, 2), oy: roundTo(oy || 0, 2), sm: !!mir && mir !== 'none', mir: mir || 'none' });
  if (kind === 'ellipse') return blob(hw, hh, [1, 1, 1, 1]);
  if (kind === 'rect') {
    const r = clamp(+o.rad || 0, 0, Math.min(hw, hh)), k = 0.5523 * r;
    if (r < 0.01) { P(-hw, -hh); P(hw, -hh); P(hw, hh); P(-hw, hh); return pts; }
    P(-hw + r, -hh, -k, 0, 0, 0); P(hw - r, -hh, 0, 0, k, 0); P(hw, -hh + r, 0, -k, 0, 0); P(hw, hh - r, 0, 0, 0, k);
    P(hw - r, hh, k, 0, 0, 0); P(-hw + r, hh, 0, 0, -k, 0); P(-hw, hh - r, 0, k, 0, 0); P(-hw, -hh + r, 0, 0, 0, -k);
    return pts;
  }
  if (kind === 'polygon') { const n = clamp(Math.round(o.sides || 6), 3, 64); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; P(Math.cos(a) * hw, Math.sin(a) * hh); } return pts; }
  if (kind === 'star') { const n = clamp(Math.round(o.star || 5), 3, 64), q = clamp(+o.inner || 0.45, 0.05, 1); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, f = i % 2 ? q : 1; P(Math.cos(a) * hw * f, Math.sin(a) * hh * f); } return pts; }
  return blob(hw, hh, [1, 1, 1, 1]);
}
// which band edges get a stroke: [A start, A ramp end, B start, B ramp end, ...] (8 bands max)
function edgesFrom(edge, bands) { const a = []; for (let i = 0; i < MAXB; i++) { const on = bands === 'all' || (bands === 'odd' ? i % 2 === 0 : i % 2 === 1); a.push(on && edge !== 'ramp', on && edge !== 'reset'); } return a; }
// ---------- the document ----------
function defaultP() {
  const p = {
    lbg: 0, lvHi: false,   // r4: lvHi = each solid shape's level in full precision (no 8-bit step; set by the AE converter)
    pattern: clone(RAY_PATTERN), bAng: 14.95, bScale: 1, bOff: 0, bDrift: 0, bSoftH: 0, bSoftV: 0, bSoftLink: true, bLo: 0, bHi: 1, bInv: false, bPhG: 0, bPhB: 0,
    fx: [], mapW: 0, mapH: 0, mapX: 0, mapY: 0,
    mapBox: null, mapBoxOn: false,   // r3 (from AE): where the map layer ends, [across from, to, along from, to] (comp px from the centre); past it the map is empty
    dChH: 'r', dMaxH: 22, dChV: 'g', dMaxV: 29, dKeep: true, dBeh: 'center', dWrap: false, dExpand: true, dSpace: 'screen', dFlip: false,
    dClip: false,   // r4: reads past the comp edge are empty (AE: an adjustment layer or precomp only has the comp's frame to displace)
    rOn: false, rProf: 'round', rDepth: 60, rIor: 1.5, rBulge: 1, rFlat: 0.6, rValley: 0.04, rShear: 0, rDisp: 0, rFrost: 0, rEFrost: 0,
    rHi: 0, rHiPos: -0.45, rHiW: 0.12, rEdge: 0, rShade: 0, rShW: 0.2, rLightShape: true,
    pOp: 1,   // r17: Post · Opacity
    cMaskOnly: true,   // r23: the Colorama's mask feather only on what its shape masks (the layers under it + matted by it; r24: one stacked above stays). A document from before r23: false, as it looked
    bOp: 1,   // r21: Bands · Opacity
    bAfter: !!RZS_NS,   // razorsensation2 r2: the bands over the Colorama (glass in front of the coloured layer); razorsensation.html keeps them under it
    sEdges: edgesFrom('reset', 'all'), sSide: 'after', sBlend: 'screen', sFollow: true, sInv: false,
    sWidth: 8, sGrad: 1, sOff: 0, sInt: 0.35, sChoke: 0.25, sSoft: 0.3, sMask: '', sFeather: 40,
    stops: RAY_WHEEL.map(([p, c]) => ({ p, c })), cFrom: 'int', cInLo: 0, cInHi: 1, cInGam: 1, cRep: 1.09, cShift: 0, cDrift: 0,
    cInterp: true, cSpace: 'srgb', cOut: 'matte', cBgCol: '#ffffff', cBlend: 0, dither: 1, cSmooth: 0, cInDither: 0, cHiP: true,
    cStraight: false,   // r4: the Colorama reads the straight colour under partial alpha (AE effects do), not the shapes over the layer background
    sHiP: false,   // r3: exact fills (a solid shape's grey and opacity in float, not 8-bit: AE fades and keyed greys without 1/255 steps); set by AE imports
    cMode: 'line', cPh: 0, cPost: 0, ovOp: 1, ovClip: null, cMask: '', cMaskF: 60, cMaskInv: false,   // r6: cMask = a shape masking the final colours, feathered by cMaskF   // r3: 'cycle' = AE's Colorama (the stops round a wrapping cycle, Stretch = Cycle Repetitions, Phase Shift)
    soOn: false, soStops: [{ p: 0, c: '#2fc627', a: 1 }, { p: 0.27, c: '#e2e6e4', a: 0 }], soBlend: 'screen', soOp: 1, soOff: 0, soBlur: 0, sMaskOwn: false,
    so2On: false, so2Stops: [{ p: 0, c: '#ffffff', a: 1 }, { p: 0.1, c: '#ffffff', a: 0 }], so2Blend: 'screen', so2Op: 1, so2Off: 0, so2Blur: 0, soImg: '', soV: null, so2Img: '', so2V: null,
  };
  wheelToLine(p);   // r15: the Figma wheel laid out as the line that looks the same
  return p;
}
function defaultShapes() { return [normShape({ id: 's1', name: 'Shape 1', on: true, x: 0, y: 150, pts: blob(700, 450, [1, 0.92, 1.06, 0.95, 1.03]) })]; }
function defaultShapeK() { const ez = () => EASES.easy.slice(); return { 's:s1:x': [{ t: 0, v: -350, e: ez() }, { t: 3, v: 350, e: ez() }, { t: 6, v: -350, e: ez() }] }; }
function defaults() {
  return {
    v: 2, comp: { w: 3000, h: 2000 },
    p: defaultP(),
    en: { bands: false, strokes: false, color: false },
    shapes: defaultShapes(), K: defaultShapeK(),
    tl: { dur: 6, loop: true, t: 0, speed: 1, play: true, ease: 'easy', snap: true, range: null, rangeN: 0 },   // rangeN (r29): the loop range plays that many times, then the timeline goes on (0 = forever)
    view: { dpr: 1.6, fps: 0, mode: 'final', handles: true, snap: true, ref: true, refOp: 1 },
    ref: { src: '', glass: [] },   // r19: the reference UI on top (a path, or 'store:<settings name>' for a PNG loaded in the tool); its on / opacity are view settings
    ui: { page: 'shape', sel: 's1', shut: {}, stop: 0, tour: { welcomed: false, tips: true, seen: {} }, tlOpen: {}, lockWH: false },
    pre: { shape: 'b-shape', bands: 'b-bands', strokes: 'b-strokes', color: 'b-color' },
    nid: 2,
  };
}
function normShape(s) {
  for (const k in SHAPE_DEF) if (typeof s[k] !== 'number') s[k] = SHAPE_DEF[k];
  if (!['solid', 'linear', 'radial'].includes(s.fill)) s.fill = 'solid';
  if (s.blink === undefined) s.blink = true;
  if (s.blink !== false) s.bv = s.bh;
  if (!['normal', 'subtract', 'intersect', 'add', 'clip'].includes(s.blend)) s.blend = 'normal';
  if (typeof s.matte !== 'string') s.matte = ''; if (!['alpha', 'alphaInv', 'luma', 'lumaInv'].includes(s.mmode)) s.mmode = 'alpha';
  // r3 add-ons: skip the bands, grain mode, drawn over the Colorama (its own colour, or a video with its own colour cycle)
  s.nb = !!s.nb; s.ov = !!s.ov; if (!['add', 'clamp', 'scale', 'edges'].includes(s.gnm)) s.gnm = 'edges';
  if (!['', 'uniform', 'squared', 'uanim', 'sanim'].includes(s.gnk)) s.gnk = ''; if (!['clip', 'wrapback', 'wrap'].includes(s.gov)) s.gov = 'clip'; if (typeof s.gq !== 'number') s.gq = 0;   // AE Noise Alpha's own grain ('' = the r3 grain), Overflow, alpha levels (AE's bit depth: 255, 32768, 0 = float)
  if (typeof s.oc !== 'string') s.oc = '#ffffff'; if (typeof s.vsrc !== 'string') s.vsrc = ''; if (!['cycle', 'line', 'none'].includes(s.vmode)) s.vmode = 'cycle';
  // r4 add-ons: clip to the comp's frame before the blur (AE shape / text layers), a still in the shape's box (isrc: a data URL or a path)
  s.cc = !!s.cc; if (typeof s.isrc !== 'string') s.isrc = ''; if (!['alpha', 'grey'].includes(s.imode)) s.imode = 'alpha';
  if (!Array.isArray(s.vstops)) s.vstops = null;
  if (typeof s.inComp !== 'boolean') delete s.inComp;   // r4: true = rastered inside the comp frame before its blur (AE shape / text layers), false = its own frame (AE solids, stills); unset = the bands' Expand Output
  if (s.on === undefined) s.on = true; s.lock = !!s.lock; if (!s.name) s.name = 'Shape';   // lock (r22): not clickable / movable in the viewport if (s.closed === undefined) s.closed = true;
  for (const a of s.pts || []) if (!a.mir) a.mir = !a.sm ? 'none' : Math.abs(Math.hypot(a.ix, a.iy) - Math.hypot(a.ox, a.oy)) < 0.5 ? 'both' : 'angle';
  return s;
}
function normalize(d) {
  const def = defaults();
  if (!d || typeof d !== 'object') return def;
  if (d.v !== 2) {                                   // r1 document: keep its shapes and their keys (scaled from r1's ~1172 px canvas into the comp), the rest starts from the defaults
    if (Array.isArray(d.shapes) && d.shapes.length) {
      const f = def.comp.w / 1172, sc = p => ({ x: p.x * f, y: p.y * f, ix: p.ix * f, iy: p.iy * f, ox: p.ox * f, oy: p.oy * f, sm: !!p.sm });
      def.shapes = d.shapes.filter(s => s && s.id && Array.isArray(s.pts)).map(normShape).map(s => Object.assign(s, { x: s.x * f, y: s.y * f, pts: s.pts.map(sc) }));
      def.K = {};
      for (const k in (d.K || {})) {
        if (!k.startsWith('s:') || !Array.isArray(d.K[k]) || !d.K[k].length) continue;
        const prop = k.split(':')[2];
        def.K[k] = d.K[k].map(key => Object.assign({}, key, { v: prop === 'path' && Array.isArray(key.v) ? key.v.map(sc) : (prop === 'x' || prop === 'y') ? key.v * f : key.v }));
      }
      def.nid = d.nid || 2; def.ui.sel = def.shapes[0] ? def.shapes[0].id : null;
      if (d.tl) Object.assign(def.tl, { dur: d.tl.dur || 6, loop: d.tl.loop !== false });
    }
    return def;
  }
  if (d.p && d.p.cLine === undefined) wheelToLine(d.p, d.K);   // r2-r14: the Colorama wheel -> the line
  if (d.p && d.p.fAmt !== undefined) {   // r2-r16: one fractal amount on the map -> a Fractal Noise effect (Linear Light, along the bands)
    if (!Array.isArray(d.p.fx)) d.p.fx = [];
    if (d.p.fAmt > 0 || (d.K && d.K.fAmt && d.K.fAmt.length)) {
      const f = newFx('fractal', 'x1'), sc = +d.p.fScale || 600;
      Object.assign(f.v, { op: roundTo(d.p.fAmt * 100, 1), blend: 'linlight', band: true, size: sc, sw: 25, sh: 100, cx: 4, si: 50, ss: 49, es: roundTo((+d.p.fSpeed || 0) * 360, 1) });
      d.p.fx.unshift(f);
      if (d.K && d.K.fAmt) d.K['fx:x1:op'] = d.K.fAmt.map(k => Object.assign({}, k, { v: roundTo(k.v * 100, 1) }));
    }
    if (d.K) { delete d.K.fAmt; delete d.K.fScale; delete d.K.fSpeed; }
    delete d.p.fAmt; delete d.p.fScale; delete d.p.fSpeed;
  }
  if (d.p && d.p.bSoft !== undefined) {   // r2-r10: one edge softness -> horizontal + vertical (keys too)
    d.p.bSoftH = d.p.bSoftV = d.p.bSoft; d.p.bSoftLink = true;
    if (d.K && d.K.bSoft) { d.K.bSoftH = clone(d.K.bSoft); d.K.bSoftV = clone(d.K.bSoft); delete d.K.bSoft; }
    delete d.p.bSoft;
  }
  if (d.p && d.p.blurH !== undefined) {   // r2-r6 had one blur for the whole layer: every shape takes it (and its keys)
    const lk = d.p.blurLink !== false;
    for (const s of (Array.isArray(d.shapes) ? d.shapes : [])) if (s && s.bh === undefined) { s.bh = d.p.blurH; s.bv = lk ? d.p.blurH : d.p.blurV; s.blink = lk; }
    if (d.K) for (const s of (Array.isArray(d.shapes) ? d.shapes : [])) {
      if (d.K.blurH) d.K['s:' + s.id + ':bh'] = clone(d.K.blurH);
      if (!lk && d.K.blurV) d.K['s:' + s.id + ':bv'] = clone(d.K.blurV);
    }
    if (d.K) { delete d.K.blurH; delete d.K.blurV; }
    delete d.p.blurH; delete d.p.blurV; delete d.p.blurLink;
  }
  const o = {
    v: 2, comp: Object.assign({}, def.comp, d.comp || {}),
    p: Object.assign({}, def.p, d.p || {}, d.p && !('cMaskOnly' in d.p) ? { cMaskOnly: false } : {}),
    en: Object.assign({}, def.en, d.en || {}),
    shapes: Array.isArray(d.shapes) ? d.shapes.filter(s => s && s.id && Array.isArray(s.pts)).map(normShape) : def.shapes,
    K: (d.K && typeof d.K === 'object') ? d.K : {},
    tl: Object.assign({}, def.tl, d.tl || {}),
    view: Object.assign({}, def.view, d.view || {}),
    ref: Object.assign({}, def.ref, d.ref || {}),
    ui: Object.assign({}, def.ui, d.ui || {}),
    pre: Object.assign({}, def.pre, d.pre || {}),
    nid: d.nid || 2,
  };
  if (Array.isArray(d.stack) && d.stack.length) o.stack = d.stack.filter(e => e && e.doc && typeof e.doc === 'object').map((e, i) => ({   // r6: comps over this one
    id: String(e.id || ('c' + (i + 2))), name: String(e.name || ('Comp ' + (i + 2))).slice(0, 40), on: e.on !== false, op: clamp(e.op == null ? 1 : +e.op, 0, 1),
    blend: COMP_BLENDS.includes(e.blend) ? e.blend : 'normal', grp: e.grp ? String(e.grp).slice(0, 24) : undefined, doc: normalize(Object.assign({}, e.doc, { stack: undefined, comp: o.comp })) }));
  delete o.p.bCurve;   // r5: ramps are always straight
  if (!Array.isArray(o.p.sEdges)) o.p.sEdges = edgesFrom(o.p.sEdge || 'reset', o.p.sBands || 'all');   // r10: edge by edge
  while (o.p.sEdges.length < MAXB * 2) o.p.sEdges.push(o.p.sEdges.length % 2 === 0);
  delete o.p.sEdge; delete o.p.sBands;
  if (!(o.ui.band >= 0)) o.ui.band = 0;
  o.ui.topt = Object.assign({ rad: 0, sides: 6, star: 5, inner: 0.45 }, o.ui.topt || {});
  if (!Array.isArray(o.p.pattern) || !o.p.pattern.length) o.p.pattern = clone(RAY_PATTERN);
  if (!Array.isArray(o.p.stops) || !o.p.stops.length) o.p.stops = def.p.stops;
  o.p.fx = normFx(o.p.fx);
  if (o.p.sMask && !o.shapes.some(x => x.id === o.p.sMask)) o.p.sMask = '';
  if (o.p.cMask && !o.shapes.some(x => x.id === o.p.cMask)) o.p.cMask = '';   // r6   // the strokes' mask shape is gone: the shape layer again
  for (const s of o.shapes) if (s.blink !== false && o.K['s:' + s.id + ':bh'] && !o.K['s:' + s.id + ':bv']) o.K['s:' + s.id + ':bv'] = clone(o.K['s:' + s.id + ':bh']);   // r11: linked blur = both tracks
  for (const k of Object.keys(o.K)) {
    const tr = o.K[k], st = keyStage(k);
    const ok = Array.isArray(tr) && tr.length && st && (!k.startsWith('s:') || o.shapes.some(s => s.id === k.split(':')[1])) && (!k.startsWith('fx:') || fxKeyLive(k, o));
    if (!ok) delete o.K[k]; else tr.sort((a, b) => a.t - b.t);
  }
  if (!o.shapes.some(s => s.id === o.ui.sel)) o.ui.sel = o.shapes[0] ? o.shapes[0].id : null;
  if (!VIEWS.some(v => v[0] === o.view.mode)) o.view.mode = 'final';   // r20: a timeline zoom used to write a number here
  if (!STAGES.includes(o.ui.page)) o.ui.page = 'shape';
  if (!o.ui.shut) o.ui.shut = {};
  if (!o.ui.tlOpen || typeof o.ui.tlOpen !== 'object') o.ui.tlOpen = {};
  o.ui.tour = Object.assign({ welcomed: false, tips: true, seen: {} }, o.ui.tour || {}); if (!o.ui.tour.seen) o.ui.tour.seen = {};
  o.ui.ai = -1;
  o.tl.t = clamp(+o.tl.t || 0, 0, o.tl.dur);
  o.comp.w = clamp(Math.round(+o.comp.w) || 3000, 16, 8000); o.comp.h = clamp(Math.round(+o.comp.h) || 2000, 16, 8000);
  return o;
}
let D = defaults();

// ---------- keyframes ----------
const keySel = new Set();
let focusArea = 'vp';   // where keyboard / clipboard commands go: 'tl' after a click in the timeline, 'vp' after one in the viewport
function cubic(x1, y1, x2, y2, x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  if (x1 === y1 && x2 === y2) return x;
  const B = (a, b, t) => ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 32; i++) { const v = B(x1, x2, t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
  return B(y1, y2, t);
}
function lerpPts(a, b, w) {
  if (a.length !== b.length) return a;
  return a.map((p, i) => { const q = b[i]; return { x: p.x + (q.x - p.x) * w, y: p.y + (q.y - p.y) * w, ix: p.ix + (q.ix - p.ix) * w, iy: p.iy + (q.iy - p.iy) * w, ox: p.ox + (q.ox - p.ox) * w, oy: p.oy + (q.oy - p.oy) * w, sm: p.sm, mir: p.mir }; });
}
function evalTrack(ks, t) {
  const n = ks.length;
  if (t <= ks[0].t) return ks[0].v;
  if (t >= ks[n - 1].t) return ks[n - 1].v;
  let i = 0; while (ks[i + 1].t <= t) i++;
  const a = ks[i], b = ks[i + 1];
  if (a.e === 'hold') return a.v;
  const span = b.t - a.t, u = span > 0 ? (t - a.t) / span : 1;
  const e = Array.isArray(a.e) ? a.e : EASES.linear;
  const w = cubic(e[0], e[1], e[2], e[3], u);
  if (Array.isArray(a.v)) return isStops(a.v) ? lerpStops(a.v, b.v, w) : isPattern(a.v) ? lerpPattern(a.v, b.v, w) : lerpPts(a.v, b.v, w);
  return a.v + (b.v - a.v) * w;
}
// r35: between two keys of the Colorama line: each stop (by its place in the list) slides and blends its colour.
// razorsensation2 r14 (2026-10-19; the user: "if I add or remove a colour from the Colorama while keyframing it, it breaks; it only
// works with the same number of colours"): keys with a different number of stops blend too (they held, then snapped). The two lines'
// stops are matched in order by place (alignStops: the nearest pair up; a stop left without a partner is one that appears or goes);
// a pair slides and blends as before; a stop that appears starts ON the first line (its place, that line's colour there, as the
// renderer draws it: its colour space, line or cycle) and turns into its own colour; one that goes turns into the second line's
// colour at its place. So at each key the line is exactly that key's, and nothing snaps or jumps in between.
function lineAtFn(st) {
  const P = D.p, cyc = P.cMode === 'cycle', s = st.map(x => ({ p: clamp(+x.p || 0, 0, 1), c: stopRGB(x, cyc) })).sort((x, y) => x.p - y.p), [conv, back] = colorSpace(P), L = s.map(x => conv(x.c));
  return x => (cyc ? cycleColor : lineColor)(s, L, back, P.cInterp, x).slice();
}
function alignStops(A, B, gap) {   // A, B sorted by place: [[i | -1, j | -1], ...] in order, the cheapest match (place distance; gap = a stop alone)
  const n = A.length, m = B.length, C = [], T = [];
  for (let i = 0; i <= n; i++) { C.push(new Float64Array(m + 1)); T.push(new Int8Array(m + 1)); }
  for (let i = 1; i <= n; i++) { C[i][0] = i * gap; T[i][0] = 1; }
  for (let j = 1; j <= m; j++) { C[0][j] = j * gap; T[0][j] = 2; }
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const d = C[i - 1][j - 1] + Math.abs(A[i - 1].p - B[j - 1].p), u = C[i - 1][j] + gap, l = C[i][j - 1] + gap;
    if (d <= u && d <= l) { C[i][j] = d; T[i][j] = 0; } else if (u <= l) { C[i][j] = u; T[i][j] = 1; } else { C[i][j] = l; T[i][j] = 2; }
  }
  const out = []; let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && T[i][j] === 0) { out.push([i - 1, j - 1]); i--; j--; }
    else if (i > 0 && (j === 0 || T[i][j] === 1)) { out.push([i - 1, -1]); i--; }
    else { out.push([-1, j - 1]); j--; }
  }
  return out.reverse();
}
function lerpStops(a, b, w) {
  if (a.length !== b.length) {
    if (w <= 0) return a; if (w >= 1) return b;
    const A = a.slice().sort((x, y) => x.p - y.p), B = b.slice().sort((x, y) => x.p - y.p), fa = lineAtFn(A), fb = lineAtFn(B);
    const cyc = D.p.cMode === 'cycle', aa = x => stopAlpha(A, cyc, D.p.cInterp, x), ab = x => stopAlpha(B, cyc, D.p.cInterp, x);
    const mk = (p, ca, cb, oa, ob) => { const cf = ca.map((v, k) => v + (cb[k] - v) * w), o = Object.defineProperty({ p: roundTo(p, 5), c: rgb2hex(cf) }, 'cf', { value: cf }); if (oa < 1 || ob < 1) o.a = roundTo(oa + (ob - oa) * w, 4); return o; };
    return alignStops(A, B, 0.12).map(([i, j]) => i >= 0 && j >= 0 ? mk(A[i].p + (B[j].p - A[i].p) * w, stopRGB(A[i], true), stopRGB(B[j], true), aOf(A[i]), aOf(B[j]))
      : j >= 0 ? mk(B[j].p, fa(B[j].p), stopRGB(B[j], true), aa(B[j].p), aOf(B[j]))     // appears: from the first line's colour at its place
      : mk(A[i].p, stopRGB(A[i], true), fb(A[i].p), aOf(A[i]), ab(A[i].p)));            // goes: into the second line's colour at its place
  }
  // r16 (2026-10-22): the same count, each stop paired with the one in its place along the line (1st with 1st, ...), not its place in
  // the list: a stop added at the list's end (the user's Landing · Light copy: #a3c8ff at .71, last) used to pair with the last one of
  // the other key and cross the stops between them, the line flipping for a frame at each crossing (a flicker). Unchanged wherever the
  // list order already matched the line order; the output keeps a's order (the stop editor's indices)
  const ra = a.map((s, i) => i).sort((i, j) => a[i].p - a[j].p || i - j), rb = b.map((s, i) => i).sort((i, j) => b[i].p - b[j].p || i - j), pr = [];
  ra.forEach((i, r) => { pr[i] = rb[r]; });
  return a.map((s, i) => { const t = b[pr[i]], A = hex2rgb(s.c), B = hex2rgb(t.c), cf = A.map((v, k) => v + (B[k] - v) * w), o = Object.defineProperty({ p: roundTo(s.p + (t.p - s.p) * w, 5), c: rgb2hex(cf) }, 'cf', { value: cf }); if (aOf(s) < 1 || aOf(t) < 1) o.a = roundTo(aOf(s) + (aOf(t) - aOf(s)) * w, 4); return o; });   // r3+: cf = the colour unrounded (Cycle mode uses it; hidden from JSON, so the line's edit / dirty checks see what they always saw)
}
// r3+: a stop's colour; Cycle mode (AE) takes the unrounded colour between two keys (cf, while it still matches c)
const stopsCF = st => (st || []).map(s => s && Array.isArray(s.cf) ? s.cf.map(v => roundTo(v, 6)) : 0);   // for the signatures that rebake a line
const stopRGB = (s, exact) => exact && Array.isArray(s.cf) && rgb2hex(s.cf) === rgb2hex(hex2rgb(s.c)) ? s.cf.slice() : hex2rgb(s.c);
const shapeById = id => D.shapes.find(s => s.id === id);
function baseGet(key) {
  if (key.startsWith('s:')) { const [, id, prop] = key.split(':'); const s = shapeById(id); if (!s) return 0; return prop === 'path' ? s.pts : s[prop]; }
  if (key.startsWith('fx:')) { const [, id, prop] = key.split(':'); const f = fxById(id); return f ? f.v[prop] : 0; }
  return D.p[key];
}
function baseSet(key, v) {
  if (key.startsWith('s:')) { const [, id, prop] = key.split(':'); const s = shapeById(id); if (!s) return; if (prop === 'path') s.pts = v; else s[prop] = v; return; }
  if (key.startsWith('fx:')) { const [, id, prop] = key.split(':'); const f = fxById(id); if (f) f.v[prop] = v; return; }
  D.p[key] = v;
}
const isAnim = key => !!(D.K[key] && D.K[key].length);
function ev(key) { const tr = D.K[key]; return tr && tr.length ? evalTrack(tr, D.tl.t) : baseGet(key); }
function newEase() { const e = D.tl.ease; return e === 'hold' ? 'hold' : (EASES[e] || EASES.easy).slice(); }
function keyIndexAt(key) { const tr = D.K[key]; if (!tr) return -1; return tr.findIndex(k => Math.abs(k.t - D.tl.t) < 1e-3); }
function setKey(key, v) {
  const tr = D.K[key] || (D.K[key] = []);
  const val = Array.isArray(v) ? clonePts(v) : v, i = keyIndexAt(key);
  if (i >= 0) tr[i].v = val; else { tr.push({ t: roundTo(D.tl.t, 3), v: val, e: newEase() }); tr.sort((a, b) => a.t - b.t); }
}
// set a value: an animated value gets a key at the current time (as in AE), otherwise it is the value
function setProp(key, v) { if (isAnim(key)) setKey(key, v); else baseSet(key, v); }
function keyLive(k) { for (const key in D.K) if (D.K[key].includes(k)) return true; return false; }
function dropTrack(key) { const v = ev(key); baseSet(key, Array.isArray(v) ? clonePts(v) : v); delete D.K[key]; for (const k of [...keySel]) if (!keyLive(k)) keySel.delete(k); }
function toggleAnim(key) {
  if (isAnim(key)) dropTrack(key);
  else { const v = ev(key); D.K[key] = [{ t: roundTo(D.tl.t, 3), v: Array.isArray(v) ? clonePts(v) : v, e: newEase() }]; }
}
function toggleKeyHere(key) {
  if (!isAnim(key)) return;
  const i = keyIndexAt(key), tr = D.K[key];
  if (i < 0) setKey(key, ev(key));
  else if (tr.length === 1) dropTrack(key);
  else { keySel.delete(tr[i]); tr.splice(i, 1); }
}
function deleteSelectedKeys() {
  for (const key of Object.keys(D.K)) {
    const tr = D.K[key], keep = tr.filter(k => !keySel.has(k));
    if (keep.length === tr.length) continue;
    if (!keep.length) { const v = ev(key); baseSet(key, Array.isArray(v) ? clonePts(v) : v); delete D.K[key]; }
    else D.K[key] = keep;
  }
  keySel.clear();
}
function allKeyTimes(key) { const ts = []; for (const k in D.K) if (!key || k === key) for (const x of D.K[k]) ts.push(x.t); return ts.sort((a, b) => a - b); }
const propLabel = prop => prop === 'path' ? 'Path' : prop === 'vstops' ? 'Video colours' : (SPM[prop] ? SPM[prop].l : prop);
function trackLabel(k) {
  if (k.startsWith('s:')) { const [, id, prop] = k.split(':'); const s = shapeById(id); return (s ? s.name : id) + ' · ' + propLabel(prop); }
  if (k.startsWith('fx:')) { const [, id, prop] = k.split(':'), f = fxById(id); return f ? FX[f.t].name + ' · ' + FX[f.t].P[prop].l : k; }
  if (k === 'pattern') return 'Band profile'; if (k === 'cStraight') return 'Read straight colour (AE)';   // ds
  return PM[k] ? PM[k].l : k;
}
function trackList() {
  const out = [];
  for (const st of STAGES) {
    if (st === 'shape') for (const s of D.shapes) for (const prop of SHAPE_PROPS) { const k = skey(s.id, prop); if (isAnim(k)) out.push({ key: k, st, label: trackLabel(k) }); }
    for (const k in PM) if (PM[k].s === st && isAnim(k)) out.push({ key: k, st, label: PM[k].l });
    if (st === 'bands') for (const f of D.p.fx || []) for (const p in FX[f.t].P) { const k = 'fx:' + f.id + ':' + p; if (isAnim(k)) out.push({ key: k, st, label: trackLabel(k) }); }
  }
  return out;
}

// ---------- the scene at the current time ----------
function evalParams() {
  const P = Object.assign({}, D.p); for (const k in PM) if (D.K[k] && D.K[k].length) P[k] = evalTrack(D.K[k], D.tl.t);
  if (isAnim('stops')) P.stops = typeof stopsView === 'function' ? stopsView() : evalTrack(D.K.stops, D.tl.t);   // r35: the keyed line (the studio: with an edit in progress)
  if (isAnim('pattern')) P.pattern = evalTrack(D.K.pattern, D.tl.t);   // ds (2026-10-30): the band profile keyed (the loader's AE bands -> the bg ramp)
  if (isAnim('cStraight')) P.cStraight = evalTrack(D.K.cStraight, D.tl.t);   // ds: the edge treatment keyed (1 straight colour (AE), 0 over the layer background, between = a blend)
  P.fx = (D.p.fx || []).map(f => { const v = Object.assign({}, f.v); for (const p in v) { const tr = D.K['fx:' + f.id + ':' + p]; if (tr && tr.length) v[p] = evalTrack(tr, D.tl.t); } return { id: f.id, t: f.t, on: f.on, v }; });
  return P;
}
function evShape(s) {
  const k = p => skey(s.id, p), o = { id: s.id, on: s.on, lock: !!s.lock, fill: s.fill || 'solid', blink: s.blink !== false, blend: s.blend || 'normal', matte: s.matte || '', mmode: s.mmode || 'alpha', pts: ev(k('path')), closed: s.closed !== false,
    nb: !!s.nb, gnm: s.gnm || 'edges', gnk: s.gnk || '', gov: s.gov || 'clip', gq: +s.gq || 0, ov: !!s.ov, oc: s.oc || '#ffffff', vsrc: s.vsrc || '', vmode: s.vmode || 'cycle', vstops: s.vsrc ? ev(k('vstops')) || null : null,   // r3 add-ons
    cc: !!s.cc, isrc: s.isrc || '', imode: s.imode === 'grey' ? 'grey' : 'alpha', inComp: s.inComp };   // r4 add-ons
  for (const p in SHAPE_DEF) { const v = ev(k(p)); o[p] = typeof v === 'number' ? v : SHAPE_DEF[p]; }
  return o;
}
// r29: the breath — the outline (sampled to 64 points round its middle) pushed in and out along its normals by two soft waves that drift
// round in opposite directions (lobes L and L+1) plus a slight swell, all exactly periodic over brP seconds (so loops stay seamless)
function cubicAt(a, b, t) { const u = 1 - t, p0 = [a.x, a.y], p1 = [a.x + a.ox, a.y + a.oy], p2 = [b.x + b.ix, b.y + b.iy], p3 = [b.x, b.y];
  return [0, 1].map(i => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]); }
function breathPts(s, time) {
  const P = s.pts, n = P.length; if (n < 2 || s.closed === false) return P;
  const N = 64, per = Math.max(1, Math.ceil(N / n)), raw = [];
  for (let i = 0; i < n; i++) for (let k = 0; k < per; k++) raw.push(cubicAt(P[i], P[(i + 1) % n], k / per));
  let cx = 0, cy = 0; for (const p of raw) { cx += p[0]; cy += p[1]; } cx /= raw.length; cy /= raw.length;
  const A = s.brA, w = 2 * Math.PI * time / Math.max(0.2, s.brP), L = Math.max(1, Math.round(s.brL)), sd = s.brSd * 1.618;
  return raw.map(([x, y]) => {
    const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy) || 1, th = Math.atan2(dy, dx);
    const off = A * (0.55 * Math.sin(L * th + sd + w) + 0.3 * Math.sin((L + 1) * th + sd * 2.3 - 2 * w) + 0.25 * Math.sin(w + sd * 0.7));
    const k = Math.max(0.05, (r + off) / r);
    return { x: cx + dx * k, y: cy + dy * k, ix: 0, iy: 0, ox: 0, oy: 0, sm: false, mir: 'none' };
  });
}
// r15: the path shift: every point of the outline (its handles riding with it) on its own slow loop round its place, two smooth waves
// (once and twice per round) with a phase per point (the golden angle, from the seed), so the outline morphs gently; exactly periodic
// over brP / psSp, so loops stay seamless
function shiftPts(P, A, time, period, seed) {
  const w = 2 * Math.PI * time / Math.max(0.2, period), sd = seed * 1.618;
  return P.map((p, i) => {
    const ph = sd + i * 2.39996;
    const dx = A * (0.7 * Math.sin(w + ph) + 0.3 * Math.sin(2 * w + ph * 1.7)), dy = A * (0.7 * Math.cos(w + ph * 1.3) + 0.3 * Math.sin(2 * w + ph * 0.9 + 1));
    return Object.assign({}, p, { x: p.x + dx, y: p.y + dy });
  });
}
// r30: everything alive at time t (render only; the viewport outline stays still): breath (the outline), pulse (scale), drift (a figure
// of eight round its place), blur variance; all on the breath's period, so they loop together
function aliveShape(s, t) {
  if (!(s.brA > 0.01 || s.alP > 0.001 || s.alD > 0.01 || s.alB > 0.01 || s.psA > 0.01)) return s;
  const o = Object.assign({}, s), w = 2 * Math.PI * t * (s.alSp ?? 1) / Math.max(0.2, s.brP), sd = s.brSd * 1.618;   // r11: drift / pulse / blur at their own speed
  if (s.alP > 0.001) o.s = s.s * (1 + s.alP / 100 * Math.sin(w + sd * 0.9));
  if (s.alD > 0.01) { o.x = s.x + s.alD * Math.sin(w + sd * 1.3); o.y = s.y + s.alD * 0.6 * Math.sin(2 * w + sd * 2.1); }
  if (s.alB > 0.01) { const v = s.alB * Math.sin(w + sd * 0.5 + 1); o.bh = Math.max(0, s.bh + v); o.bv = Math.max(0, s.bv + v); }
  if (s.psA > 0.01 && s.pts && s.pts.length > 1) o.pts = shiftPts(s.pts, s.psA, t * (s.psSp ?? 1), s.brP, s.brSd);   // r15: the path shift (then the breath on it)
  if (s.brA > 0.01) o.pts = breathPts(Object.assign({}, s, { pts: o.pts }), t * (s.brSp ?? 1));   // r11: the breath at its own speed
  return o;
}
// r32: the alive clock. Live motion (Alive: breath, pulse, drift, blur variance; the cycling fills) runs on it, not on the playhead:
// during playback it moves on by exactly the time played, whatever the playhead does (a loop range wrapping, the timeline looping),
// so a loop never cuts it — a loop range only stands for "this repeats in code for as long as it needs". When the playhead is moved
// by hand (scrubbing, a key, restart) it starts over from the playhead, so a still frame is always the same.
// Played once to its end (ALIVE.end), a player (?player=, Demo, an exported page) holds the last frame but keeps anything alive living.
const ALIVE = { ofs: 0, t: 0, end: false };
function aliveT() { if (D.tl.t !== ALIVE.t) { ALIVE.ofs = 0; ALIVE.t = D.tl.t; ALIVE.end = false; } return D.tl.t + ALIVE.ofs; }
function aliveTo(a) { ALIVE.t = D.tl.t; ALIVE.ofs = a - D.tl.t; }   // after a playback step: the alive time is a (the old one + the time played)
const aliveOn = s => s.brA > 0.01 || s.alP > 0.001 || s.alD > 0.01 || s.alB > 0.01 || s.psA > 0.01 || (s.gc > 0 && Math.abs(s.gv) > 1e-6);
const anyAlive = () => D.shapes.some(s => { if (s.on === false) return false; const e = evShape(s); return e.op > 0.001 && aliveOn(e); });
function aliveHold(dt) { const sp = D.tl.speed || 1; aliveTo(aliveT() + dt * sp); live += dt * sp; }   // the held end, still alive
const selShape = () => shapeById(D.ui.sel);
const selEv = () => { const s = selShape(); return s ? evShape(s) : null; };
// shape local -> comp px
// a shape's transform, AE's order: anchor -> W / H and scale -> skew (along its axis) -> rotation -> position
function shapeXf(s) {
  const a = (s.r || 0) * Math.PI / 180, c = Math.cos(a), n = Math.sin(a), k = s.s ?? 1, fx = s.sx ?? 1, fy = s.sy ?? 1, ax = s.ax || 0, ay = s.ay || 0;
  const t = Math.tan(clamp(s.sk || 0, -85, 85) * Math.PI / 180), q = (s.ska || 0) * Math.PI / 180, cq = Math.cos(q), sq = Math.sin(q);
  const ox = D.comp.w / 2 + (s.x || 0), oy = D.comp.h / 2 + (s.y || 0), nzv = v => (Math.abs(v) < 1e-6 ? (v < 0 ? -1e-6 : 1e-6) : v);
  // scaled space (local minus anchor, times W / H) -> comp offset from the position
  const fwd = (x, y) => { x *= k; y *= k; if (t) { const u = x * cq + y * sq, v = -x * sq + y * cq, u2 = u + t * v; x = u2 * cq - v * sq; y = u2 * sq + v * cq; } return [x * c - y * n, x * n + y * c]; };
  const inv = (dx, dy) => { let x = dx * c + dy * n, y = -dx * n + dy * c; if (t) { const u = x * cq + y * sq, v = -x * sq + y * cq, u2 = u - t * v; x = u2 * cq - v * sq; y = u2 * sq + v * cq; } return [x / nzv(k), y / nzv(k)]; };
  return {
    map: (x, y) => { const p = fwd((x - ax) * fx, (y - ay) * fy); return [ox + p[0], oy + p[1]]; },
    fwd, inv, ox, oy, fx, fy, ax, ay,
    toLocal: (cx, cy) => { const q2 = inv(cx - ox, cy - oy); return [q2[0] / nzv(fx) + ax, q2[1] / nzv(fy) + ay]; },
  };
}
function compMapper(s) { return shapeXf(s).map; }
// the path's own box (local units, before W / H / scale / rotation)
function localBBox(pts, closed) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const n = pts ? pts.length : 0;
  const add = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
  if (!n) return [0, 0, 0, 0];
  for (const a of pts) add(a.x, a.y);
  const sc = n < 2 ? 0 : (closed !== false ? n : n - 1);
  for (let i = 0; i < sc; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    for (let k = 1; k < 12; k++) { const t = k / 12, u = 1 - t; add(u * u * u * a.x + 3 * u * u * t * (a.x + a.ox) + 3 * u * t * t * (b.x + b.ix) + t * t * t * b.x, u * u * u * a.y + 3 * u * u * t * (a.y + a.oy) + 3 * u * t * t * (b.y + b.iy) + t * t * t * b.y); }
  }
  return [x0, y0, x1, y1];
}
function dStr(pts, closed, M) {
  if (!pts || !pts.length) return '';
  const P = (x, y) => { const q = M(x, y); return q[0].toFixed(2) + ' ' + q[1].toFixed(2); };
  let d = 'M' + P(pts[0].x, pts[0].y);
  const n = pts.length, m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) { const a = pts[i], b = pts[(i + 1) % n]; d += 'C' + P(a.x + a.ox, a.y + a.oy) + ' ' + P(b.x + b.ix, b.y + b.iy) + ' ' + P(b.x, b.y); }
  return closed ? d + 'Z' : d;
}

// ---------- r6 (razorsensation2): comps. A project can stack whole comps (each its own shapes, bands, strokes, Colorama) on one
// canvas: the first is the document itself, the others live in its 'stack' ({ id, name, on, op, blend, doc }), drawn over it in order
// (02-gl render). D is the comp being edited; CL.i says which (0 = the first, the document itself), CL.root holds the document then.
const CL = { i: 0, root: null };
const rootDoc = () => CL.i === 0 ? D : (CL.root || D);
function relink() {   // after D is replaced (undo, a reset): the stack points at the new one
  if (CL.i === 0) return;
  const e = CL.root && CL.root.stack && CL.root.stack[CL.i - 1];
  if (e) { e.doc = D; D.comp = CL.root.comp; } else { CL.i = 0; CL.root = null; }
}
// every comp to draw, bottom first: [{ id, doc, op, blend }] (the one being edited is D)
function compList() {
  const r = rootDoc(), lv = x => x._live || {}, out = [{ id: 'root', doc: r, op: lv(r).op ?? 1, blend: 'normal', g: 'main', pt: lv(r).pt, pu: lv(r).pu }];   // ds (2026-11-03): _live = the page's (player comp()); g = its group (patch 9)
  for (const e of r.stack || []) if (e.on !== false) out.push({ id: e.id, doc: e.doc, op: e.op * (lv(e).op ?? 1), blend: e.blend, t: lv(e).t, al: lv(e).al, g: e.grp || 'main', pt: lv(e).pt, pu: lv(e).pu });
  return out;
}

// ---------- undo / redo (whole-document snapshots after each finished edit) ----------
// 2026-10-23: each history belongs to one comp (H.comp: 'root' or a stack id). Leaving a tab while in another comp kept that comp's history as
// the tab's; back on the tab (its first comp), ⌘Z restored the other comp's snapshot over the first: "Dark · Thinking" and "light llm" lost
// their thinking that way (the first comp = an older copy of Comp 3, its stack kept). Now a history is only ever restored into its own comp.
const H = { stack: [], i: -1, comp: 'root' };
const histComp = () => typeof compKey === 'function' ? compKey(CL.i) : 'root';
function snap() { const t = D.tl.t, pl = D.tl.play, st = D.stack; D.tl.t = 0; D.tl.play = false; if (st) delete D.stack; const s = JSON.stringify(D); if (st) D.stack = st; D.tl.t = t; D.tl.play = pl; return s; }   // (r6: one comp's history: the others are not in it)
function histPush() { if (H.comp !== histComp()) { H.stack = []; H.i = -1; H.comp = histComp(); } const s = snap(); if (H.stack[H.i] === s) return; H.stack.length = H.i + 1; H.stack.push(s); if (H.stack.length > 150) H.stack.shift(); H.i = H.stack.length - 1; }
function restoreSnap(s) {
  const t = D.tl.t, pl = D.tl.play, page = D.ui.page, tour = D.ui.tour, view = D.view;   // view settings (lines, snapping, mode) are not undone
  const st = D.stack;
  D = normalize(JSON.parse(s)); D.tl.t = clamp(t, 0, D.tl.dur); D.tl.play = pl; D.ui.page = page; D.ui.tour = tour; D.view = view;
  if (st) D.stack = st; relink();   // r6
  keySel.clear(); draw = null; afterDocChange();
}
function histGuard() { if (H.comp === histComp()) return true; H.stack = []; H.i = -1; H.comp = histComp(); histPush(); return false; }   // (another comp's: never restored here)
function undo() { if (!histGuard() || H.i <= 0) return; H.i--; restoreSnap(H.stack[H.i]); }
function redo() { if (!histGuard() || H.i >= H.stack.length - 1) return; H.i++; restoreSnap(H.stack[H.i]); }

// ---------- saving: settings/<name>.json through serve.py, and this browser as a backup ----------
function store(name) { return { name, ls: 'rzs2:' + name, savedAt: 0, timer: 0, pending: false, ok: null }; }
let SD = store(NAME);   // the open project's document (10-projects.js switches it)
const SP = store(PNAME), SPJ = store(PJPRE + 'projects');   // the presets; the project tabs (10-projects.js)
const docValues = () => ({ doc: rootDoc() }), preValues = () => ({ presets: PR });   // r6: the whole stack of comps
// r27: player mode (razorsensation.html?player=<project id or name>[&ui=0][&loop=1][&wait=1]): one project, full window, read-only (nothing is saved), no chat; 13-player.js
const PLAYER = (() => { try { const q = new URLSearchParams(location.search); return q.has('player') ? { name: q.get('player') || '', ui: q.get('ui') !== '0', loop: q.get('loop') === '1', wait: q.get('wait') === '1' } : null; } catch (e) { return null; } })();
function saveStore(st, get) { if (PLAYER) return; st.pending = true; clearTimeout(st.timer); st.timer = setTimeout(() => saveStoreNow(st, get), 250); }
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
addEventListener('pagehide', () => { flushStore(SD, docValues); flushStore(SP, preValues); });
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
const saveDoc = () => saveStore(SD, docValues);
const savePresets = () => saveStore(SP, preValues);
function showSave() {
  const s = $('#savedot'), ok = SD.ok;
  s.className = ok ? 'ok' : 'local';
  if (STANDALONE) { s.className = 'ok'; s.title = 'Saved in this browser (a standalone copy: your changes stay on this computer, in this browser)'; return; }
  s.title = ok ? 'Saved to settings/' + NAME + '.json and ' + PNAME + '.json (serve.py), and this browser' : 'serve.py not reachable: saved in this browser only (run python3 serve.py)';
}

// ---------- presets: one list per stage, saved apart from the document so every document can use them ----------
let PR = { v: 1, shape: [], bands: [], strokes: [], color: [] };
function stageData(st, from) {
  const src = from || D, o = { p: {}, K: {} };
  for (const k of stageKeys(st)) o.p[k] = clone(src.p[k]);
  for (const k in src.K) if (keyStage(k) === st) o.K[k] = clone(src.K[k]);
  if (st === 'shape') o.shapes = clone(src.shapes);
  return o;
}
function builtins() {
  const d = defaults();
  return {
    shape: [{ id: 'b-shape', name: 'Default blob', builtin: true, data: stageData('shape', d) }],
    bands: [{ id: 'b-bands', name: 'Ray map (Figma 180-6902)', builtin: true, data: stageData('bands', d) }],
    strokes: [{ id: 'b-strokes', name: 'Soft edge strokes', builtin: true, data: stageData('strokes', d) }],
    color: [{ id: 'b-color', name: 'Ray colours (Figma 181-6913)', builtin: true, data: stageData('color', d) }],
  };
}
const BUILTIN = builtins();
const presetsOf = st => BUILTIN[st].concat(PR[st] || []);
const presetById = (st, id) => presetsOf(st).find(p => p.id === id);
function applyStageData(st, data) {
  const def = defaultP();
  for (const k of stageKeys(st)) D.p[k] = data.p && data.p[k] !== undefined ? clone(data.p[k]) : def[k];
  for (const k of Object.keys(D.K)) if (keyStage(k) === st) delete D.K[k];
  for (const k in (data.K || {})) D.K[k] = clone(data.K[k]);
  if (st === 'shape') {
    D.shapes = clone(data.shapes || []).map(normShape);
    for (const s of D.shapes) { const n = parseInt(String(s.id).slice(1), 10); if (n >= D.nid) D.nid = n + 1; }
    if (!D.shapes.some(s => s.id === D.ui.sel)) D.ui.sel = D.shapes[0] ? D.shapes[0].id : null;
    D.ui.ai = -1;
  }
  keySel.clear();
}
const presetDirty = st => {
  const p = presetById(st, D.pre[st]); if (!p) return true;
  const def = defaultP(), pd = clone(p.data); pd.p = pd.p || {};
  for (const k of stageKeys(st)) if (pd.p[k] === undefined) pd.p[k] = clone(def[k]);   // r2 (razorsensation2): values added since the preset was saved count as their defaults
  const cur = stageData(st), ord = o => { const q = {}; for (const k of stageKeys(st)) q[k] = o.p[k]; return JSON.stringify([q, o.K || {}, o.shapes || null]); };
  return ord(cur) !== ord(pd);
};

// ---------- colour ----------
const s2l = v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
const l2s = v => v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
function hex2rgb(h) { h = String(h || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h.slice(0, 6), 16) || 0; return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function rgb2hex(c) { return '#' + c.map(v => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, '0')).join(''); }
function toLab(c) {
  const r = s2l(c[0]), g = s2l(c[1]), b = s2l(c[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
function fromLab(c) {
  const l_ = c[0] + 0.3963377774 * c[1] + 0.2158037573 * c[2], m_ = c[0] - 0.1055613458 * c[1] - 0.0638541728 * c[2], s_ = c[0] - 0.0894841775 * c[1] - 1.2914855480 * c[2];
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  return [l2s(clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, 0, 1)), l2s(clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, 0, 1)), l2s(clamp(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s, 0, 1))];
}
// the colour line: LUT_N steps from the black end (0) to the white end (1); before the first stop / after the last, the end colours hold (no loop)
let lutData = new Uint8Array(LUT_N * 4);
function colorSpace(P) {
  const conv = P.cSpace === 'oklab' ? toLab : P.cSpace === 'linear' ? (c => c.map(s2l)) : (c => c);
  const back = P.cSpace === 'oklab' ? fromLab : P.cSpace === 'linear' ? (c => c.map(v => l2s(clamp(v, 0, 1)))) : (c => c);
  return [conv, back];
}
// r3: Cycle mode (AE's Colorama output cycle): the stops sit round a wheel, the stretch from the last one wraps back to the first
// 2026-10-26 (the user: "the Colorama should be two colours, one alpha (no opacity) and one colour, so it has that smooth overlay"): a stop's
// opacity (s.a, 0-1; none = 1). Between two stops of different opacity the colour blends by their weights (premultiplied, as CSS
// gradients): a colour fading to a clear stop stays that colour instead of greying through the clear one's. The line's alpha (stopAlpha)
// goes into the LUT's 4th channel; the renderer: in a comp over others (Empty pixels: Show the background) a clear stop is see-through,
// else it shows the background colour.
const aOf = s => s && s.a != null && isFinite(+s.a) ? clamp(+s.a, 0, 1) : 1;
const uPre = (A, B, u) => { const a = aOf(A), b = aOf(B); if (a === b) return u; const wa = a * (1 - u), wb = b * u; return wa + wb > 1e-6 ? wb / (wa + wb) : u; };
function stopAlpha(st, cyc, interp, x) {   // st sorted by place, each with .a; the line's opacity at x (placed as the colours are)
  const n = st.length; if (!n) return 1; if (n === 1) return aOf(st[0]);
  if (cyc) {
    x = ((x % 1) + 1) % 1; let i = -1; for (let k = 0; k < n; k++) if (st[k].p <= x) i = k;
    const ia = i < 0 ? n - 1 : i, ib = (ia + 1) % n, pa = i < 0 ? st[n - 1].p - 1 : st[ia].p, pb = ib === 0 && i >= 0 ? st[0].p + 1 : st[ib].p;
    if (!interp) return aOf(st[ia]); const u = pb > pa ? clamp((x - pa) / (pb - pa), 0, 1) : 0; return aOf(st[ia]) + (aOf(st[ib]) - aOf(st[ia])) * u;
  }
  if (x <= st[0].p) return aOf(st[0]); if (x >= st[n - 1].p) return aOf(st[n - 1]);
  let i = 0; for (let k = 0; k < n - 1; k++) if (st[k].p <= x) i = k;
  if (!interp) return aOf(st[i]); const a = st[i].p, b = st[i + 1].p, u = b > a ? clamp((x - a) / (b - a), 0, 1) : 0;
  return aOf(st[i]) + (aOf(st[i + 1]) - aOf(st[i])) * u;
}
function cycleColor(st, L, back, interp, x) {
  const n = st.length; if (n === 1) return st[0].c;
  x = ((x % 1) + 1) % 1;
  let i = -1; for (let k = 0; k < n; k++) if (st[k].p <= x) i = k;
  const ia = i < 0 ? n - 1 : i, ib = (ia + 1) % n, pa = i < 0 ? st[n - 1].p - 1 : st[ia].p, pb = ib === 0 && i >= 0 ? st[0].p + 1 : st[ib].p;   // below the first stop: from the last one (a turn back) to the first
  if (!interp) return st[ia].c;
  const u = uPre(st[ia], st[ib], pb > pa ? clamp((x - pa) / (pb - pa), 0, 1) : 0);
  return back(L[ia].map((v, q) => v + (L[ib][q] - v) * u));
}
function lineColor(st, L, back, interp, x) {
  const n = st.length;
  if (n === 1 || x <= st[0].p) return st[0].c;
  if (x >= st[n - 1].p) return st[n - 1].c;
  let i = 0; for (let k = 0; k < n - 1; k++) if (st[k].p <= x) i = k;
  if (!interp) return st[i].c;
  const a = st[i].p, b = st[i + 1].p, u = uPre(st[i], st[i + 1], b > a ? clamp((x - a) / (b - a), 0, 1) : 0);
  return back(L[i].map((v, q) => v + (L[i + 1][q] - v) * u));
}
function bakeLut(P) {
  const st = P.stops.map(s => ({ p: clamp(+s.p || 0, 0, 1), c: stopRGB(s, P.cMode === 'cycle'), a: aOf(s) })).sort((a, b) => a.p - b.p), [conv, back] = colorSpace(P);
  const L = st.map(s => conv(s.c)), out = new Uint8Array(LUT_N * 4), hi = new Float32Array(LUT_N * 4);
  const cyc = P.cMode === 'cycle', lin = [], al = []; for (let j = 0; j < LUT_N; j++) { lin.push((cyc ? cycleColor : lineColor)(st, L, back, P.cInterp, j / (LUT_N - 1))); al.push(stopAlpha(st, cyc, P.cInterp, j / (LUT_N - 1))); }
  let alpha = al;
  // r2 (razorsensation2): Line smoothing = a Gaussian along the line (sigma = cSmooth of its length), in the blend space; the ends hold
  const sg = Math.max(0, +P.cSmooth || 0) * (LUT_N - 1);
  let line = lin;
  if (sg > 0.5 && P.cInterp !== false) {
    const sp = lin.map(c => conv(c)), R = Math.ceil(sg * 3), w = []; let ws = 0;
    for (let k = -R; k <= R; k++) { const v = Math.exp(-0.5 * (k / sg) ** 2); w.push(v); ws += v; }
    if (al.some(v => v < 1)) alpha = al.map((_, j) => { let a = 0; for (let k = -R; k <= R; k++) a += al[cyc ? (((j + k) % (LUT_N - 1)) + LUT_N - 1) % (LUT_N - 1) : clamp(j + k, 0, LUT_N - 1)] * w[k + R] / ws; return a; });
    line = sp.map((_, j) => { const a = [0, 0, 0]; for (let k = -R; k <= R; k++) { const c = sp[cyc ? (((j + k) % (LUT_N - 1)) + LUT_N - 1) % (LUT_N - 1) : clamp(j + k, 0, LUT_N - 1)], q = w[k + R] / ws; a[0] += c[0] * q; a[1] += c[1] * q; a[2] += c[2] * q; } return back(a); });   // a cycle blurs round the wrap
  }
  for (let j = 0; j < LUT_N; j++) {
    const c = line[j];
    for (let q = 0; q < 3; q++) { const v = clamp(c[q], 0, 1); out[j * 4 + q] = Math.round(v * 255); hi[j * 4 + q] = v; }
    const a = clamp(alpha[j], 0, 1); out[j * 4 + 3] = Math.round(a * 255); hi[j * 4 + 3] = a;
  }
  lutData = out; lutHi = hi; return out;
}
let lutHi = null;   // the same line as floats (uploaded as a 16-bit texture when "High precision line" is on)
const lutAt = p => { const j = Math.round(clamp(p, 0, 1) * (LUT_N - 1)); return [lutData[j * 4] / 255, lutData[j * 4 + 1] / 255, lutData[j * 4 + 2] / 255]; };
const lutAAt = p => lutData[Math.round(clamp(p, 0, 1) * (LUT_N - 1)) * 4 + 3] / 255;   // the line's opacity there

// r15: up to r14 the Colorama was AE's wheel (a loop: phase = brightness x repetitions + shift, wrapping round).
// wheelToLine lays the stretch of the wheel the brightness actually covered (shift .. shift + repetitions) out as a line
// from 0 to 1 — the stops inside it (every lap) plus the colours at its two ends — so a doc looks the same; then stretch 1, offset 0.
// With the repetitions / shift keyed (or too many laps for 16 stops) it keeps the stops and turns the shift into the offset instead.
function wheelToLine(p, K) {
  const rep = Math.max(0.01, +p.cRep || 1), a = (+p.cShift || 0) / 360, b = a + rep;
  const keyed = K && ((K.cShift && K.cShift.length) || (K.cRep && K.cRep.length));
  const st = (Array.isArray(p.stops) && p.stops.length ? p.stops : RAY_WHEEL.map(([q, c]) => ({ p: q, c }))).map(s => ({ p: ((+s.p || 0) % 1 + 1) % 1, c: rgb2hex(hex2rgb(s.c)) })).sort((x, y) => x.p - y.p);
  const out = [];
  for (let k = Math.floor(a) - 1; k <= Math.ceil(b) + 1; k++) for (const s of st) { const ph = s.p + k; if (ph > a + 1e-4 && ph < b - 1e-4) out.push({ p: roundTo((ph - a) / rep, 4), c: s.c }); }
  if (!keyed && out.length + 2 <= 16) {
    const [conv, back] = colorSpace(p), W = st.map(s => ({ p: s.p, c: hex2rgb(s.c) })), n = W.length;
    const wheelAt = ph => {   // the old wheel's colour at a phase
      const x = ((ph % 1) + 1) % 1; if (n === 1) return W[0].c;
      let i = -1; for (let k = 0; k < n; k++) if (W[k].p <= x) i = k;
      const [ia, ib, pa, pb] = i === -1 ? [n - 1, 0, W[n - 1].p - 1, W[0].p] : i === n - 1 ? [n - 1, 0, W[n - 1].p, W[0].p + 1] : [i, i + 1, W[i].p, W[i + 1].p];
      if (!p.cInterp) return W[ia].c;
      const u = pb > pa ? clamp((x - pa) / (pb - pa), 0, 1) : 0, A = conv(W[ia].c), B = conv(W[ib].c);
      return back(A.map((v, q) => v + (B[q] - v) * u));
    };
    if (!out.length || out[0].p > 1e-3) out.unshift({ p: 0, c: rgb2hex(wheelAt(a)) });
    if (out[out.length - 1].p < 1 - 1e-3) out.push({ p: 1, c: rgb2hex(wheelAt(b - 1e-9)) });
    p.stops = out; p.cRep = 1; p.cShift = 0;
  } else {   // keep the stops; the shift (degrees, wrapping) -> an offset along the line, moved by whole turns so the brightness stays on it as much as it can
    const k = Math.round(a + rep / 2 - 0.5);
    p.stops = st; p.cShift = roundTo(a - k, 4);
    if (K && Array.isArray(K.cShift)) for (const key of K.cShift) key.v = roundTo(key.v / 360 - k, 4);
  }
  if (K) delete K.cDrift; delete p.cDrift; p.cLine = true;
}
// colour presets saved before r15 hold wheels: the same conversion
function presetsToLine(pr) { for (const x of (pr && pr.color) || []) if (x && x.data && x.data.p && x.data.p.cLine === undefined) wheelToLine(x.data.p, x.data.K); }

// ---------- band pattern (shared by the shader uniforms, the pattern preview and the strokes) ----------
function patternInfo(P) {
  const pat = (P.pattern || RAY_PATTERN).slice(0, MAXB), sc = Math.max(0.01, P.bScale || 1), g = 1;   // ramps are straight (no curve)
  const cum = [0], ints = [0], W = [], R = [], LO = [], HI = [], PL = [];
  for (const b of pat) {
    const w = Math.max(0.5, (+b.w || 1) * sc), r = clamp((+b.r || 0) * sc, 0.0001, w), lo = +b.lo || 0, hi = b.hi == null ? 1 : +b.hi, pl = b.pl == null ? 1 : +b.pl;
    W.push(w); R.push(r); LO.push(lo); HI.push(hi); PL.push(pl);
    cum.push(cum[cum.length - 1] + w);
    ints.push(ints[ints.length - 1] + r * (lo + (hi - lo) / (g + 1)) + (w - r) * pl);
  }
  const per = cum[cum.length - 1], tot = ints[ints.length - 1];
  let mean = tot / per; if (P.bInv) mean = 1 - mean; mean = (P.bLo ?? 0) + ((P.bHi ?? 1) - (P.bLo ?? 0)) * mean;   // the map's average grey (after invert and levels)
  mean = fxMean(mean, P);   // and the look effects
  return { n: pat.length, cum, ints, W, R, LO, HI, PL, per, tot, g, mean };
}
function patValue(I, u) {   // the raw pattern at u (comp px across the bands)
  const f = ((u % I.per) + I.per) % I.per; let i = 0; while (i < I.n - 1 && f >= I.cum[i + 1]) i++;
  const x = f - I.cum[i]; return x < I.R[i] ? I.LO[i] + (I.HI[i] - I.LO[i]) * Math.pow(x / I.R[i], I.g) : I.PL[i];
}
