// ds gpu raster (2026-11-03, prototype). make_loader_gpu.py puts this into a page's engine, before buildLayer.
// A solid shape is drawn on the GPU straight into its layer instead of with Canvas2D and an upload of the whole raster. Same place,
// size, colour and clip as rasterShape. Stills, videos and gradient fills keep the Canvas2D path. On with RZS_GPU.gpuRaster; ?gpu=0 turns
// it off in the same page (the before, for A / B).
//   convex outline (most of them: boxes, ellipses, the glyph piece): one pass, a fan from its middle, each triangle anti-aliased against
//     its own edge (the pixel's distance to it), straight into the layer;
//   any other outline: the winding into a multisampled stencil, then the colour where it is non-zero, resolved into the layer.
// the switches: window.RZS_GPU (make_loader_gpu.py puts it before the engine), else the page's export opts
const GR_OPT = Object.assign({}, window.RZS_EXPORT && RZS_EXPORT.opts, window.RZS_GPU);
const GPU_RASTER = !!GR_OPT.gpuRaster && !/[?&]gpu=0/.test(location.search);
// RZS_GPU.accTrim: the accumulation trimmed to what the view reads (the engine's p.accTrim, for every doc): a sharp shape no longer makes
// it the whole padded box at full resolution (the growth's 3533 x 3059 half-float, made again each frame as it grew). ?trim=0 turns it off.
const GPU_TRIM = !!GR_OPT.accTrim && !/[?&]trim=0/.test(location.search);
// RZS_GPU.scissor: each layer stacked only where it can show (its outline's box, its blur, within its matte's), not over the whole
// accumulation (FS_COMP gives 0 wherever the layer has no coverage, grain too). ?scissor=0 turns it off.
const GPU_SCISSOR = !!GR_OPT.scissor && !/[?&]scissor=0/.test(location.search);
// RZS_GPU.stableSizes: a layer whose blur moves (keyed, or Alive's blur variance) no longer gets new textures every frame: its padding
// goes up in steps of 128 comp px and its working scale in quarter octaves (its blur stays 4.2 to 5 texels), so its size changes now
// and then, not each frame (the growth made ~15 textures, 12 Mpx, a frame). ?stable=0 turns it off.
const GPU_STABLE = !!GR_OPT.stableSizes && !/[?&]stable=0/.test(location.search);
const grQf = f => GPU_STABLE && f > 1 ? Math.max(1, 2 ** (Math.floor(Math.log2(f) * 4 + 1e-9) / 4)) : f;   // down a step: a blur's working copy never coarser than exact (its sigma 5 to 5.9 texels)
const grQp = p => GPU_STABLE && p > 0 ? Math.ceil(p / 128) * 128 : p;
// the same for the shapes' pass resolution: it follows the view's zoom (the growth keys Post · Zoom 0.6 -> 1), so every layer and the
// accumulation changed size each frame; up to the next quarter octave (never coarser than the view), within the pixel budget
const grQk = k => GPU_STABLE && k > 0 ? 2 ** (Math.ceil(Math.log2(k) * 4 - 1e-9) / 4) : k;
// and a target given up (its layer changed size) waits in a small pool, taken again when that size comes back (a blur that breathes
// goes through the same few sizes). Every target is written whole or cleared before it is read, so what it held doesn't matter.
const GR_POOL_MAX = 96e6;   // bytes
function grPut(T) {
  if (!GPU_STABLE) { gl.deleteTexture(T.t); gl.deleteFramebuffer(T.f); return; }
  const P = GL.pool || (GL.pool = { list: [], bytes: 0 }); T.b = T.w * T.h * (GL.half ? 8 : 4); P.list.push(T); P.bytes += T.b;
  while (P.bytes > GR_POOL_MAX && P.list.length) { const o = P.list.shift(); P.bytes -= o.b; gl.deleteTexture(o.t); gl.deleteFramebuffer(o.f); }
}
function grTake(w, h) {
  const P = GL.pool, i = P ? P.list.findIndex(T => T.w === w && T.h === h) : -1; if (i < 0) return null;
  const T = P.list.splice(i, 1)[0]; P.bytes -= T.b; return T;
}
const GR_TILE = 1024, GR_TOL = 0.1;   // the multisampled tile's largest side; curves flattened to within this many raster px
const gpuOk = s => GPU_RASTER && !s.vsrc && !s.isrc && (s.fill || 'solid') === 'solid';
const GR_CLIP = `
uniform vec4 uCol, uClip;
uniform vec2 uOff;
uniform int uClipOn;
out vec4 o;
float clipCov(vec2 p) {   // the comp's frame (a cut shape): the pixel's share of it, as Canvas2D's clip
  return uClipOn == 1 ? clamp(min(min(p.x - uClip.x, uClip.z - p.x), min(p.y - uClip.y, uClip.w - p.y)) + 0.5, 0.0, 1.0) : 1.0;
}`;
const VS_GR = `#version 300 es
in vec2 aP;
in vec4 aE;
uniform vec2 uOff, uSize;
flat out vec4 vE;
void main() { vE = aE; gl_Position = vec4((aP - uOff) / uSize * 2.0 - 1.0, 0.0, 1.0); }`;
const FS_GR = `#version 300 es
precision highp float;${GR_CLIP}
void main() { o = uCol * clipCov(gl_FragCoord.xy + uOff); }`;
const FS_GC = `#version 300 es
precision highp float;${GR_CLIP}
flat in vec4 vE;   // this triangle's edge of the outline: a point on it, its inward unit normal
void main() { vec2 p = gl_FragCoord.xy + uOff; o = uCol * clamp(dot(p - vE.xy, vE.zw) + 0.5, 0.0, 1.0) * clipCov(p); }`;
function grProg(fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, VS_GR)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aP'); gl.bindAttribLocation(p, 1, 'aE'); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; for (const n of ['uOff', 'uSize', 'uCol', 'uClip', 'uClipOn']) u[n] = gl.getUniformLocation(p, n);
  return { p, u };
}
function grState() {   // made once per context (initGL makes a new GL, so a restored context starts over)
  if (GL.gr) return GL.gr;
  const vao = gl.createVertexArray(), buf = gl.createBuffer();   // 6 floats a vertex: x, y, then the edge (the convex pass; 0 for the stencil)
  gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 8);
  gl.bindVertexArray(GL.vao);
  const ns = Math.min(+(new URLSearchParams(location.search).get('msaa')) || 4, gl.getParameter(gl.MAX_SAMPLES));
  return (GL.gr = { fill: grProg(FS_GR), cvx: grProg(FS_GC), vao, buf, ns, bk: new Map(), rfb: gl.createFramebuffer(), pts: new Float32Array(4096), vtx: new Float32Array(8192) });
}
// a multisampled square (colour + stencil) and its resolved twin, one per size (a power of two, 64 to GR_TILE): a small shape never
// clears or stores a big one. A multisampled blit must keep its bounds (WebGL2): a tile at the layer's origin resolves straight into it,
// any other resolves in place into the twin and is copied to where it goes.
function grBucket(G, need) {
  let n = 64; while (n < need && n < GR_TILE) n *= 2;
  let K = G.bk.get(n); if (K) return K;
  const rb = (ns, fmt) => { const r = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, r); if (ns) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, ns, fmt, n, n); else gl.renderbufferStorage(gl.RENDERBUFFER, fmt, n, n); return r; };
  K = { n, fb: gl.createFramebuffer(), xfb: gl.createFramebuffer(), c: rb(G.ns, gl.RGBA8), s: rb(G.ns, gl.DEPTH24_STENCIL8), x: rb(0, gl.RGBA8) };
  gl.bindFramebuffer(gl.FRAMEBUFFER, K.fb);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, K.c); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, K.s);
  gl.bindFramebuffer(gl.FRAMEBUFFER, K.xfb); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, K.x);
  G.bk.set(n, K); return K;
}
// the outline in raster px, placed as rasterShape places it (comp -> raster: k, then the padding), each curve flattened by Wang's
// bound to within GR_TOL px. Into G.pts; returns its point count, box, and whether it is convex (turning one way, once round)
function grPath(s, L, G) {
  const X = shapeXf(s), o = X.map(0, 0), ux = X.fwd(X.fx, 0), uy = X.fwd(0, X.fy), bx = L.padX * L.kx, by = L.padY * L.ky;
  const M = (x, y) => [L.kx * (o[0] + ux[0] * x + uy[0] * y) + bx, L.ky * (o[1] + ux[1] * x + uy[1] * y) + by];
  const pts = s.pts, n = pts.length; let v = G.pts, k = 0, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const put = (x, y) => {
    if (k >= 2 && Math.abs(x - v[k - 2]) < 1e-4 && Math.abs(y - v[k - 1]) < 1e-4) return;   // (no zero-length edges)
    if (k + 2 > v.length) { const w = new Float32Array(v.length * 2); w.set(v); v = G.pts = w; }
    v[k++] = x; v[k++] = y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  };
  const q0 = M(pts[0].x, pts[0].y); put(q0[0], q0[1]);
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], P0 = M(a.x, a.y), P1 = M(a.x + (a.ox || 0), a.y + (a.oy || 0)), P2 = M(b.x + (b.ix || 0), b.y + (b.iy || 0)), P3 = M(b.x, b.y);
    const d = Math.max(Math.hypot(P0[0] - 2 * P1[0] + P2[0], P0[1] - 2 * P1[1] + P2[1]), Math.hypot(P1[0] - 2 * P2[0] + P3[0], P1[1] - 2 * P2[1] + P3[1]));
    const m = Math.max(1, Math.min(256, Math.ceil(Math.sqrt(0.75 * d / GR_TOL))));
    for (let j = 1; j <= m; j++) {
      const t = j / m, u = 1 - t, A = u * u * u, B = 3 * u * u * t, C = 3 * u * t * t, E = t * t * t;
      put(A * P0[0] + B * P1[0] + C * P2[0] + E * P3[0], A * P0[1] + B * P1[1] + C * P2[1] + E * P3[1]);
    }
  }
  if (k >= 4 && Math.abs(v[k - 2] - v[0]) < 1e-4 && Math.abs(v[k - 1] - v[1]) < 1e-4) k -= 2;   // the last point is the first again
  const N = k / 2; let sgn = 0, turn = 0, convex = N >= 3;
  for (let i = 0; i < N && convex; i++) {
    const a = i * 2, b = ((i + 1) % N) * 2, c = ((i + 2) % N) * 2, ex = v[b] - v[a], ey = v[b + 1] - v[a + 1], fx = v[c] - v[b], fy = v[c + 1] - v[b + 1];
    const cr = ex * fy - ey * fx, dt = ex * fx + ey * fy;
    if (Math.abs(cr) > 1e-9 * (Math.hypot(ex, ey) * Math.hypot(fx, fy) + 1e-12)) { const sg = Math.sign(cr); if (sgn && sg !== sgn) convex = false; sgn = sgn || sg; }
    turn += Math.atan2(cr, dt);
  }
  if (convex && Math.abs(Math.abs(turn) - 2 * Math.PI) > 0.01) convex = false;   // (a star turns one way too, but twice round)
  return { n: N, box: [x0, y0, x1, y1], convex, sgn };
}
function grTarget(R, L) {   // the layer's own raster texture: RGBA8, premultiplied, L.rw x L.rh, row 0 = the raster's top (as the upload was)
  let T = R.g;
  if (!T || T.w !== L.rw || T.h !== L.rh) {
    if (T) gl.deleteTexture(T.t);
    T = R.g = { t: newTex(), w: L.rw, h: L.rh };
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, L.rw, L.rh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, G_RFB()); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T.t, 0);
  return T;
}
const G_RFB = () => GL.gr.rfb;
function grUniforms(q, col, cut, clip, off, size) {
  gl.useProgram(q.p); const u = q.u;
  gl.uniform4f(u.uCol, col[0], col[1], col[2], col[3]); gl.uniform1i(u.uClipOn, cut ? 1 : 0); gl.uniform4f(u.uClip, clip[0], clip[1], clip[2], clip[3]);
  gl.uniform2f(u.uOff, off[0], off[1]); gl.uniform2f(u.uSize, size[0], size[1]);
}
function grUpload(G, n) {   // n vertices of 6 floats from G.vtx
  gl.bindVertexArray(G.vao); gl.bindBuffer(gl.ARRAY_BUFFER, G.buf); gl.bufferData(gl.ARRAY_BUFFER, G.vtx.subarray(0, n * 6), gl.STREAM_DRAW);
}
function grVtx(G, n) { if (G.vtx.length < n * 6) G.vtx = new Float32Array(Math.max(n * 6, G.vtx.length * 2)); return G.vtx; }
// one layer's raster on the GPU: returns its texture
function gpuRaster(s, L, R, expand) {
  const G = grState(), T = grTarget(R, L);
  const cut = !expand || s.cc, cw = D.comp.w, ch = D.comp.h;
  const clip = [L.padX * L.kx, L.padY * L.ky, (cw + L.padX) * L.kx, (ch + L.padY) * L.ky];
  const P = grPath(s, L, G), v = G.pts;
  // its colour, premultiplied, at the 8-bit level Canvas2D would have stored (lvK takes the step back out later)
  const hi = hiFill(s), a = hi ? 1 : clamp(+s.op || 0, 0, 1), g8 = Math.round(clamp(+s.lv || 0, 0, 1) * 255) / 255;
  const c = hi ? [1, 1, 1] : s.ov ? hex2rgb(s.oc) : [g8, g8, g8], col = [c[0] * a, c[1] * a, c[2] * a, a];
  gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
  if (P.n < 3) { gl.clear(gl.COLOR_BUFFER_BIT); gl.bindFramebuffer(gl.FRAMEBUFFER, null); return T.t; }
  if (P.convex) {
    // a fan from its middle, the outline pushed 1 px out (so the pixels just outside get their share); each triangle carries its edge
    let cx = 0, cy = 0; for (let i = 0; i < P.n; i++) { cx += v[i * 2]; cy += v[i * 2 + 1]; } cx /= P.n; cy /= P.n;
    const w = grVtx(G, P.n * 3), out = [];
    for (let i = 0; i < P.n; i++) {   // each point pushed out along its two edges' outward normals (mitred, at most 4 px)
      const p = (i + P.n - 1) % P.n, nx = (i + 1) % P.n;
      const n1 = grNorm(v, p, i, P.sgn), n2 = grNorm(v, i, nx, P.sgn); let mx = -(n1[0] + n2[0]), my = -(n1[1] + n2[1]); const ml = mx * mx + my * my;
      if (ml > 1e-12) { const k = Math.min(4, 2 / ml); mx *= k; my *= k; } else { mx = -n1[0]; my = -n1[1]; }
      out.push(v[i * 2] + mx, v[i * 2 + 1] + my);
    }
    let k = 0;
    for (let i = 0; i < P.n; i++) {
      const j = (i + 1) % P.n, nn = grNorm(v, i, j, P.sgn), e = [v[i * 2], v[i * 2 + 1], nn[0], nn[1]];
      for (const q of [[cx, cy], [out[i * 2], out[i * 2 + 1]], [out[j * 2], out[j * 2 + 1]]]) { w[k++] = q[0]; w[k++] = q[1]; w[k++] = e[0]; w[k++] = e[1]; w[k++] = e[2]; w[k++] = e[3]; }
    }
    grUpload(G, P.n * 3);
    gl.viewport(0, 0, L.rw, L.rh); gl.clear(gl.COLOR_BUFFER_BIT);   // the layer cleared and drawn in one go
    grUniforms(G.cvx, col, cut, clip, [0, 0], [L.rw, L.rh]);
    gl.drawArrays(gl.TRIANGLES, 0, P.n * 3);
  } else {
    const w = grVtx(G, P.n); for (let i = 0; i < P.n; i++) { w[i * 6] = v[i * 2]; w[i * 6 + 1] = v[i * 2 + 1]; w[i * 6 + 2] = w[i * 6 + 3] = w[i * 6 + 4] = w[i * 6 + 5] = 0; }
    grUpload(G, P.n);
    const small = L.rw <= GR_TILE && L.rh <= GR_TILE;   // one tile at the layer's origin: resolved straight into it, nothing to clear first
    let bx0 = 0, by0 = 0, bx1 = L.rw, by1 = L.rh;
    if (!small) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      bx0 = Math.max(0, Math.floor(P.box[0]) - 1); by0 = Math.max(0, Math.floor(P.box[1]) - 1); bx1 = Math.min(L.rw, Math.ceil(P.box[2]) + 1); by1 = Math.min(L.rh, Math.ceil(P.box[3]) + 1);
      if (cut) { bx0 = Math.max(bx0, Math.floor(clip[0])); by0 = Math.max(by0, Math.floor(clip[1])); bx1 = Math.min(bx1, Math.ceil(clip[2])); by1 = Math.min(by1, Math.ceil(clip[3])); }
    }
    gl.enable(gl.STENCIL_TEST); gl.stencilMask(0xff); gl.clearStencil(0);
    for (let ty = by0; ty < by1; ty += GR_TILE) for (let tx = bx0; tx < bx1; tx += GR_TILE) {
      const tw = Math.min(GR_TILE, bx1 - tx), th = Math.min(GR_TILE, by1 - ty), K = grBucket(G, Math.max(tw, th));
      gl.bindFramebuffer(gl.FRAMEBUFFER, K.fb); gl.viewport(0, 0, tw, th); gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      grUniforms(G.fill, col, cut, clip, [tx, ty], [tw, th]);
      gl.colorMask(false, false, false, false); gl.stencilFunc(gl.ALWAYS, 0, 0xff);   // 1: the winding into the stencil
      gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP); gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, P.n);
      gl.colorMask(true, true, true, true); gl.stencilFunc(gl.NOTEQUAL, 0, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);   // 2: the colour where it is non-zero
      gl.drawArrays(gl.TRIANGLE_FAN, 0, P.n);
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, K.fb);
      if (small) { gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, G.rfb); gl.blitFramebuffer(0, 0, tw, th, 0, 0, tw, th, gl.COLOR_BUFFER_BIT, gl.NEAREST); }
      else {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, K.xfb); gl.blitFramebuffer(0, 0, tw, th, 0, 0, tw, th, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, K.xfb); gl.bindTexture(gl.TEXTURE_2D, T.t); gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, tx, ty, 0, 0, tw, th);
      }
    }
    gl.disable(gl.STENCIL_TEST);
  }
  gl.bindVertexArray(GL.vao); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return T.t;
}
// where a layer can show, comp px: its outline's box (cut at the comp's frame if it is cut there, before its blur), out by its blur
// (3 sigma, as far as blurPass reaches) and a few of its raster texels (bilinear, the B-spline read). A still or a video is drawn in
// that box too (clipped to the outline, or the box itself; a still's 1 px border is one raster texel, inside the margin). null = off
function grBox(s, sH, sV, kx, ky, xp) {
  if (!(GPU_SCISSOR || GPU_BOX) || !s.pts || s.pts.length < 2) return null;
  const B = localBBox(s.pts, true), X = shapeXf(s); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const q of [[B[0], B[1]], [B[2], B[1]], [B[0], B[3]], [B[2], B[3]]]) { const p = X.map(q[0], q[1]); x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  if (!xp || s.cc) { x0 = Math.max(x0, 0); y0 = Math.max(y0, 0); x1 = Math.min(x1, D.comp.w); y1 = Math.min(y1, D.comp.h); }
  const mx = 3 * sH + 4 / kx + 2, my = 3 * sV + 4 / ky + 2;
  return [x0 - mx, y0 - my, x1 + mx, y1 + my];
}
// the stack's scissor for one layer (ML: its matte's layer): its box, within its matte's unless the matte is inverted. Not for the
// AE grain program or an intersect (that one clears what it doesn't cover)
function grScissor(s, L, ML, ag, rect, aw, ah) {
  let b = L.cb;
  if (!b || ag || s.blend === 'intersect') { gl.disable(gl.SCISSOR_TEST); return; }
  if (ML && ML.cb && s.mmode !== 'alphaInv' && s.mmode !== 'lumaInv') b = [Math.max(b[0], ML.cb[0]), Math.max(b[1], ML.cb[1]), Math.min(b[2], ML.cb[2]), Math.min(b[3], ML.cb[3])];
  const x0 = Math.max(0, Math.floor((b[0] - rect[0]) / rect[2] * aw)), x1 = Math.min(aw, Math.ceil((b[2] - rect[0]) / rect[2] * aw));
  const y0 = Math.max(0, Math.floor((b[1] - rect[1]) / rect[3] * ah)), y1 = Math.min(ah, Math.ceil((b[3] - rect[1]) / rect[3] * ah));
  gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0));
}
function grNorm(v, i, j, sgn) {   // the inward unit normal of the edge i -> j (sgn: which way the outline turns)
  const ex = v[j * 2] - v[i * 2], ey = v[j * 2 + 1] - v[i * 2 + 1], l = Math.hypot(ex, ey) || 1;
  return [-ey / l * sgn, ex / l * sgn];
}
// RZS_GPU.box: the main pass (bands, Colorama: the costly one) only over where the shapes are (their boxes, out by the bands' reach);
// the rest of the canvas gets what that pass gives where there is nothing: on a clear picture that is transparent (a clear, and the
// layer laid on the page over the box only); otherwise the pass is run for one pixel, at a comp point away from the shapes, and that
// pixel is spread (cheaply) over the canvas first. So it follows a keyed Colorama line as the full pass would. Off where
// something can show away from the shapes (inverted strokes or Colorama mask, strokes that start below zero coverage, map warps), off in
// the studio's other views. ?box=0 turns it off.
const GPU_BOX = !!GR_OPT.box && !/[?&]box=0/.test(location.search);
// the box (comp px) everything that shows is inside of: each drawn layer's, within its matte's (unless that is inverted; a matte alone
// shows nothing), and the strokes' mask shape's; null = not known (a still or a video with no matte around it)
function grUnion(lays, list, matteOf, smask) {
  let b = null; const add = c => { b = b ? [Math.min(b[0], c[0]), Math.min(b[1], c[1]), Math.max(b[2], c[2]), Math.max(b[3], c[3])] : c.slice(); };
  for (const s of list) {
    const L = lays.get(s.id); if (!L) continue;
    let c = L.cb; const m = s.blend === 'clip' ? null : matteOf(s), M = m && lays.get(m.id);
    if (M && M.cb && s.mmode !== 'alphaInv' && s.mmode !== 'lumaInv') c = c ? [Math.max(c[0], M.cb[0]), Math.max(c[1], M.cb[1]), Math.min(c[2], M.cb[2]), Math.min(c[3], M.cb[3])] : M.cb;
    if (!c) { GR_STAT.unknown = s.id; return null; }
    if (c[2] > c[0] && c[3] > c[1]) add(c);
    if (GR_STAT.trace) GR_STAT.trace.push([s.id, M ? m.id : '', c.map(Math.round)]);
  }
  if (smask && !smask.empty) { if (!smask.cb) { GR_STAT.unknown = 'strokes mask'; return null; } add(smask.cb); if (GR_STAT.trace) GR_STAT.trace.push(['strokes mask', '', smask.cb.map(Math.round)]); }
  return b || [0, 0, 0, 0];   // (nothing drawn: nothing anywhere)
}
const FS_FILL = `#version 300 es
precision highp float;
uniform sampler2D uE;
uniform vec2 uView, uOrig, uComp;
uniform float uZ;
uniform int uAlphaOut;
uniform vec3 uPaste;
out vec4 o;
void main() {   // as FS_MAIN: the paste colour outside the comp, else the empty pixel's colour
  vec2 dp = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y), c = (dp - uOrig) / uZ;
  if (c.x < 0.0 || c.y < 0.0 || c.x > uComp.x || c.y > uComp.y) { o = uAlphaOut == 1 ? vec4(0.0) : vec4(uPaste, 1.0); return; }
  o = texelFetch(uE, ivec2(0), 0);
}`;
// the main pass's draw (renderComp has set everything up for a full-canvas draw; ox / oy: its uOrig)
function grMain(pr, src, P, k0, ox, oy, dest, alphaOut, paste) {
  const W = cv.width, H = cv.height, cw = D.comp.w, ch = D.comp.h, full = () => gl.drawArrays(gl.TRIANGLES, 0, 3);
  let b = src.cbox; const cm = src.cmask;
  if (b && cm && !cm.empty && cm.cb && !P.cMaskInv && !src.freeTex) b = [Math.max(b[0], cm.cb[0]), Math.max(b[1], cm.cb[1]), Math.min(b[2], cm.cb[2]), Math.min(b[3], cm.cb[3])];
  GR_LAY = null;
  const why = !GPU_BOX ? 'off' : !b ? 'no box' : D.view.mode !== 'final' ? 'view' : P.cMaskInv ? 'cmask inverted' : (P.fx || []).some(f => f && f.on) ? 'warps' : (D.en.strokes && (P.sInv || +P.sChoke - 0.5 * (+P.sSoft || 0) <= 0)) ? 'strokes' : (P.rOn && P.rLightShape === false) ? 'glass light' : '';
  if (why) { GR_STAT[why] = (GR_STAT[why] || 0) + 1; return full(); }
  const reach = (!D.en.bands ? 0 : P.rOn ? refrReach(P) : Math.hypot(+P.dMaxH || 0, +P.dMaxV || 0)) + 16 / k0 + 16;
  const c0x = b[0] - reach, c0y = b[1] - reach, c1x = b[2] + reach, c1y = b[3] + reach;
  const x0 = Math.max(0, Math.floor(c0x * k0 + ox)), x1 = Math.min(W, Math.ceil(c1x * k0 + ox));   // the box on the canvas (GL's y is up)
  const y0 = Math.max(0, Math.floor(H - (c1y * k0 + oy))), y1 = Math.min(H, Math.ceil(H - (c0y * k0 + oy)));
  if (Math.max(0, x1 - x0) * Math.max(0, y1 - y0) > 0.85 * W * H) { GR_STAT.big = (GR_STAT.big || 0) + 1; GR_STAT.lastBox = [x0, y0, x1, y1, W, H]; return full(); }   // (the shapes are most of it: nothing to gain)
  if (alphaOut && P.cOut !== 'opaque') {
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0)); full(); gl.disable(gl.SCISSOR_TEST);
    if (dest) GR_LAY = { T: dest, box: [x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0)] };
    GR_STAT.clear = (GR_STAT.clear || 0) + 1;
    return;
  }
  const p = [[1, 1], [cw - 1, 1], [1, ch - 1], [cw - 1, ch - 1], [cw / 2, 1], [cw / 2, ch - 1], [1, ch / 2], [cw - 1, ch / 2]].find(q => q[0] < c0x || q[0] > c1x || q[1] < c0y || q[1] > c1y);
  if (!p) return full();
  if (!GL.grE) { gl.activeTexture(gl.TEXTURE10); GL.grE = makeTarget(1, 1); gl.activeTexture(gl.TEXTURE0); }   // (made on its own unit: unit 0 holds the pass's source)
  const E = GL.grE;   // 1: the pass for that one point (its uOrig moved so pixel 0 is p)
  gl.bindFramebuffer(gl.FRAMEBUFFER, E.f); gl.viewport(0, 0, 1, 1);
  gl.uniform2f(pr.u.uOrig, 0.5 - p[0] * k0, H - 0.5 - p[1] * k0); full(); gl.uniform2f(pr.u.uOrig, ox, oy);
  const F = GL.pFill || (GL.pFill = program(FS_FILL));   // 2: the canvas from it
  gl.bindFramebuffer(gl.FRAMEBUFFER, dest ? dest.f : null); gl.viewport(0, 0, W, H); gl.useProgram(F.p);
  gl.activeTexture(gl.TEXTURE10); gl.bindTexture(gl.TEXTURE_2D, E.t); UI(F, 'uE', 10); gl.activeTexture(gl.TEXTURE0);
  U2(F, 'uView', W, H); U2(F, 'uOrig', ox, oy); U2(F, 'uComp', cw, ch); U1(F, 'uZ', k0); UI(F, 'uAlphaOut', alphaOut ? 1 : 0); U3(F, 'uPaste', paste);
  full();
  gl.useProgram(pr.p); gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0)); full(); gl.disable(gl.SCISSOR_TEST);   // 3: the costly pass, the box only
  GR_STAT.box++;
}
const GR_STAT = window.__GR_STAT = { box: 0 };
let GR_LAY = null;   // the box (canvas px) the last clear-picture pass drew in, for the layer laid from that target next (layOver)
let GR_ACC = null;   // a group's buffer (render(): two or more comps of a page stacked in it): the union of the boxes laid in it (null: all of it)
const grJoin = (a, b) => {   // two scissor boxes [x, y, w, h] -> the one round both (an empty one adds nothing)
  if (!(a[2] > 0 && a[3] > 0)) return b.slice(); if (!(b[2] > 0 && b[3] > 0)) return a.slice();
  const x0 = Math.min(a[0], b[0]), y0 = Math.min(a[1], b[1]), x1 = Math.max(a[0] + a[2], b[0] + b[2]), y1 = Math.max(a[1] + a[3], b[1] + b[3]);
  return [x0, y0, x1 - x0, y1 - y0];
};   // how often the box was used, and why not (a page's console can read it)
// RZS_GPU.spec: the main pass from a copy of FS_MAIN with its switches (the int uniforms: bands, refraction, strokes, overlays, masks,
// view mode, ...) written in as the constants they are this frame, so the compiler drops what the comp doesn't use. renderComp sets
// its uniforms on the general program as before (recorded); the copy for that set of switches gets the same values and draws. A new
// set compiles in the background (KHR_parallel_shader_compile): the general program draws until it is ready, so nothing waits on it.
// ?spec=0 turns it off.
const GPU_SPEC = !!GR_OPT.spec && !/[?&]spec=0/.test(location.search);
const GR_UNI = ['uniform1f', 'uniform2f', 'uniform3f', 'uniform4f', 'uniform1i', 'uniform2i', 'uniform1fv', 'uniform2fv', 'uniform3fv', 'uniform4fv', 'uniform1iv'];
const GR_REC = { on: false, calls: [], gl: null };
function grRecStart() {
  if (!GPU_SPEC) return;
  if (GR_REC.gl !== gl) {   // the recording wrappers, once per context
    GR_REC.gl = gl;
    for (const n of GR_UNI) { const f = gl[n].bind(gl); gl[n] = (L, ...a) => { if (GR_REC.on) GR_REC.calls.push([n, L, a]); return f(L, ...a); }; }
  }
  GR_REC.calls.length = 0; GR_REC.on = true;
}
function grSpec(pr) {   // -> the program to draw the main pass with (pr itself until the copy for these switches is ready)
  if (!GPU_SPEC) return pr;
  GR_REC.on = false;
  const S = GL.spec || (GL.spec = { names: new Map(Object.entries(pr.u).map(([k, v]) => [v, k])), progs: new Map(), ext: gl.getExtension('KHR_parallel_shader_compile') });
  const ints = {};
  for (const [n, L, a] of GR_REC.calls) { const k = S.names.get(L); if (k && (n === 'uniform1i' || n === 'uniform2i') ) ints[k] = a; }
  const sw = Object.keys(ints).filter(k => GR_SW.test(k)).sort(), sig = sw.map(k => k + '=' + ints[k].join(',')).join(';');
  let Q = S.progs.get(sig);
  if (!Q) {
    let src = FS_MAIN;
    for (const k of sw) { const v = ints[k]; src = src.replace(new RegExp('^uniform (int|ivec2) ' + k + ';', 'm'), v.length > 1 ? `const ivec2 ${k} = ivec2(${v[0] | 0}, ${v[1] | 0});` : `const int ${k} = ${v[0] | 0};`); }
    const p = gl.createProgram(), vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, VS); gl.shaderSource(fs, src); gl.compileShader(vs); gl.compileShader(fs); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    Q = { p, vs, fs, ready: false, bad: false }; S.progs.set(sig, Q); GR_STAT.compiles = (GR_STAT.compiles || 0) + 1;
  }
  if (!Q.ready && !Q.bad) {
    if (S.ext && !gl.getProgramParameter(Q.p, S.ext.COMPLETION_STATUS_KHR)) { GR_STAT.waits = (GR_STAT.waits || 0) + 1; return pr; }
    if (!gl.getProgramParameter(Q.p, gl.LINK_STATUS)) { Q.bad = true; console.warn('spec main pass:', gl.getShaderInfoLog(Q.fs) || gl.getProgramInfoLog(Q.p)); return pr; }
    Q.u = {}; const n = gl.getProgramParameter(Q.p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(Q.p, i); Q.u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(Q.p, info.name); }
    Q.ready = true;
  }
  if (Q.bad) return pr;
  gl.useProgram(Q.p);   // the same values, by name (the switches are constants in it now)
  for (const [n, L, a] of GR_REC.calls) { const k = S.names.get(L), M = k && Q.u[k]; if (M) gl[n](M, ...a); }
  GR_STAT.spec = (GR_STAT.spec || 0) + 1;
  return Q;
}
const GR_SW = /^u(ClipOn|NBOn|OVOn|SOOn|SOBlend|SOL|Cycle|CMOn|FreeOn|CMInv|Cubic|PN|BInv|FxN|Beh|MBox|DClip|Bands|ChH|ChV|Wrap|Space|ROn|RProf|RLightShape|After|Strokes|SSide|SBlend|SFollow|SInv|SMaskOn|SMFeather|Color|From|Out|Mode|Straight|AlphaOut)$/;
