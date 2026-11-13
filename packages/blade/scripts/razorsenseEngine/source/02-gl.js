// ============================================================================================
// 02-gl: the renderer. Shape layer (Canvas2D raster, only when it changes) -> separable Gaussian (H and V apart, at a
// reduced size, half-float) -> one full-viewport pass: band map, displacement, edge strokes, Colorama.
// Speed tricks from razorsense-engine: WebGL2 low-power, no preserved buffer, DPR cap, fps cap, draws only on change.
// ============================================================================================
const VS = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

const FS_BLUR = `#version 300 es
precision highp float;
uniform sampler2D uT;
uniform vec2 uTexel;
uniform vec2 uDir;
uniform float uOff[24];
uniform float uW[24];
uniform int uN;
out vec4 o;
vec4 S(vec2 uv) { return (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) ? vec4(0.0) : textureLod(uT, uv, 0.0); }
void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec4 a = S(uv) * uW[0];
  for (int i = 1; i < 24; i++) { if (i >= uN) break; vec2 d = uDir * uOff[i] * uTexel; a += (S(uv + d) + S(uv - d)) * uW[i]; }
  o = a;
}`;

// stacks one shape's blurred texture into the accumulation (B-spline when it is coarser), times its track matte if it has one
const FS_COMP = `#version 300 es
precision highp float;
uniform sampler2D uT;
uniform vec4 uSrc;
uniform vec2 uSrcSize;
uniform int uCubic;
uniform sampler2D uM;
uniform int uMat;
uniform vec4 uMSrc;
uniform vec2 uMSize;
uniform int uMCubic;
uniform vec4 uDst;
uniform vec2 uDstSize;
// r3 (razorsensation2): grain = AE's Noise Alpha (uniform random, Original Alpha: 1 add 2 clamp 3 scale 4 edges); a layer's own colour cycle
uniform float uGAmt;
uniform int uGMode;
uniform float uGSeed;
uniform float uGOp;
uniform int uLineOn;
uniform sampler2D uLine;
uniform float uLRep;
uniform float uLPh;
uniform int uLCyc;
uniform float uLvK;   // r4 (lvHi): the shape's level / its 8-bit raster level (1 = as rastered)
uniform float uLPost;   // r3+: AE's Interpolate Palette off: the phase in this many steps (256); 0 = smooth
// r3: sHiP (exact fills): a solid shape is rastered as white coverage and its colour and opacity are applied here, in float (an
// 8-bit canvas stepped a fade or a keyed grey 1/255 at a time); the same for its track matte
uniform int uFillOn;
uniform vec4 uFill;
uniform int uMFillOn;
uniform vec4 uMFill;
out vec4 o;
uint ghash(uvec3 v) { v = v * 1664525u + 1013904223u; v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y; v ^= v >> 16u; v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y; return v.x; }
float grnd(ivec2 p, float s) { return float(ghash(uvec3(uvec2(p), uint(s))) >> 8) * (1.0 / 16777216.0); }
vec4 bsp(sampler2D t, vec2 uv, vec2 sz) {
  vec2 st = uv * sz - 0.5, i = floor(st), f = st - i, f2 = f * f, f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0, w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0, w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0, w3 = f3 / 6.0;
  vec2 g0 = w0 + w1, g1 = w2 + w3, t0 = (i - 0.5 + w1 / g0) / sz, t1 = (i + 1.5 + w3 / g1) / sz;
  return g0.y * (g0.x * textureLod(t, vec2(t0.x, t0.y), 0.0) + g1.x * textureLod(t, vec2(t1.x, t0.y), 0.0))
       + g1.y * (g0.x * textureLod(t, vec2(t0.x, t1.y), 0.0) + g1.x * textureLod(t, vec2(t1.x, t1.y), 0.0));
}
vec4 layer(sampler2D t, vec4 r, vec2 sz, int cub, vec2 c) {
  vec2 uv = (c - r.xy) / r.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  return cub == 1 ? bsp(t, uv, sz) : textureLod(t, uv, 0.0);
}
void main() {
  vec2 c = uDst.xy + gl_FragCoord.xy / uDstSize * uDst.zw;
  o = layer(uT, uSrc, uSrcSize, uCubic, c);
  o.rgb *= uLvK;
  if (uFillOn == 1) o = vec4(o.rgb * uFill.rgb, o.a) * uFill.a;
  if (uLineOn == 1 && o.a > 1e-5) {   // r3: the layer's brightness through its own colour cycle (AE Colorama on that layer)
    vec3 cs = clamp(o.rgb / o.a, 0.0, 1.0); float I = dot(cs, vec3(0.299, 0.587, 0.114)), y = I * uLRep + uLPh, ph = uLCyc == 1 ? fract(y) : clamp(y, 0.0, 1.0);
    if (uLPost > 0.5) ph = floor(ph * uLPost) / uLPost;
    o = vec4(textureLod(uLine, vec2((ph * ${LUT_N - 1}.0 + 0.5) / ${LUT_N}.0, 0.5), 0.0).rgb * o.a, o.a);
  }
  if (uGAmt > 0.0) {   // r3: grain on the coverage
    float op = max(uGOp, 1e-5), a = clamp(o.a / op, 0.0, 1.0), v = 2.0 * grnd(ivec2(floor(c + 65536.0)), uGSeed) - 1.0, na;   // on the coverage before the opacity (AE: effects, then opacity)
    if (uGMode == 1) na = a + v * uGAmt; else if (uGMode == 2) na = a > 0.0 ? a + v * uGAmt : 0.0; else if (uGMode == 3) na = a + v * uGAmt * a; else na = a + v * uGAmt * 4.0 * a * (1.0 - a);
    na = clamp(na, 0.0, 1.0) * op; o = o.a > 1e-6 ? vec4(o.rgb / o.a * na, na) : vec4(0.0);
  }
  if (uMat > 0) {   // 1 alpha, 2 alpha inverted, 3 luma, 4 luma inverted (the matte is premultiplied grey, so luma over black = r)
    vec4 m = layer(uM, uMSrc, uMSize, uMCubic, c);
    if (uMFillOn == 1) m = vec4(m.rgb * uMFill.rgb, m.a) * uMFill.a;
    float v = uMat <= 2 ? m.a : m.r;
    if (uMat == 2 || uMat == 4) v = 1.0 - v;
    o *= clamp(v, 0.0, 1.0);
  }
}`;

// AE Noise Alpha's grain, exactly (shapes with a grain type gnk): FS_COMP with Razorman's field in place of the r3 grain. A program of
// its own, so every other layer keeps the r3 shader bit for bit
const FS_COMP_AE = (() => {
  const a = FS_COMP.indexOf('  if (uGAmt > 0.0) {   // r3: grain on the coverage'), b = FS_COMP.indexOf('  if (uMat > 0) {'), u = 'uniform float uGOp;\n', f = 'out vec4 o;\n';
  if (a < 0 || b < a || FS_COMP.indexOf(u) < 0 || FS_COMP.indexOf(f) < 0) throw new Error('FS_COMP_AE: FS_COMP changed');
  return (FS_COMP.slice(0, a) + `  vec2 luv = (c - uSrc.xy) / uSrc.zw;
  if (uGAmt > 0.0 && luv.x >= 0.0 && luv.y >= 0.0 && luv.x <= 1.0 && luv.y <= 1.0) {   // within the layer's box (AE's buffer)
    float op = max(uGOp, 1e-5), a = clamp(o.a / op, 0.0, 1.0), na;   // on the coverage before the opacity (AE: effects, then opacity)
    if (a < uGA0) a = 0.0;   // below half of AE's alpha level (8 / 16 bpc): none (a blur's far tail gets no Clamp grain)
    vec2 fp = uDst.zw / uDstSize;   // comp px per texel
    if (fp.x <= 1.0001 && fp.y <= 1.0001) na = grainA(a, aeV(ivec2(floor(c))));   // 1:1 or finer: the comp px this texel is in (Razorman's texel index from the comp's top-left)
    else {   // coarser: the mean over the comp px it covers (up to 4 x 4), as AE's full-size render seen smaller
      ivec2 N = ivec2(clamp(ceil(fp), 1.0, 4.0)); na = 0.0;
      for (int j = 0; j < 4; j++) { if (j >= N.y) break; for (int i = 0; i < 4; i++) { if (i >= N.x) break; na += grainA(a, aeV(ivec2(floor(c + fp * ((vec2(i, j) + 0.5) / vec2(N) - 0.5))))); } }
      na /= float(N.x * N.y);
    }
    na *= op; o = vec4((o.a > 1e-6 ? o.rgb / o.a : vec3(0.0)) * na, na);   // straight colour kept (none: black, as AE's Add on clear pixels)
  }
` + FS_COMP.slice(b)).replace(u, u + `uniform int uGKind;   // Noise: 1 Uniform Random, 2 Squared Random, 4 Uniform Animation, 5 Squared Animation
uniform int uGOvf;    // Overflow: 1 Clip, 2 Wrap Back, 3 Wrap
uniform int uGSeedI;  // from Random Seed (whole degrees), 977 for the animated kinds
uniform float uGPh;   // Noise Phase in revolutions (animated kinds)
uniform int uGCyc;    // Cycle Noise: revolutions, 0 = off
uniform float uGA0;   // half of AE's alpha level (8 / 16 bpc; 0 = float)
`).replace(f, f + `// AE Noise Alpha's field, bit for bit Razorman's (fx.js hsh / rnd / field): one value per pixel p, field k, seed
uint aeHash(uvec4 v) { uint h = v.x * 0x8da6b343u ^ v.y * 0xd8163841u ^ v.z * 0xcb1ab31fu ^ v.w * 0x9e3779b9u; h ^= h >> 16; h *= 0x7feb352du; h ^= h >> 15; h *= 0x846ca68bu; h ^= h >> 16; return h; }
float aeField(ivec2 p, int k) { if (uGCyc > 0) k = ((k % uGCyc) + uGCyc) % uGCyc; return float(aeHash(uvec4(uvec3(ivec3(p, k)), uint(uGSeedI))) >> 8) * (1.0 / 16777216.0); }
// one grain value (-1..1) at comp px q (the animated kinds: fields a revolution apart, eased, contrast kept)
float aeV(ivec2 q) {
  float n;
  if (uGKind >= 4) { float k = floor(uGPh), t = uGPh - k, e = t * t * (3.0 - 2.0 * t); n = 0.5 + (mix(aeField(q, int(k)), aeField(q, int(k) + 1), e) - 0.5) / sqrt((1.0 - e) * (1.0 - e) + e * e); }
  else n = aeField(q, 0);
  float v = 2.0 * n - 1.0; return (uGKind == 2 || uGKind == 5) ? v * abs(v) : v;
}
// the new coverage: Original Alpha (1 Add, 2 Clamp, 3 Scale, 4 Edges), then Overflow
float grainA(float a, float v) {
  float na;
  if (uGMode == 1) na = a + v * uGAmt; else if (uGMode == 2) na = a > 0.0 ? a + v * uGAmt : 0.0; else if (uGMode == 3) na = a + v * uGAmt * a; else na = a + v * uGAmt * 4.0 * a * (1.0 - a);
  if (uGOvf == 2) { float w = mod(na, 2.0); na = w > 1.0 ? 2.0 - w : w; } else if (uGOvf == 3) { if (na < 0.0 || na > 1.0) na = fract(na); }
  return clamp(na, 0.0, 1.0);
}
`);
})();

const FS_MAIN = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uSrc;
uniform sampler2D uLut;
uniform sampler2D uClip;
uniform int uClipOn;
// r3: shapes that skip the bands (stacked apart, read where the pixel is), shapes over the Colorama (colour), the band overlay
uniform sampler2D uNB;
uniform int uNBOn;
uniform sampler2D uOV;
uniform int uOVOn;
uniform float uOVOp;   // r3+: the shapes over the Colorama fade together (a precomp's opacity)
uniform vec4 uOVClip;   // r3+: and show only inside this box (x, y, w, h comp px; w = 0: everywhere), a precomp's frame
uniform int uSOOn;
uniform sampler2D uSOT0;
uniform sampler2D uSOT1;
uniform vec4 uSOV0;
uniform vec4 uSOV1;
uniform vec2 uSOOff;
uniform vec2 uSOOp;
uniform ivec2 uSOBlend;
uniform ivec2 uSOL;
uniform int uCycle;
// r6: a shape masking the final colours (feathered: its outline blurred), after the clip
uniform int uCMOn;
uniform sampler2D uCM;
uniform vec4 uCMRect;
uniform float uCMOp;
uniform sampler2D uFree;   // r23: the shapes the mask feather leaves alone (not masked by its shape): their coverage
uniform int uFreeOn;
uniform int uCMInv;
uniform vec2 uView;
uniform vec2 uOrig;
uniform float uZ;
uniform vec2 uComp;
uniform vec4 uRast;
uniform vec2 uSrcSize;
uniform int uCubic;
uniform float uLbg;
uniform vec3 uPaste;
// band pattern
uniform float uPCum[9];
uniform float uPInt[9];
uniform float uPR[8];
uniform float uPLo[8];
uniform float uPHi[8];
uniform float uPPl[8];
uniform int uPN;
uniform float uPer;
uniform float uPTot;
uniform float uCenter;
uniform float uHalf;
uniform float uPix;
uniform vec2 uAcross;
uniform vec2 uAlong;
uniform float uBOff;
uniform float uBLo;
uniform float uBHi;
uniform int uBInv;
uniform vec2 uBPh;
uniform int uFxN;
uniform vec4 uFx[48];   // the effects stack: 6 vec4 each (see FX in 01-core)
uniform vec4 uMap;
uniform int uBeh;
uniform int uMBox;      // r3: the map layer ends (from AE): past uMBoxR (across lo, hi, along lo, hi; comp px from the comp centre) it is empty
uniform vec4 uMBoxR;
uniform float uMBoxE;   // half the pixel's reach across an edge (AE's rasteriser: a pixel the shape touches at all keeps its colour)
uniform int uDClip;     // r3: the displaced read stops at the comp edge (AE: an adjustment layer reads the comp, nothing past it)
// displacement
uniform int uBands;
uniform int uChH;
uniform int uChV;
uniform int uWrap;
uniform int uSpace;
uniform float uMaxH;
uniform float uMaxV;
uniform float uFlip;
// refraction (razorsensation2 r2) and the bands over the Colorama
uniform int uROn;
uniform int uRProf;
uniform int uRLightShape;
uniform int uAfter;
uniform float uBOp;   // r21: the bands' opacity (a cross-fade of the banded read with the plain one; their glass light with it)
uniform float uRDepth, uRIor, uRBulge, uRFlat, uRValley, uRShear, uRDisp, uRFrost, uREFrost, uRHi, uRHiPos, uRHiW, uREdge, uRShade, uRShW;
uniform float uInDither;
uniform float uSMOp;
// strokes
uniform int uStrokes;
uniform float uSEM[16];
uniform int uSSide;
uniform int uSBlend;
uniform int uSFollow;
uniform int uSInv;
uniform float uSW;
uniform float uSGrad;
uniform float uSOff;
uniform float uSInt;
uniform float uSChoke;
uniform float uSSoft;
uniform sampler2D uSMask;   // the strokes masked to one shape: its coverage, blurred by the inward feather
uniform int uSMaskOn;
uniform int uSMFeather;
uniform vec4 uSMRect;
// colorama
uniform int uColor;
uniform int uFrom;
uniform int uOut;
uniform float uPhase;
uniform float uRep;
uniform float uPost;   // r3+: AE's Interpolate Palette off: the cycle's phase in this many steps (256); 0 = smooth
uniform float uInLo;
uniform float uInHi;
uniform float uInGam;
uniform float uBlend;
uniform vec3 uBgCol;
uniform int uMode;
uniform float uDither;
uniform float uSeed;
uniform int uStraight;
uniform float uStraightK;   // ds (2026-10-30): the same as a blend (keyable): 0 over the layer background .. 1 straight  // r4: the Colorama reads straight colour (AE), not the shapes over the layer background
uniform int uAlphaOut;   // an exported page with a see-through background: empty pixels are clear (premultiplied out)
out vec4 o;

uint hash(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u; v ^= v >> 16u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u; v ^= v >> 16u;
  return v.x ^ v.y;
}
float rnd(vec2 p, float s) { return float(hash(uvec2(p) + uvec2(uint(s) * 7919u, uint(s) * 104729u)) & 0xffffffu) / 16777216.0; }
float h3(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y);
  float b = mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y);
  return mix(a, b, f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int k = 0; k < 4; k++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; }

// ---------- the effects (Bands page) ----------
vec3 g3(vec3 p) { return normalize(vec3(h3(p), h3(p + 19.19), h3(p + 47.7)) * 2.0 - 1.0 + 1e-4); }
float gnoise(vec3 p) {   // gradient noise, 0..1 (AE's "Spline")
  vec3 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(g3(i), f), n100 = dot(g3(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), n010 = dot(g3(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)), n110 = dot(g3(i + vec3(1, 1, 0)), f - vec3(1, 1, 0));
  float n001 = dot(g3(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)), n101 = dot(g3(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), n011 = dot(g3(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)), n111 = dot(g3(i + vec3(1, 1, 1)), f - vec3(1, 1, 1));
  float n = mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y), mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
  return clamp(0.5 + n * 0.75, 0.0, 1.0);
}
float vn(vec3 p, int t) {   // AE's noise types: 0 Block, 1 Linear, 2 Soft Linear, 3 Spline
  if (t == 3) return gnoise(p);
  vec3 i = floor(p), f = fract(p);
  if (t == 0) return h3(i);
  if (t == 2) f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y);
  float b = mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y);
  return mix(a, b, f.z);
}
float fbmN(vec2 p, float oct, float z) {   // plain fractal noise for the warps (smooth), 0..1
  float s = 0.0, w = 0.0, a = 1.0;
  for (int k = 0; k < 6; k++) { float fk = float(k); if (fk >= oct) break; float wk = a * min(1.0, oct - fk); s += wk * vn(vec3(p, z + fk * 3.7), 2); w += wk; p = p * 2.02 + 9.7; a *= 0.5; }
  return s / max(w, 1e-5);
}
// Fractal Noise at map point q (px from the map's middle) for the effect at uFx[k0..k0+5]
float fractalAt(vec2 q, int k0) {
  vec4 A = uFx[k0], B = uFx[k0 + 1], C = uFx[k0 + 2], E = uFx[k0 + 3], G = uFx[k0 + 4], H = uFx[k0 + 5];
  int ft = int(A.y + 0.5), nt = int(A.z + 0.5);
  vec2 p = H.y > 0.5 ? vec2(dot(q, uAcross), dot(q, uAlong)) : q;   // follow the bands: x across them, y along
  p = mat2(C.x, C.y, -C.y, C.x) * p + G.xy;
  p *= C.zw;
  float sum = 0.0, wsum = 0.0, amp = 1.0, cs = cos(E.w), sn = sin(E.w);
  for (int o = 0; o < 10; o++) {
    float fo = float(o); if (fo >= E.x) break;
    float wk = amp * min(1.0, E.x - fo);   // the last layer fades in with the complexity's fraction
    float n = vn(vec3(p + G.w + fo * 31.7, G.z + fo * 5.3), nt);
    if (ft == 1) { n = 2.0 * n - 1.0; n *= n * 3.0; }               // turbulent: folded (gains bring them near mid grey, as AE's look)
    else if (ft == 2) n = abs(2.0 * n - 1.0) * 1.5;
    else if (ft == 3) n = pow(1.0 - abs(2.0 * n - 1.0), 8.0) * 2.0;   // strings: thin bright lines
    sum += wk * n; wsum += wk; amp *= E.y;
    p = mat2(cs, sn, -sn, cs) * p * E.z + vec2(7.31, 3.17);
  }
  float v = (sum / max(wsum, 1e-5) - 0.5) * B.x + 0.5 + B.y;
  int ov = int(B.z + 0.5);
  if (ov == 0) v = clamp(v, 0.0, 1.0);
  else if (ov == 1) v = 0.5 + 0.5 * tanh(2.0 * (v - 0.5)) / tanh(1.0);
  else v = 1.0 - abs(1.0 - mod(v, 2.0));
  v = clamp(v, 0.0, 1.0);
  return B.w > 0.5 ? 1.0 - v : v;
}
vec3 blendFx(vec3 v, float n, int m, float op) {
  vec3 b;
  if (m == 0) b = vec3(n);
  else if (m == 1) b = v + n;
  else if (m == 2) b = v * n;
  else if (m == 3) b = 1.0 - (1.0 - v) * (1.0 - n);
  else if (m == 4) b = mix(2.0 * v * n, 1.0 - 2.0 * (1.0 - v) * (1.0 - n), step(0.5, v));
  else if (m == 5) b = (1.0 - 2.0 * n) * v * v + 2.0 * n * v;
  else if (m == 6) b = v + 2.0 * n - 1.0;
  else b = abs(v - n);
  return clamp(mix(v, b, op), 0.0, 1.0);
}
bool fxWarp(int t) { return t >= 2 && t <= 5; }
// a warp: where the map is read from for point q
vec2 warpFx(vec2 q, int k0) {
  vec4 A = uFx[k0], B = uFx[k0 + 1], C = uFx[k0 + 2];
  int t = int(A.x + 0.5);
  if (t == 2) {   // Turbulent Displace
    int dt = int(A.y + 0.5); vec2 p = (q + C.xy) * B.x + B.z;
    vec2 off;
    if (dt == 3) { float e = 0.04, n0 = fbmN(p, A.z, B.y), nx = fbmN(p + vec2(e, 0.0), A.z, B.y), ny = fbmN(p + vec2(0.0, e), A.z, B.y); off = vec2(ny - n0, n0 - nx) / e * 0.35; }   // twist: swirls (the noise's curl)
    else {
      off = vec2(fbmN(p, A.z, B.y), fbmN(p + vec2(41.3, 17.9), A.z, B.y + 5.1)) * 2.0 - 1.0; off *= 1.6;
      if (dt == 1) off = uAcross * dot(off, uAcross); else if (dt == 2) off = uAlong * dot(off, uAlong);
    }
    return q + off * A.w;
  }
  if (t == 3) {   // Wave Warp
    int wt = int(A.y + 0.5); vec2 td = B.w > 0.5 ? vec2(uAlong.x * B.x - uAlong.y * B.y, uAlong.x * B.y + uAlong.y * B.x) : B.xy;   // the way the waves travel (from the bands, or the screen)
    float s = dot(q, td) * A.w + B.z, y;
    if (wt == 0) y = sin(6.2831853 * s);
    else if (wt == 1) y = clamp(sin(6.2831853 * s) * 6.0, -1.0, 1.0);
    else if (wt == 2) y = 1.0 - 4.0 * abs(fract(s + 0.25) - 0.5);
    else if (wt == 3) y = 2.0 * fract(s) - 1.0;
    else y = vn(vec3(s * 2.0, 3.1, 0.0), 2) * 2.0 - 1.0;
    return q + vec2(-td.y, td.x) * y * A.z;
  }
  if (t == 4) {   // Twirl
    vec2 d = q - B.xy; float r = length(d), f = max(0.0, 1.0 - r / A.z), th = -A.y * f * f, cs = cos(th), sn = sin(th);
    return B.xy + vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs);
  }
  if (t == 5) {   // Ripple
    vec2 d = q - B.xy; float r = length(d), fall = 1.0 - smoothstep(0.0, A.w, r);
    float y = sin(6.2831853 * (r * A.z + B.z)) * A.y * fall;
    return r > 1e-4 ? q + d / r * y : q;
  }
  return q;
}
// a look: the map's greys v at point q
vec3 lookFx(vec3 v, vec2 q, int k0) {
  vec4 A = uFx[k0];
  int t = int(A.x + 0.5);
  if (t == 1) return blendFx(v, fractalAt(q, k0), int(A.w + 0.5), uFx[k0 + 5].x);
  if (t == 6) { float L = A.y; return min(floor(v * L), L - 1.0) / (L - 1.0); }
  if (t == 7) { float n = h3(vec3(floor(q / A.z) + 0.5, A.w + 0.37)); return clamp(v + (n - 0.5) * 2.0 * A.y, 0.0, 1.0); }
  return v;
}

// integral of band i from its start to f; the pattern is box-filtered as (F(u+h) - F(u-h)) / 2h (exact, so it never aliases)
float bandInt(int i, float f) {
  float r = uPR[i], lo = uPLo[i], hi = uPHi[i];
  if (f < r) { float t = max(f, 0.0) / r; return r * (lo * t + (hi - lo) * t * t * 0.5); }
  return r * (lo + hi) * 0.5 + (f - r) * uPPl[i];
}
float F(float u) {
  float k = floor(u / uPer), f = u - k * uPer;
  int i = 0;
  for (int j = 1; j < 8; j++) { if (j >= uPN) break; if (f >= uPCum[j]) i = j; }
  return k * uPTot + uPInt[i] + bandInt(i, f - uPCum[i]);
}
float pat(float u) { return (F(u + uHalf) - F(u - uHalf)) / (2.0 * uHalf); }

// the map at comp point c: rgb = the band value (green / blue can be shifted), a = 1 inside the map. uu = place across the pattern
vec4 bandMap(vec2 c, out float inMap, out float uu, out float w) {
  inMap = 1.0; uu = 0.0; w = 0.0;
  vec2 m;
  if (uBeh == 1) m = c / uComp * uMap.zw;
  else {
    m = c - uMap.xy;
    if (uBeh == 2) m = mod(m, uMap.zw);
    else if (m.x < 0.0 || m.y < 0.0 || m.x > uMap.z || m.y > uMap.w) { inMap = 0.0; }
  }
  vec2 q = m - 0.5 * uMap.zw;
  // the effects, as AE stacks them: going down the stack each warp moves where the layer under it is read; each look then works on
  // the greys at the point it was asked for (qs[k] = where effect k is evaluated)
  vec2 qs[8];
  for (int k = 7; k >= 0; k--) { if (k >= uFxN) continue; qs[k] = q; if (fxWarp(int(uFx[k * 6].x + 0.5))) q = warpFx(q, k * 6); }
  float u0 = dot(q, uAcross), u = u0 + uBOff;
  w = dot(q, uAlong);
  uu = u - floor(u / uPer) * uPer;
  if (inMap < 0.5) return vec4(0.5, 0.5, 0.5, 0.0);
  if (uMBox == 1 && (u0 < uMBoxR.x - uMBoxE || u0 > uMBoxR.y + uMBoxE || w < uMBoxR.z - uMBoxE || w > uMBoxR.w + uMBoxE)) return vec4(0.0);   // r3: past the map layer's edge: empty (AE reads 0 = black, alpha 0)
  vec3 v = vec3(pat(uu), pat(uu + uBPh.x * uPer), pat(uu + uBPh.y * uPer));
  if (uBInv == 1) v = 1.0 - v;
  v = mix(vec3(uBLo), vec3(uBHi), v);
  for (int k = 0; k < 8; k++) { if (k >= uFxN) break; if (!fxWarp(int(uFx[k * 6].x + 0.5))) v = lookFx(v, qs[k], k * 6); }
  return vec4(v, 1.0);
}
float chan(vec4 m, int c) {
  if (c == 0) return m.r;
  if (c == 1) return m.g;
  if (c == 2) return m.b;
  if (c == 3) return m.a;
  if (c == 4) return dot(m.rgb, vec3(0.299, 0.587, 0.114));
  float mx = max(max(m.r, m.g), m.b), mn = min(min(m.r, m.g), m.b), d = mx - mn;
  if (c == 5) { if (d < 1e-5) return 0.0; float h = mx == m.r ? mod((m.g - m.b) / d, 6.0) : (mx == m.g ? (m.b - m.r) / d + 2.0 : (m.r - m.g) / d + 4.0); return h / 6.0; }
  if (c == 6) return 0.5 * (mx + mn);
  if (c == 7) { float l = 0.5 * (mx + mn); return d < 1e-5 ? 0.0 : d / max(1.0 - abs(2.0 * l - 1.0), 1e-5); }
  if (c == 8) return 1.0;
  return 0.5;
}
// what counts as "no move": the map's average for the band channels when the shape keeps its place, else AE's mid grey
float centreOf(int c) { return (c == 0 || c == 1 || c == 2 || c == 4 || c == 6) ? uCenter : 0.5; }
// strokes on the chosen band edges at uu (comp px across the pattern)
float strokeAt(float uu) {
  float best = 0.0, aa = uPix;
  for (int i = 0; i < 8; i++) {
    if (i >= uPN) break;
    for (int e = 0; e < 2; e++) {
      if (uSEM[i * 2 + e] < 0.5) continue;   // this edge has no stroke
      float ep = uPCum[i] + (e == 1 ? uPR[i] : 0.0);
      float dd = uu - ep; dd -= uPer * floor(dd / uPer + 0.5);
      float s = dd - uSOff, x, inner = 1.0;
      if (uSSide == 0) x = abs(s);
      else if (uSSide == 1) { x = max(s, 0.0); inner = smoothstep(-aa, aa, s); }
      else { x = max(-s, 0.0); inner = smoothstep(-aa, aa, -s); }
      float W = max(uSW, 1e-3);
      float prof = (uSGrad <= 0.001 ? 1.0 : pow(clamp(1.0 - x / W, 0.0, 1.0), uSGrad)) * (1.0 - smoothstep(W - aa, W + aa, x)) * inner;
      best = max(best, prof);
    }
  }
  return best;
}
vec4 accAt(sampler2D t, vec2 s) { vec2 uv = (s - uRast.xy) / uRast.zw; if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0); return textureLod(t, uv, 0.0); }
vec2 gC;   // r3: the pixel's comp point (the unwarped shapes are read there)
vec4 clipAt(vec2 s) {   // the output clip (shapes set to "Clip output"), same box and size as the shape layer
  vec2 uv = (s - uRast.xy) / uRast.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  return textureLod(uClip, uv, 0.0);
}
vec4 srcAt0(vec2 uv) {
  if (uCubic == 0) return textureLod(uSrc, uv, 0.0);
  vec2 st = uv * uSrcSize - 0.5, i = floor(st), f = st - i, f2 = f * f, f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0, w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0, w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0, w3 = f3 / 6.0;
  vec2 g0 = w0 + w1, g1 = w2 + w3, t0 = (i - 0.5 + w1 / g0) / uSrcSize, t1 = (i + 1.5 + w3 / g1) / uSrcSize;
  return g0.y * (g0.x * textureLod(uSrc, vec2(t0.x, t0.y), 0.0) + g1.x * textureLod(uSrc, vec2(t1.x, t0.y), 0.0))
       + g1.y * (g0.x * textureLod(uSrc, vec2(t0.x, t1.y), 0.0) + g1.x * textureLod(uSrc, vec2(t1.x, t1.y), 0.0));
}
vec4 srcAt(vec2 s) {
  vec2 uv = (s - uRast.xy) / uRast.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  float ck = 1.0;
  if (uDClip == 1) {   // r3: past the comp edge nothing (AE's bilinear read: the last half pixel fades out)
    vec2 e0 = s / (2.0 * uPix) + 0.5, e1 = (uComp - s) / (2.0 * uPix) + 0.5;
    ck = clamp(e0.x, 0.0, 1.0) * clamp(e0.y, 0.0, 1.0) * clamp(e1.x, 0.0, 1.0) * clamp(e1.y, 0.0, 1.0);
    if (ck <= 0.0) return vec4(0.0);
  }
  return ck * srcAt0(uv);
}

// ---- razorsensation2 r2: refraction (a glass flute per band) and the bands over the Colorama ----
// the flute at uu: x = place across it (-1 its left side .. 1 its right side), wpx = its width (comp px)
float fluteX(float uu, out float wpx) {
  int i = 0;
  for (int j = 1; j < 8; j++) { if (j >= uPN) break; if (uu >= uPCum[j]) i = j; }
  float a0 = uPCum[i], a1 = uPCum[i + 1];
  wpx = max(a1 - a0, 1e-3);
  return clamp((uu - a0) / wpx, 0.0, 1.0) * 2.0 - 1.0;
}
// the surface's slope dh/dx at x (h in half-widths): round = a half cylinder, soft = a cosine bump, ridge = a V, flat = a flat top with round shoulders
float fluteSlope(float x) {
  float ax = abs(x), sg = x < 0.0 ? -1.0 : 1.0, v = uRValley, e = max(1.0 - v, 0.0), xe = min(ax, min(e, 0.999)), g;
  if (uRProf == 1) g = 0.5 * 3.14159265 * sin(3.14159265 * xe);
  else if (uRProf == 2) g = 1.0;
  else if (uRProf == 3) { float f = clamp(uRFlat, 0.0, 0.95); if (xe <= f) g = 0.0; else { float q = min((xe - f) / (1.0 - f), 0.999); g = q / sqrt(1.0 - q * q); } }
  else g = xe / sqrt(1.0 - xe * xe);
  if (v > 1e-4 && ax > e) g *= clamp((1.0 - ax) / v, 0.0, 1.0);   // the trough between two flutes, rounded
  return -sg * g;
}
// how far the glass moves what is seen at uu (comp px), for an index of refraction n; tilt = the surface's tilt there
float hiAt(float x) { return uRHi * (1.0 - smoothstep(0.0, max(uRHiW, 1e-3), abs(x - uRHiPos) * 0.5)); }   // the glass's light line at x across a flute (-1..1)
vec2 refrD(float uu, float n, out float x, out float tilt) {
  float wpx; x = fluteX(uu, wpx);
  float al = atan(uRBulge * fluteSlope(x)), be = asin(clamp(sin(al) / max(n, 1.0001), -1.0, 1.0));
  tilt = al;
  return uAcross * (-uRDepth * tan(al - be)) + uAlong * (uRShear * x);
}
// the layer under the glass at p: rgb = brightness (bands under the Colorama) or the coloured, matted layer (bands over it); a = alpha
vec3 lutAt(float ph) { return textureLod(uLut, vec2((ph * ${LUT_N - 1}.0 + 0.5) / ${LUT_N}.0, 0.5), 0.0).rgb; }
float lutA(float ph) { return textureLod(uLut, vec2((ph * ${LUT_N - 1}.0 + 0.5) / ${LUT_N}.0, 0.5), 0.0).a; }   // the stops' opacity along the line
float inX(float x, float nz) { x = clamp((x + nz - uInLo) / max(uInHi - uInLo, 1e-5), 0.0, 1.0); float y = pow(x, uInGam) * uRep + uPhase; y = uCycle == 1 ? fract(y) : clamp(y, 0.0, 1.0); return uPost > 0.5 ? floor(y * uPost) / uPost : y; }   // r3: Cycle mode wraps (AE)
float gInNoise;
vec4 readAt(vec2 p, float st) {
  if (uWrap == 1) p = mod(p, uComp);
  vec4 sh = srcAt(p);   // (r4: past the comp edge it is empty when dClip: srcAt)
  if (uNBOn == 1) { vec4 nb = accAt(uNB, gC); sh = nb + sh * (1.0 - nb.a); }   // r3: the shapes that skip the bands sit over the warped ones
  float a = sh.a, I = mix(sh.r + uLbg * (1.0 - a), a > 1e-5 ? sh.r / a : 0.0, uStraightK), A = a;
  if (uStrokes == 1 && st > 0.0) {
    if (uSBlend == 0) I = 1.0 - (1.0 - I) * (1.0 - st);
    else if (uSBlend == 1) I = min(I + st, 1.0);
    else if (uSBlend == 2) I = max(I, st);
    else I = I * (1.0 - st);
    if (uSBlend != 3) A = max(A, st);
  }
  if (uAfter == 0 || uColor == 0) return vec4(vec3(I), A);
  float x = uFrom == 0 ? I : (uFrom == 1 ? A : 0.0);
  float ph0 = inX(x, gInNoise), la = lutA(ph0);
  vec3 col = mix(lutAt(ph0), vec3(I), uBlend);
  if (uOut == 0) { A *= la; col = uAlphaOut == 1 ? col * clamp(A, 0.0, 1.0) : mix(uBgCol, col, clamp(A, 0.0, 1.0)); }
  else col = mix(uBgCol, col, la);   // a clear stop: the background (this comp colours every pixel)
  return vec4(col, A);
}
// what the glass shows at c: two points across the pixel (the flute joints stay smooth), frost across the flute, dispersion per channel
void glassRead(vec2 c, float uu, float st, out vec3 RGB, out vec3 AL, out float x0, out float t0) {
  RGB = vec3(0.0); AL = vec3(0.0); float ws = 0.0;
  bool dsp = uRDisp > 1e-4;
  refrD(uu, uRIor, x0, t0);
  float f = uRFrost + uREFrost * smoothstep(0.35, 1.0, abs(x0));
  int nt = f > 0.5 ? 5 : 1, ns = nt == 1 ? 2 : 1;
  for (int sb = 0; sb < 2; sb++) {
    if (sb >= ns) break;
    float du = ns == 1 ? 0.0 : (float(sb) - 0.5) * uPix, xx, tt;
    vec2 cc = c + uAcross * du;
    vec2 dG = refrD(uu + du, uRIor, xx, tt), dR = dG, dB = dG;
    if (dsp) { dR = refrD(uu + du, max(uRIor - uRDisp, 1.0001), xx, tt); dB = refrD(uu + du, uRIor + uRDisp, xx, tt); }
    for (int k = 0; k < 5; k++) {
      if (k >= nt) break;
      float kk = nt == 1 ? 0.0 : float(k) - 2.0, wt = nt == 1 ? 1.0 : (k == 2 ? 6.0 : ((k == 1 || k == 3) ? 4.0 : 1.0));
      vec2 j = uAcross * (kk * f * 0.5);
      vec4 g = readAt(cc + dG + j, st);
      if (dsp) { vec4 r = readAt(cc + dR + j, st), bb = readAt(cc + dB + j, st); RGB += vec3(r.r, g.g, bb.b) * wt; AL += vec3(r.a, g.a, bb.a) * wt; }
      else { RGB += g.rgb * wt; AL += vec3(g.a) * wt; }
      ws += wt;
    }
  }
  RGB /= ws; AL /= ws;
}

void main() {
  vec2 dp = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y);
  vec2 c = (dp - uOrig) / uZ;
  if (c.x < 0.0 || c.y < 0.0 || c.x > uComp.x || c.y > uComp.y) { o = uAlphaOut == 1 ? vec4(0.0) : vec4(uPaste, 1.0); return; }
  vec2 fc = gl_FragCoord.xy;
  gC = c;
  gInNoise = uInDither > 0.0 ? (rnd(fc, uSeed + 3.0) + rnd(fc + 57.0, uSeed + 11.0) - 1.0) * (uInDither / 1000.0) : 0.0;
  float inMap, uu, w;
  vec4 m = bandMap(c, inMap, uu, w);
  vec2 d = vec2(0.0);
  bool refr = uBands == 1 && inMap > 0.5 && uROn == 1;
  float rx = 0.0, rtl = 0.0;
  if (uBands == 1 && inMap > 0.5 && uROn == 0) {
    float h = uChH == 10 ? 0.0 : (chan(m, uChH) - centreOf(uChH)) * 2.0 * uMaxH;
    float v = uChV == 10 ? 0.0 : (chan(m, uChV) - centreOf(uChV)) * 2.0 * uMaxV;
    d = (uSpace == 1 ? uAcross * h + uAlong * v : vec2(h, v)) * uFlip;
  }
  if (refr) d = refrD(uu, uRIor, rx, rtl);
  vec2 s = c + d;
  if (uWrap == 1) s = mod(s, uComp);
  vec4 sh = srcAt(s);
  float a = sh.a;
  float st = 0.0, mk = 0.0;
  bool needStroke = uStrokes == 1 || uMode == 4 || uMode == 5 || uSOOn == 1;
  if (needStroke) {
    if (uSMaskOn == 1) {   // masked to a shape: 0 at its edge, 1 the feather's distance inside (its blur is feather / 2 sigma); r2: times that shape's opacity
      vec2 mp = uSFollow == 1 ? s : c, uv = (mp - uSMRect.xy) / uSMRect.zw;
      float ma = (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) ? 0.0 : textureLod(uSMask, uv, 0.0).a;
      mk = (uSMFeather == 1 ? smoothstep(0.5, 0.977, ma) : ma) * uSMOp;
    } else {
      float am = uSFollow == 1 ? a : srcAt(c).a;
      float h2 = max(uSSoft * 0.5, 1e-3);
      mk = smoothstep(uSChoke - h2, uSChoke + h2, am);
    }
    if (uSInv == 1) mk = 1.0 - mk;
    st = strokeAt(uu) * mk * uSInt;
  }
  // the layer the glass shows (one read, or the glass's several)
  vec3 RGB, AL;
  if (refr) glassRead(c, uu, st, RGB, AL, rx, rtl);
  else { vec4 r1 = readAt(s, st); RGB = r1.rgb; AL = vec3(r1.a); }
  if (uBOp < 0.999 && uBands == 1 && inMap > 0.5) { vec4 r0 = readAt(c, st); RGB = mix(r0.rgb, RGB, uBOp); AL = mix(vec3(r0.a), AL, uBOp); }
  // the glass's own light: a line along each flute, brighter steep sides (Fresnel), shadow in the troughs
  float Lt = 0.0, Sd = 0.0, lm = 1.0;
  if (refr) {
    float Hl = hiAt(rx);
    if (uRHi > 0.0) {   // r7: where one flute meets the next the light line jumps (a line at a side): share the pixel across it, so the edge is smooth, not stepped
      float fw, fx = fluteX(uu, fw), pS = (fx + 1.0) * 0.5 * fw * uZ, pE = (1.0 - fx) * 0.5 * fw * uZ;
      if (pS < 0.5) Hl = (0.5 + pS) * Hl + (0.5 - pS) * hiAt(1.0); else if (pE < 0.5) Hl = (0.5 + pE) * Hl + (0.5 - pE) * hiAt(-1.0);
    }
    Lt = (Hl + uREdge * clamp(2.0 * (1.0 - cos(rtl)), 0.0, 1.0)) * uBOp;
    Sd = uRShade * smoothstep(1.0 - 2.0 * uRShW, 1.0, abs(rx)) * uBOp;
    lm = uRLightShape == 1 ? clamp(AL.g, 0.0, 1.0) : 1.0;
  }
  bool after = uAfter == 1 && uColor == 1;
  if (refr && !after) { RGB = 1.0 - (1.0 - RGB) * (1.0 - Lt * lm); RGB *= 1.0 - Sd * lm; if (uRLightShape == 0) AL = max(AL, vec3(Lt)); }
  vec3 col; float oa = 1.0;
  float I = RGB.g + 0.0, A = AL.g;
  if (uMode == 1) { vec4 b = srcAt(c); col = vec3(b.r + uLbg * (1.0 - b.a)); }
  else if (uMode == 2) col = inMap > 0.5 ? m.rgb : vec3(mod(floor(c.x / 40.0) + floor(c.y / 40.0), 2.0) * 0.05 + 0.05);
  else if (uMode == 3) { col = (refr && !after) || uNBOn == 1 || uStrokes == 1 || uStraight == 1 ? RGB : vec3(sh.r + uLbg * (1.0 - a)); if (uStraight == 1 && !after) col *= clamp(AL, 0.0, 1.0); }   // r4: straight colour shows as the layer looks (over black)   // r3: what the Colorama reads (the unwarped shapes and the strokes in)
  else if (uMode == 4) col = vec3(strokeAt(uu) * mk);
  else if (uMode == 5) col = vec3(mk);
  else if (uMode == 6) { float mx = refr ? max(abs(uRDepth) + abs(uRShear), 1e-3) : max(max(abs(uMaxH), abs(uMaxV)), 1e-3); col = vec3(0.5 + 0.5 * d / mx, 0.5); }
  else if (after) {   // the bands over the Colorama: RGB is already coloured (and matted, premultiplied for alpha output)
    col = RGB;
    if (uOut == 0 && uAlphaOut == 1) { oa = clamp(A, 0.0, 1.0); col = RGB / max(oa, 1e-5); }
    if (refr) { col = 1.0 - (1.0 - col) * (1.0 - Lt * lm); col *= 1.0 - Sd * lm; if (uRLightShape == 0 && uOut == 0 && uAlphaOut == 1) oa = max(oa, Lt); }
  }
  else if (uColor == 1) {   // the Colorama last (each channel through the line on its own when dispersion split them)
    vec3 X = uFrom == 0 ? RGB : (uFrom == 1 ? AL : vec3(0.0));
    vec3 ph = vec3(inX(X.r, gInNoise), inX(X.g, gInNoise), inX(X.b, gInNoise));
    col = (abs(ph.r - ph.g) + abs(ph.b - ph.g) < 1e-6) ? lutAt(ph.g) : vec3(lutAt(ph.r).r, lutAt(ph.g).g, lutAt(ph.b).b);
    col = mix(col, RGB, uBlend);
    float la = lutA(ph.g);   // the stops' opacity
    if (uOut == 0) { if (uAlphaOut == 1) oa = clamp(A, 0.0, 1.0) * la; else col = mix(uBgCol, col, clamp(AL, 0.0, 1.0) * la); }
    else col = mix(uBgCol, col, la);
  } else { col = RGB; if (uAlphaOut == 1 && uMode == 0) oa = clamp(A, 0.0, 1.0); else if (uStraight == 1 && uMode == 0) col = mix(uBgCol, RGB, clamp(AL, 0.0, 1.0)); }   // r4: straight colour without a Colorama: the layer over the background
  if (uMode == 0 && (uOVOn == 1 || uSOOn == 1)) {   // r3: over the Colorama: the overlay shapes, then the band overlay
    vec3 P = uAlphaOut == 1 ? col * oa : col; float pa = oa;
    if (uOVOn == 1 && (uOVClip.z <= 0.0 || (c.x >= uOVClip.x && c.y >= uOVClip.y && c.x < uOVClip.x + uOVClip.z && c.y < uOVClip.y + uOVClip.w))) { vec4 ov = accAt(uOV, c) * uOVOp; P = ov.rgb + P * (1.0 - ov.a); pa = ov.a + pa * (1.0 - ov.a); }
    for (int k = 0; k < 2; k++) {   // the band overlays (k = 0, 1): premultiplied colour across one band period (and, from AE, along the bands too), masked like the strokes; W3C separable blend, then source-over
      if (uSOL[k] == 0) continue;
      vec4 V = k == 0 ? uSOV0 : uSOV1; float v = 0.5;   // V: w of its first row, of its last (along the bands), u where it starts and ends across
      if (V.y > V.x) { v = (w - V.x) / (V.y - V.x); if (v < -0.002 || v > 1.002) continue; }
      if (V.w > V.z) { float ua = dot(c - 0.5 * uComp, uAcross); if (ua < V.z || ua > V.w) continue; }
      vec2 tuv = vec2(mod(uu + uSOOff[k], uPer) / uPer, v);
      vec4 t = k == 0 ? textureLod(uSOT0, tuv, 0.0) : textureLod(uSOT1, tuv, 0.0);
      float kk = clamp(mk * uSOOp[k], 0.0, 1.0), sa = t.a * kk;
      if (sa <= 1e-6) continue;
      vec3 cs = t.rgb / max(t.a, 1e-5), cb = pa > 1e-5 ? P / pa : vec3(0.0), r; int bm = uSOBlend[k];
      float lb = dot(cb, vec3(0.3, 0.59, 0.11)), ls = dot(cs, vec3(0.3, 0.59, 0.11));
      if (bm == 1) r = 1.0 - (1.0 - cb) * (1.0 - cs); else if (bm == 2) r = min(cb + cs, 1.0); else if (bm == 3) r = max(cb, cs); else if (bm == 4) r = cb * cs; else if (bm == 5) r = ls < lb ? cs : cb; else r = cs;
      P = sa * (cs * (1.0 - pa) + pa * r) + P * (1.0 - sa); pa = sa + pa * (1.0 - sa);
    }
    if (uAlphaOut == 1) { oa = pa; col = pa > 1e-5 ? P / pa : vec3(0.0); } else col = P;
  }
  if (uClipOn == 1 && uMode == 0) { float ca = clamp(clipAt(c).a, 0.0, 1.0); if (uAlphaOut == 1) oa *= ca; else col = mix(uBgCol, col, ca); }
  if (uCMOn == 1 && uMode == 0) {   // r6: the mask feather (Colorama): the coloured picture fades across the shape's soft outline
    vec2 mv = (c - uCMRect.xy) / uCMRect.zw; float mm = (mv.x < 0.0 || mv.y < 0.0 || mv.x > 1.0 || mv.y > 1.0) ? 0.0 : textureLod(uCM, mv, 0.0).a;
    mm = clamp(mm * uCMOp, 0.0, 1.0); if (uCMInv == 1) mm = 1.0 - mm;
    if (uFreeOn == 1) mm = max(mm, clamp(accAt(uFree, c).a, 0.0, 1.0));   // r23: only what its shape masks fades; the others stay
    if (uAlphaOut == 1) oa *= mm; else col = mix(uBgCol, col, mm);
  }
  col += (rnd(fc, uSeed) + rnd(fc + 101.0, uSeed + 7.0) - 1.0) * (uDither / 255.0);
  o = vec4(clamp(col, 0.0, 1.0) * oa, oa);
}`;

const cv = $('#gl'), vpc = $('#vpc');
const GL_ALPHA = !!(window.RZS_EXPORT && window.RZS_EXPORT.opts && window.RZS_EXPORT.opts.alpha);   // an exported page asked for a clear background
let gl = null, GL = null, glLost = false;
const rc = document.createElement('canvas'), rx = rc.getContext('2d');
const hitCtx = document.createElement('canvas').getContext('2d');
function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
function program(fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, info.name); }
  return { p, u };
}
function newTex(wrap) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap || gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}
function makeTarget(w, h) {
  const t = newTex();
  gl.texImage2D(gl.TEXTURE_2D, 0, GL.half ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, GL.half ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
  const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  const ok = GL.fbOk === GL.half || gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;   // ds (2026-11-02): checked once per format and context (the check stalls on the GPU)
  if (ok) GL.fbOk = GL.half;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok && GL.half) { gl.deleteFramebuffer(f); gl.deleteTexture(t); GL.half = false; return makeTarget(w, h); }
  return { t, f, w, h };
}
function target(name, w, h) {
  const T = GL[name]; if (T && T.w === w && T.h === h) return T;
  if (T) { gl.deleteTexture(T.t); gl.deleteFramebuffer(T.f); }
  return (GL[name] = makeTarget(w, h));
}
function initGL() {
  gl = cv.getContext('webgl2', { alpha: GL_ALPHA, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  if (!gl) return false;
  GL = { half: !!gl.getExtension('EXT_color_buffer_float'), vao: gl.createVertexArray(), pMain: program(FS_MAIN), pBlur: program(FS_BLUR), pComp: program(FS_COMP), lut: newTex(), ACC: null, layers: new Map() };
  gl.bindVertexArray(GL.vao);
  lutSig = ''; GL.accSig = ''; GL.clipSig = ''; for (const T of SOT) { T.sig = ''; T.tex = null; T.ok = false; }
  RC.clear(); rcCur = null;   // r6: every comp's state starts over with the context
  return true;
}
cv.addEventListener('webglcontextlost', e => { e.preventDefault(); glLost = true; });
cv.addEventListener('webglcontextrestored', () => { try { initGL(); glLost = false; touch(false); } catch (e) { showMsg('The GPU context could not be restored. Reload the page.'); } });
function showMsg(t) { const m = $('#msg'); m.textContent = t; m.style.display = 'flex'; }

const wCache = new Map();
function gaussWeights(sigma) {
  const key = sigma.toFixed(3); if (wCache.has(key)) return wCache.get(key);
  const R = Math.max(1, Math.min(46, Math.ceil(sigma * 3))), w = []; let sum = 0;
  for (let i = 0; i <= R; i++) { w[i] = Math.exp(-i * i / (2 * sigma * sigma)); sum += i ? 2 * w[i] : w[i]; }
  for (let i = 0; i <= R; i++) w[i] /= sum;
  const off = new Float32Array(24), wt = new Float32Array(24); let n = 1; wt[0] = w[0];
  for (let i = 1; i <= R && n < 24; i += 2) { const a = w[i], b = i + 1 <= R ? w[i + 1] : 0, s = a + b; off[n] = s > 0 ? (i * a + (i + 1) * b) / s : i; wt[n] = s; n++; }
  const r = { off, wt, n }; if (wCache.size > 64) wCache.clear(); wCache.set(key, r); return r;
}
function U1(pr, n, v) { const L = pr.u[n]; if (L) gl.uniform1f(L, v); }
function U2(pr, n, a, b) { const L = pr.u[n]; if (L) gl.uniform2f(L, a, b); }
function U3(pr, n, c) { const L = pr.u[n]; if (L) gl.uniform3f(L, c[0], c[1], c[2]); }
function U4(pr, n, a, b, c, d) { const L = pr.u[n]; if (L) gl.uniform4f(L, a, b, c, d); }
function UI(pr, n, v) { const L = pr.u[n]; if (L) gl.uniform1i(L, v); }
function UV(pr, n, arr, len) { const L = pr.u[n]; if (!L) return; const a = new Float32Array(len); for (let i = 0; i < Math.min(len, arr.length); i++) a[i] = arr[i]; gl.uniform1fv(L, a); }
function blurPass(srcTex, dst, dir, sigma) {
  const pr = GL.pBlur, W = gaussWeights(sigma);
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst.f); gl.viewport(0, 0, dst.w, dst.h); gl.useProgram(pr.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, srcTex); UI(pr, 'uT', 0);
  U2(pr, 'uTexel', 1 / dst.w, 1 / dst.h); U2(pr, 'uDir', dir[0], dir[1]); UI(pr, 'uN', W.n);
  if (pr.u.uOff) gl.uniform1fv(pr.u.uOff, W.off); if (pr.u.uW) gl.uniform1fv(pr.u.uW, W.wt);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// the shape layer in comp px. Every shape has its own blur, so each is rastered (only when it changes) and blurred
// (only when it or its blur changes) on its own, at a size that suits its blur, then all of them are stacked bottom to top
// into one accumulation as fine as the sharpest shape needs. Unchanged shapes are reused as they are.
// r3 (razorsensation2): videos. A shape with a video source shows the video's frame in its own box (clipped to its outline).
// Its clock: comp time vA = the first frame, vB = the last (AE's time remap; vB <= vA plays at normal speed from vA), held outside
const VID = new Map();
function vidOf(src) {
  let m = VID.get(src); if (m) return m;
  const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.loop = false;
  m = { v, ok: false }; VID.set(src, m);
  // the whole file as a blob first: a blob can always seek (a plain local server without Range requests can't); file:// plays it directly
  fetch(src).then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(b => { if (VID.get(src) !== m) return; m.url = URL.createObjectURL(b); v.src = m.url; }).catch(() => { if (VID.get(src) === m) v.src = src; });
  v.addEventListener('loadeddata', () => { m.ok = true; touch(false); });
  v.addEventListener('seeked', () => touch(false));
  v.addEventListener('error', () => { m.bad = true; });
  return m;
}
const vidReady = src => { const m = VID.get(src); return !!(m && m.ok && m.v.readyState >= 2 && !m.v.seeking); };
// AE's time remap: vA -> the file's start, vB -> its end (the last frame shows until vB, then holds). The frame on show is the one
// that holds that time (a few microseconds on, so a time right on a frame's start shows that frame, as AE does)
function vidWant(s, dur) {
  const t = D.tl.t, a = +s.vA || 0, b = +s.vB || 0, fps = +s.vfps || 0;
  if (fps > 0) {   // r3+: AE's time remap exactly (start -> 0, end -> the clip's length), shown as whole frames: the middle of frame floor(time x fps), the last one held
    const span = b > a + 1e-3 ? b - a : dur, lt = clamp((t - a) / Math.max(span, 1e-6), 0, 1) * dur, tt = clamp(lt, 0, Math.max(0, dur - 0.5 / fps));
    return { t: Math.min((Math.floor(tt * fps + 1e-4) + 0.5) / fps, Math.max(0, dur - 1e-3)), rate: dur / Math.max(span, 1e-6), live: t > a && t < a + span, tol: 0.25 / fps };
  }
  const end = Math.max(0, dur - 1 / 120);   // (no frame rate: AE's remap unsqueezed, a hair past the frame start)
  if (b > a + 1e-3) return { t: clamp(clamp((t - a) / (b - a), 0, 1) * dur + 1e-5, 0, end), rate: dur / (b - a), live: t > a && t < b };
  return { t: clamp(t - a + 1e-5, 0, end), rate: 1, live: t > a && t < a + dur };
}
const VID_USED = new Set();   // r6: the videos any comp shows this frame (one clean-up per frame, after them all)
function syncVideos(shapes) {
  const used = VID_USED;
  for (const s of shapes) {
    if (!s.vsrc || !s.on) continue; used.add(s.vsrc);
    const m = vidOf(s.vsrc), v = m.v; if (!m.ok || !(v.duration > 0)) continue;
    const w = vidWant(s, v.duration), sp = (D.tl.speed || 1) * w.rate;
    if (D.tl.play && w.live) {
      if (Math.abs(v.playbackRate - sp) > 1e-3) v.playbackRate = clamp(sp, 0.0625, 16);
      if (v.paused) { try { v.currentTime = w.t; } catch (e) { } v.play().catch(() => { }); }
      else if (Math.abs(v.currentTime - w.t) > 0.15) { try { v.currentTime = w.t; } catch (e) { } }
    } else {
      if (!v.paused) v.pause();
      if (Math.abs(v.currentTime - w.t) > (w.tol || 1 / 96) && !v.seeking) { try { v.currentTime = w.t; } catch (e) { } }
    }
    s._vt = Math.round(v.currentTime * 240);   // the frame on show (part of the layer's raster signature)
  }
}
function vidCleanup() { for (const [src, m] of VID) if (!VID_USED.has(src)) { m.v.pause(); m.v.removeAttribute('src'); m.v.load(); if (m.url) URL.revokeObjectURL(m.url); VID.delete(src); } }
// a layer's own colour line (a video's Colorama): baked once per change
function layerLine(R, s) {
  const sig = JSON.stringify([s.vstops, s.vmode, s.vmode === 'cycle' ? stopsCF(s.vstops) : 0]);
  if (R.lineSig === sig) return R.line; R.lineSig = sig;
  if (!R.line) R.line = newTex();
  const st = (s.vstops || []).map(x => ({ p: clamp(+x.p || 0, 0, 1), c: stopRGB(x, s.vmode === 'cycle') })).sort((a, b) => a.p - b.p), id = c => c, L = st.map(x => x.c), out = new Uint8Array(LUT_N * 4);
  for (let j = 0; j < LUT_N; j++) {
    const c = st.length ? (s.vmode === 'cycle' ? cycleColor : lineColor)(st, L, id, true, j / (LUT_N - 1)) : [1, 1, 1];
    for (let q = 0; q < 3; q++) out[j * 4 + q] = Math.round(clamp(c[q], 0, 1) * 255); out[j * 4 + 3] = 255;
  }
  gl.bindTexture(gl.TEXTURE_2D, R.line); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, LUT_N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, out);
  return R.line;
}
// r4: stills. A shape with an image (isrc: a data URL or a path) shows it in its own box, clipped to its outline: its alpha filled with
// the shape's fill (imode 'alpha': a flat-colour logo, its level stays keyable) or its own brightness ('grey': Rec. 601, as AE's
// Tint / Colorama read it; in colour over the Colorama). Loaded once
const IMG = new Map();
function imgOf(src) {
  let m = IMG.get(src); if (m) return m;
  const im = new Image(); m = { im, ok: false, grey: null }; IMG.set(src, m);
  im.onload = () => { m.ok = true; touch(false); }; im.onerror = () => { m.bad = true; }; im.src = assetURL(src);
  return m;
}
const imgReady = src => { const m = src ? imgOf(src) : null; return !!(m && m.ok); };
function imgGrey(m) {
  if (m.grey) return m.grey;
  const w = m.im.naturalWidth, h = m.im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h; const X = c.getContext('2d');
  X.drawImage(m.im, 0, 0); try { const d = X.getImageData(0, 0, w, h), a = d.data; for (let i = 0; i < a.length; i += 4) { const g = Math.round(0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2]); a[i] = a[i + 1] = a[i + 2] = g; } X.putImageData(d, 0, 0); } catch (e) { X.filter = 'grayscale(1)'; X.clearRect(0, 0, w, h); X.drawImage(m.im, 0, 0); }
  return (m.grey = c);
}
// a still drawn smaller than its own pixels along an axis (the raster is coarse there under a big blur): averaged down to that size first
// (exact areas, along its own axes, premultiplied), then drawn at about 1:1, so every row and column of it counts as much as it covers
// (drawn straight, the rows between samples were skipped: steps along slanted edges, stripes after the blur). sx, sy = raster px per image px
function boxAxis(F, w, h, n, horiz) {   // F: premultiplied RGBA floats, w x h -> n along one axis
  const len = horiz ? w : h, f = len / n, out = new Float32Array((horiz ? n * h : w * n) * 4);
  for (let j = 0; j < n; j++) {
    const a = j * f, b = a + f, i0 = Math.floor(a), i1 = Math.min(len, Math.ceil(b));
    for (let i = i0; i < i1; i++) {
      const wt = (Math.min(b, i + 1) - Math.max(a, i)) / f; if (wt <= 0) continue;
      if (horiz) for (let y = 0; y < h; y++) { const s = (y * w + i) * 4, d = (y * n + j) * 4; out[d] += F[s] * wt; out[d + 1] += F[s + 1] * wt; out[d + 2] += F[s + 2] * wt; out[d + 3] += F[s + 3] * wt; }
      else for (let x = 0; x < w; x++) { const s = (i * w + x) * 4, d = (j * w + x) * 4; out[d] += F[s] * wt; out[d + 1] += F[s + 1] * wt; out[d + 2] += F[s + 2] * wt; out[d + 3] += F[s + 3] * wt; }
    }
  }
  return out;
}
// -> the still (averaged down where it is drawn smaller) in a 1 px border, drawn from a part of it (Canvas then draws the box's edge hard,
// as WebGL / AE draw a layer's edge): along an axis kept at its size the border repeats the edge pixels (the edge rows keep their full
// weight up to the box's edge), along an averaged axis it is clear and drawn too (the coarse raster's rows don't line up with the box's
// edge; a clear border lets the last row fade across it, so it keeps its weight: no row snapped in or out)
function imgFor(m, base, sx, sy) {
  const iw = base.naturalWidth || base.width, ih = base.naturalHeight || base.height;
  const tw = sx > 0 && sx < 1 ? Math.max(1, Math.round(iw * sx)) : iw, th = sy > 0 && sy < 1 ? Math.max(1, Math.round(ih * sy)) : ih;
  const k = base === m.im ? 'c' : 'g', key = k + tw + 'x' + th; if (!m.mip) m.mip = new Map(); let c = m.mip.get(key); if (c) return c;
  if (!m.px) m.px = new Map();   // its pixels (premultiplied floats), and halved along either axis (kept: each level made once)
  const lev = (lx, ly) => {
    const q = k + lx + ',' + ly; let L = m.px.get(q); if (L) return L;
    if (!lx && !ly) {
      const t = document.createElement('canvas'); t.width = iw; t.height = ih; const X = t.getContext('2d'); X.drawImage(base, 0, 0);
      let d; try { d = X.getImageData(0, 0, iw, ih).data; } catch (e) { return null; }
      const F = new Float32Array(iw * ih * 4); for (let i = 0; i < d.length; i += 4) { const a = d[i + 3] / 255; F[i] = d[i] / 255 * a; F[i + 1] = d[i + 1] / 255 * a; F[i + 2] = d[i + 2] / 255 * a; F[i + 3] = a; }
      L = { F, w: iw, h: ih };
    } else {
      const P = lx ? lev(lx - 1, ly) : lev(lx, ly - 1); if (!P) return null;
      L = lx ? { F: boxAxis(P.F, P.w, P.h, Math.max(1, Math.ceil(P.w / 2)), true), w: Math.max(1, Math.ceil(P.w / 2)), h: P.h } : { F: boxAxis(P.F, P.w, P.h, Math.max(1, Math.ceil(P.h / 2)), false), w: P.w, h: Math.max(1, Math.ceil(P.h / 2)) };
    }
    m.px.set(q, L); return L;
  };
  // from the level at most 2x its size (cheap while its size animates), averaged down to it exactly
  const S = lev(tw < iw ? Math.max(0, Math.floor(Math.log2(iw / tw))) : 0, th < ih ? Math.max(0, Math.floor(Math.log2(ih / th))) : 0);
  if (!S) return { c: base, x: 0, y: 0, w: iw, h: ih, ex: 0, ey: 0 };
  let G = S.F, w = S.w, h = S.h;
  if (tw !== w) { G = boxAxis(G, w, h, tw, true); w = tw; }
  if (th !== h) { G = boxAxis(G, w, h, th, false); h = th; }
  const ex = tw !== iw ? 1 : 0, ey = th !== ih ? 1 : 0;   // 1 = that axis was averaged: a clear border, drawn
  const cv = document.createElement('canvas'); cv.width = w + 2; cv.height = h + 2; const X = cv.getContext('2d'), id = X.createImageData(w + 2, h + 2), o = id.data;
  for (let y = 0; y < h + 2; y++) for (let x = 0; x < w + 2; x++) {
    if ((ex && (x === 0 || x === w + 1)) || (ey && (y === 0 || y === h + 1))) continue;
    const i = (clamp(y - 1, 0, h - 1) * w + clamp(x - 1, 0, w - 1)) * 4, j = (y * (w + 2) + x) * 4, a = G[i + 3];
    o[j + 3] = Math.round(clamp(a, 0, 1) * 255); if (a > 1e-6) for (let q = 0; q < 3; q++) o[j + q] = Math.round(clamp(G[i + q] / a, 0, 1) * 255);
  }
  X.putImageData(id, 0, 0);
  c = { c: cv, x: 1 - ex, y: 1 - ey, w: w + 2 * ex, h: h + 2 * ey, ex: ex / w, ey: ey / h };   // ex, ey: the border as a part of the box
  if (m.mip.size > 8) m.mip.clear(); m.mip.set(key, c); return c;
}
const lineOn = s => !!(s.vsrc && s.vmode !== 'none' && s.vstops && s.vstops.length);
const GRAIN = { add: 1, clamp: 2, scale: 3, edges: 4 };
const seedOf = id => { let h = 2166136261; for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) % 9973; };
// AE Noise Alpha (shape gnk set; '' = the r3 grain): Noise, Overflow, and the seed / phase from Random Seed gsd (degrees), as
// Razorman's noiseAlpha: the random kinds take a field per whole degree, the animation kinds a new one per revolution, eased between
const GKIND = { uniform: 1, squared: 2, uanim: 4, sanim: 5 }, GOVF = { clip: 1, wrapback: 2, wrap: 3 };
function aeGrain(s) {
  const kind = GKIND[s.gnk] || 0, ang = +s.gsd || 0, anim = kind >= 4;
  return { kind, ovf: GOVF[s.gov] || 1, ph: anim ? ang / 360 : 0, cyc: anim ? Math.max(0, Math.round(+s.gcy || 0)) : 0,
    seed: anim ? 977 : ((Math.floor(ang) * 2654435761) >>> 0) & 0x7fffffff, a0: +s.gq > 0 ? 0.5 / +s.gq : 0 };
}
// the band overlays: one premultiplied texture each, across one band period (repeating): baked from its stops (1 row, blurred round
// the period), or (from After Effects) an image that also runs along the bands, soV = [w at its first row, w at its last]
const SO_N = 1024, SOT = [{ sig: '', tex: null, ok: false }, { sig: '', tex: null, ok: false }];
function soTex(P, k, per) {
  const pre = k ? 'so2' : 'so', im = P[pre + 'Img'], T = SOT[k];
  const sig = im ? 'img:' + im.length + ':' + im.slice(-96) : JSON.stringify([P[pre + 'Stops'], P[pre + 'Blur'], per]);
  if (sig === T.sig) return T.ok ? T.tex : null;
  T.sig = sig; T.ok = false; if (!T.tex) T.tex = newTex();
  const up = src => { gl.bindTexture(gl.TEXTURE_2D, T.tex); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); T.ok = true; };
  if (im) { const img = new Image(); img.onload = () => { if (T.sig !== sig) return; up(img); touch(false); }; img.src = im; return null; }
  const st = (P[pre + 'Stops'] || []).map(x => ({ p: clamp(+x.p || 0, 0, 1), c: hex2rgb(x.c), a: x.a == null ? 1 : clamp(+x.a, 0, 1) })).sort((a, b) => a.p - b.p);
  const out = new Uint8Array(SO_N * 4);
  if (st.length) {
    const L = st.map(x => [x.c[0] * x.a, x.c[1] * x.a, x.c[2] * x.a, x.a]), id = c => c, pm = [];   // premultiplied while it blends and blurs
    for (let j = 0; j < SO_N; j++) pm.push(lineColor(st.map((x, i) => ({ p: x.p, c: L[i] })), L, id, true, (j + 0.5) / SO_N));
    const sg = Math.max(0, +P[pre + 'Blur'] || 0) * BLUR_SIGMA / Math.max(per, 1e-3) * SO_N;
    let line = pm;
    if (sg > 0.3) { const R = Math.min(SO_N, Math.ceil(sg * 3)), w = []; let ws = 0; for (let q = -R; q <= R; q++) { const v = Math.exp(-0.5 * (q / sg) ** 2); w.push(v); ws += v; }
      line = pm.map((_, j) => { const a = [0, 0, 0, 0]; for (let q = -R; q <= R; q++) { const c = pm[((j + q) % SO_N + SO_N) % SO_N], f = w[q + R] / ws; for (let i = 0; i < 4; i++) a[i] += c[i] * f; } return a; }); }
    for (let j = 0; j < SO_N; j++) for (let q = 0; q < 4; q++) out[j * 4 + q] = Math.round(clamp(line[j][q], 0, 1) * 255);
  }
  gl.bindTexture(gl.TEXTURE_2D, T.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, SO_N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, out);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); T.ok = true;
  return T.tex;
}

let lutSig = '';
const INFO = { rw: 0, rh: 0, raster: 0, blur: 0, layers: 0 };
function layerRes(id) { let R = GL.layers.get(id); if (!R) { R = { raw: newTex(), A: null, B: null, rs: '', bs: '', ver: 0 }; GL.layers.set(id, R); } return R; }
function layerTarget(R, name, w, h) { const T = R[name]; if (T && T.w === w && T.h === h) return T; if (T) { gl.deleteTexture(T.t); gl.deleteFramebuffer(T.f); } return (R[name] = makeTarget(w, h)); }
function dropLayer(id) { const R = GL.layers.get(id); if (!R) return; gl.deleteTexture(R.raw); if (R.line) gl.deleteTexture(R.line); for (const n of ['A', 'B']) if (R[n]) { gl.deleteTexture(R[n].t); gl.deleteFramebuffer(R[n].f); } GL.layers.delete(id); }
// r3: with sHiP a solid shape (not a video, not a gradient) is rastered as white coverage: FS_COMP applies its colour and opacity
const hiFill = s => !!(D.p.sHiP && !s.vsrc && (s.fill || 'solid') === 'solid' && !(s.isrc && s.imode === 'grey'));   // (a still in its own greys keeps them)
const fillOf = s => { const l = s.lv ?? 1, c = s.ov ? hex2rgb(s.oc) : [l, l, l]; return [clamp(+c[0] || 0, 0, 1), clamp(+c[1] || 0, 0, 1), clamp(+c[2] || 0, 0, 1), clamp(+(s.op ?? 1) || 0, 0, 1)]; };
function rasterShape(s, L, tex, expand) {
  const cw = D.comp.w, ch = D.comp.h;
  if (rc.width !== L.rw || rc.height !== L.rh) { rc.width = L.rw; rc.height = L.rh; } else { rx.setTransform(1, 0, 0, 1, 0, 0); rx.clearRect(0, 0, L.rw, L.rh); }
  rx.setTransform(L.kx, 0, 0, L.ky, L.padX * L.kx, L.padY * L.ky);
  const cut = !expand || s.cc;   // r4: cc = cut at the frame before the blur (AE draws shape / text layers at the comp's size)
  if (cut) { rx.save(); rx.beginPath(); rx.rect(0, 0, cw, ch); rx.clip(); }
  rx.save();
  { const X = shapeXf(s), o = X.map(0, 0), ux = X.fwd(X.fx, 0), uy = X.fwd(0, X.fy);   // the shape's own space (anchor, W / H, scale, skew, rotation): a gradient fill follows it
    rx.transform(ux[0], ux[1], uy[0], uy[1], o[0], o[1]); }
  const hi = hiFill(s);
  rx.globalAlpha = hi ? 1 : clamp(s.op, 0, 1);
  const vm = s.vsrc ? VID.get(s.vsrc) : null;
  if (vm && vidReady(s.vsrc)) {   // r3: the video's frame in the shape's box, clipped to its outline (grey unless it shows over the Colorama)
    const [x0, y0, x1, y1] = localBBox(s.pts, s.closed);
    rx.clip(new Path2D(dStr(s.pts, true, (x, y) => [x, y]))); if (!s.ov) rx.filter = 'grayscale(1)';
    rx.drawImage(vm.v, x0, y0, x1 - x0, y1 - y0); rx.filter = 'none';
  } else if (s.isrc && !s.vsrc) {   // r4: a still in the shape's box, clipped to its outline
    if (imgReady(s.isrc)) {
      const [x0, y0, x1, y1] = localBBox(s.pts, s.closed), m = IMG.get(s.isrc), T = rx.getTransform(), iw = m.im.naturalWidth || 1, ih = m.im.naturalHeight || 1;
      const sx = Math.hypot(T.a, T.b) * Math.abs(x1 - x0) / iw, sy = Math.hypot(T.c, T.d) * Math.abs(y1 - y0) / ih;   // raster px per image px, along its own axes
      // its outline clips it, unless the outline is just its box (a second soft edge there would thin the image's own edge rows)
      const isBox = s.pts.length === 4 && s.pts.every(p => !p.ix && !p.iy && !p.ox && !p.oy && (Math.abs(p.x - x0) < 1e-6 || Math.abs(p.x - x1) < 1e-6) && (Math.abs(p.y - y0) < 1e-6 || Math.abs(p.y - y1) < 1e-6));
      if (!isBox) rx.clip(new Path2D(dStr(s.pts, true, (x, y) => [x, y])));
      const w = x1 - x0, h = y1 - y0, P = imgFor(m, s.imode === 'grey' && !s.ov ? imgGrey(m) : m.im, sx, sy);
      rx.drawImage(P.c, P.x, P.y, P.w, P.h, x0 - P.ex * w, y0 - P.ey * h, w * (1 + 2 * P.ex), h * (1 + 2 * P.ey));
      if (s.imode !== 'grey') {   // its alpha, then the fill over a wider box (no soft edge of its own on top of the image's)
        rx.globalCompositeOperation = 'source-in'; rx.globalAlpha = 1; rx.fillStyle = hi ? '#ffffff' : s.ov ? s.oc : shapeFill(rx, s); rx.fillRect(x0 - Math.abs(w), y0 - Math.abs(h), 3 * w, 3 * h);
      }
    }
  } else if (!s.vsrc) {
    rx.fillStyle = hi ? '#ffffff' : s.ov ? s.oc : shapeFill(rx, s);   // r3: a shape over the Colorama is drawn in its own colour
    rx.fill(new Path2D(dStr(s.pts, true, (x, y) => [x, y])));
  }
  rx.restore();
  if (cut) rx.restore();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rc);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
}
const shapeExpand = (s, P) => typeof s.inComp === 'boolean' ? !s.inComp : !!P.dExpand;   // r4: a shape's own frame, else the bands' Expand Output
function layerGeo(s, P, k0, maxD) {
  const cw = D.comp.w, ch = D.comp.h, xp = shapeExpand(s, P);
  const sH = Math.max(0, s.bh) * BLUR_SIGMA, sV = Math.max(0, s.bv) * BLUR_SIGMA;
  const fx = sH * k0 > SIGMA_WORK ? sH * k0 / SIGMA_WORK : 1, fy = sV * k0 > SIGMA_WORK ? sV * k0 / SIGMA_WORK : 1;
  const padX = xp ? Math.ceil(3 * sH + maxD + 4) : 0, padY = xp ? Math.ceil(3 * sV + maxD + 4) : 0;
  let kx = k0 / fx, ky = k0 / fy, rw = Math.max(8, Math.ceil((cw + 2 * padX) * kx)), rh = Math.max(8, Math.ceil((ch + 2 * padY) * ky));
  if (rw > 4096) { kx *= 4096 / rw; rw = 4096; }
  if (rh > 4096) { ky *= 4096 / rh; rh = 4096; }
  return { s, sH, sV, kx, ky, rw, rh, padX, padY, rect: [-padX, -padY, rw / kx, rh / ky] };
}
// one layer: rastered when it changes, blurred when it or its blur changes (shared by the shapes and the strokes' mask)
// ds (2026-11-02): a layer's raster signature (what it looks like before its blur): two shapes that match share one layer a frame
function layerRS(s, L, P) {
  const cw = D.comp.w, ch = D.comp.h, xp = shapeExpand(s, P);
  return JSON.stringify([L.rw, L.rh, L.kx, L.ky, L.padX, L.padY, xp, cw, ch, s.x, s.y, s.sx, s.sy, s.s, s.r, s.sk, s.ska, s.ax, s.ay, s.fill, hiFill(s) ? 'hi' : s.lv, s.lv2, s.ga, s.gs, hiFill(s) ? 1 : s.op, s.gc > 0 ? [s.gc, roundTo(s.gp + s.gv * aliveT(), 4)] : 0, s.pts, s.ov && !hiFill(s) ? s.oc : 0, s.vsrc ? [s.vsrc, s._vt, vidReady(s.vsrc)] : 0, s.cc ? 1 : 0, s.isrc ? [s.isrc.length, s.isrc.slice(-48), s.imode, imgReady(s.isrc)] : 0]);
}
function buildLayer(id, s, L, P, rs0) {
  const cw = D.comp.w, ch = D.comp.h, R = layerRes(id);
  const xp = shapeExpand(s, P), rs = rs0 || JSON.stringify([L.rw, L.rh, L.kx, L.ky, L.padX, L.padY, xp, cw, ch, s.x, s.y, s.sx, s.sy, s.s, s.r, s.sk, s.ska, s.ax, s.ay, s.fill, hiFill(s) ? 'hi' : s.lv, s.lv2, s.ga, s.gs, hiFill(s) ? 1 : s.op, s.gc > 0 ? [s.gc, roundTo(s.gp + s.gv * aliveT(), 4)] : 0, s.pts, s.ov && !hiFill(s) ? s.oc : 0, s.vsrc ? [s.vsrc, s._vt, vidReady(s.vsrc)] : 0, s.cc ? 1 : 0, s.isrc ? [s.isrc.length, s.isrc.slice(-48), s.imode, imgReady(s.isrc)] : 0]);   // r4: cut at the frame, a still (re-rastered when it arrives); r3: a video re-rasters when its frame changes or arrives (a seek in flight has none yet); sHiP: solid fills rastered white
  if (rs !== R.rs) { R.rs = rs; R.bs = ''; R.ver++; INFO.raster++; rasterShape(s, L, R.raw, xp); }
  const bsx = L.sH * L.kx, bsy = L.sV * L.ky;
  if (bsx > 0 || bsy > 0) {
    const A = layerTarget(R, 'A', L.rw, L.rh), B = layerTarget(R, 'B', L.rw, L.rh), bs = rs + '|' + bsx.toFixed(4) + '|' + bsy.toFixed(4);
    if (bs !== R.bs) {
      R.bs = bs; R.ver++; INFO.blur++;
      if (bsx > 0 && bsy > 0) { blurPass(R.raw, A, [1, 0], bsx); blurPass(A.t, B, [0, 1], bsy); }
      else if (bsx > 0) blurPass(R.raw, B, [1, 0], bsx);
      else blurPass(R.raw, B, [0, 1], bsy);
    }
    L.tex = B.t;
  } else { if (R.bs) { R.bs = ''; R.ver++; } L.tex = R.raw; }
  L.ver = R.ver; return L;
}
const BLENDS = { normal: ['ONE', 'ONE_MINUS_SRC_ALPHA'], subtract: ['ZERO', 'ONE_MINUS_SRC_ALPHA'], intersect: ['ZERO', 'SRC_ALPHA'], add: ['ONE', 'ONE'] };
const MATTE = { alpha: 1, alphaInv: 2, luma: 3, lumaInv: 4 };
// r2 (razorsensation2): the farthest the glass can move what it shows (comp px): depth x the steepest bend, frost, shear
function refrReach(P) {
  const n = Math.max(1.0001, (+P.rIor || 1.5) + Math.abs(+P.rDisp || 0)), bend = Math.min(3, Math.tan(Math.PI / 2 - Math.asin(1 / n)));
  return Math.abs(+P.rDepth || 0) * ((+P.rBulge || 0) > 0 ? bend : 0) + 2 * ((+P.rFrost || 0) + (+P.rEFrost || 0)) + Math.abs(+P.rShear || 0);
}
// r4 (lvHi): a solid grey shape is rastered at its 8-bit level; this takes the step back out (exact level, as AE's float maths)
const lvK = s => { if (!D.p.lvHi || hiFill(s) || !s || s.fill !== 'solid' || s.ov || s.vsrc || !(typeof s.lv === 'number')) return 1; const v = clamp(s.lv, 0, 1), q = Math.round(v * 255); return q > 0 ? v * 255 / q : 1; };
function prepareSource(P, shapes, k0) {
  const cw = D.comp.w, ch = D.comp.h, maxD = !D.en.bands ? 0 : P.rOn ? refrReach(P) : Math.max(Math.abs(P.dMaxH), Math.abs(P.dMaxV));
  const ok = s => s && s.op > 0 && s.pts && s.pts.length >= 2 && Math.abs(s.s * s.sx) > 1e-6 && Math.abs(s.s * s.sy) > 1e-6;
  const byId = new Map(shapes.map(s => [s.id, s]));
  // r3: a track matte that is there but shows nothing (opacity or scale 0) hides its layer (as in AE); an inverted one shows all of it
  const matteEmpty = s => { if (!s.matte || s.matte === s.id || s.blend === 'clip') return false; const m = byId.get(s.matte); return !!m && !ok(m) && s.mmode !== 'alphaInv' && s.mmode !== 'lumaInv'; };
  const vis = shapes.filter(s => s.on && ok(s) && !matteEmpty(s));
  // a shape used as another's track matte is not drawn itself (as in AE) but is still made, even when hidden
  const matteOf = s => (s.matte && s.matte !== s.id && ok(byId.get(s.matte))) ? byId.get(s.matte) : null;
  const usedAsMatte = new Set(shapes.filter(s => s.on).map(matteOf).filter(Boolean).map(m => m.id));   // r28: hidden whenever a shown layer uses it, even while that one is at scale / opacity 0 (it used to flash up then)
  const drawn = vis.filter(s => !usedAsMatte.has(s.id) && s.blend !== 'clip'), clips = vis.filter(s => !usedAsMatte.has(s.id) && s.blend === 'clip');
  const need = new Map(); for (const s of [...drawn, ...clips]) { need.set(s.id, s); const m = matteOf(s); if (m && s.blend !== 'clip') need.set(m.id, m); }
  const lays = new Map();
  { const made = new Map();   // ds (2026-11-02): a shape whose layer is the same as one made this frame (a matte twin) shares it: one raster, one blur
    for (const s of need.values()) {
      const L = layerGeo(s, P, k0, maxD), rs = layerRS(s, L, P), key = rs + '|' + (L.sH * L.kx).toFixed(4) + '|' + (L.sV * L.ky).toFixed(4), o = made.get(key);
      if (o) { lays.set(s.id, Object.assign(L, { tex: o.L.tex, ver: o.id + '#' + o.L.ver })); continue; }
      const B = buildLayer(s.id, s, L, P, rs); lays.set(s.id, B); made.set(key, { id: s.id, L: B });
    } }
  // the strokes masked to one shape (made even when that shape is hidden): its coverage, blurred by the inward feather.
  // r21: as it shows, too: its own track matte applies, and so do the Cut out shapes above it (then it is stacked like the layer)
  let smask = null, smList = null;
  const keep = new Set(need.keys());
  const msh = P.sMask && (D.en.strokes || D.view.mode === 'strokes' || D.view.mode === 'mask' || (D.en.color && (P.soOn || P.so2On))) ? byId.get(P.sMask) : null;
  if (msh && msh.pts && msh.pts.length >= 2 && Math.abs(msh.s * msh.sx) > 1e-6 && Math.abs(msh.s * msh.sy) > 1e-6) {
    const own = !!P.sMaskOwn, F = own ? 0 : Math.max(0, +P.sFeather || 0), m = Object.assign({}, msh, own ? {} : { bh: F, bv: F }, { op: 1, fill: 'solid', lv: 1, ov: false, vsrc: '', gn: 0 });   // sigma = feather / 2 (BLUR_SIGMA); r3: or the shape's own blur
    const L = buildLayer('smask', m, layerGeo(m, P, k0, maxD), P); keep.add('smask');
    const mt = matteOf(msh), idx = shapes.findIndex(x => x.id === msh.id), cuts = shapes.slice(idx + 1).filter(x => x.on && ok(x) && x.blend === 'subtract');
    if (!mt && !cuts.length) smask = { tex: L.tex, rect: L.rect, feather: F > 0, op: clamp(msh.op, 0, 1) };
    else {
      for (const x of [mt, ...cuts]) if (x) { keep.add(x.id); if (!lays.has(x.id)) lays.set(x.id, buildLayer(x.id, x, layerGeo(x, P, k0, maxD), P)); }
      lays.set('smask', L); smList = [{ id: 'smask', blend: 'normal', matte: mt ? mt.id : '', mmode: msh.mmode }, ...cuts]; smask = { feather: F > 0, op: clamp(msh.op, 0, 1) };
    }
  } else if (msh) smask = { empty: true, feather: false, op: 0 };   // r3: the mask shape is there but has no size (scale 0): nothing shows
  // r6: the mask feather (Colorama): the chosen shape's outline (its keys, its opacity; its own blur replaced by the feather)
  let cmask = null;
  const cmsh = P.cMask && D.en.color ? byId.get(P.cMask) : null;
  if (cmsh && cmsh.pts && cmsh.pts.length >= 2 && Math.abs(cmsh.s * cmsh.sx) > 1e-6 && Math.abs(cmsh.s * cmsh.sy) > 1e-6) {
    const F = Math.max(0, +P.cMaskF || 0), m = Object.assign({}, cmsh, { bh: F, bv: F, op: 1, fill: 'solid', lv: 1, ov: false, vsrc: '', gn: 0, matte: '', imode: 'alpha' });
    const L = buildLayer('cmask', m, layerGeo(m, P, k0, 0), P); keep.add('cmask'); cmask = { tex: L.tex, rect: L.rect, op: clamp(cmsh.op, 0, 1) };
  } else if (cmsh) cmask = { empty: true };   // there but with no size: nothing shows
  for (const id of [...GL.layers.keys()]) if (!keep.has(id)) dropLayer(id);
  // one box for the accumulation and the clip: covers every layer, as fine as the sharpest
  let ax = 0, ay = 0, x0 = 0, y0 = 0, x1 = cw, y1 = ch;
  for (const L of lays.values()) { ax = Math.max(ax, L.kx); ay = Math.max(ay, L.ky); x0 = Math.min(x0, L.rect[0]); y0 = Math.min(y0, L.rect[1]); x1 = Math.max(x1, L.rect[0] + L.rect[2]); y1 = Math.max(y1, L.rect[1] + L.rect[3]); }
  if (!lays.size) { ax = ay = Math.min(k0, 0.05); }
  // AE grain (gnk) is one value per pixel: the accumulation is at least as fine as the view (at 1:1, one texel per comp px)
  const aeG = [...drawn, ...clips].some(s => s.gnk && (+s.gn || 0) > 0);
  if (aeG) { ax = Math.max(ax, k0); ay = Math.max(ay, k0); }
  // the box trimmed to what the view reads (the comp, the bands' reach, a cubic read's margin), on the same texel grid: a big blur's
  // padding no longer pushes it past 4096 texels (then coarser than the view, so not 1:1). AE grain, or p.accTrim (the AE converter)
  if (aeG || P.accTrim) {
    const reach = !D.en.bands ? 0 : P.rOn ? maxD : Math.hypot(+P.dMaxH || 0, +P.dMaxV || 0), rx = reach + 3 / ax + 2, ry = reach + 3 / ay + 2;   // (along + across: up to the hypot)
    x1 = Math.min(x1, cw + rx); y1 = Math.min(y1, ch + ry);
    x0 += Math.max(0, Math.floor((-rx - x0) * ax)) / ax; y0 += Math.max(0, Math.floor((-ry - y0) * ay)) / ay;
  }
  let aw = Math.max(8, Math.ceil((x1 - x0) * ax)), ah = Math.max(8, Math.ceil((y1 - y0) * ay));
  if (aw > 4096) { ax *= 4096 / aw; aw = 4096; }
  if (ah > 4096) { ay *= 4096 / ah; ah = 4096; }
  const rect = [x0, y0, aw / ax, ah / ay], ACC = target('ACC', aw, ah);
  const stack = (list, T, sigName) => {
    const sig = JSON.stringify([aw, ah, rect, list.map(s => { const L = lays.get(s.id), m = matteOf(s); return [s.id, L.ver, s.blend, m ? m.id : '', m ? lays.get(m.id).ver : 0, s.mmode, s.gn || 0, s.gnm, s.gnk ? [s.gnk, s.gov, s.gsd, s.gcy, s.gq] : 0, lineOn(s) ? [s.vstops, s.vmode, s.vRep, s.vPh, s.vPost || 0, s.vmode === 'cycle' ? stopsCF(s.vstops) : 0] : 0, lvK(s), hiFill(s) ? fillOf(s) : 0, m && hiFill(m) ? fillOf(m) : 0]; })]);
    if (sig === GL[sigName]) return; GL[sigName] = sig;
    gl.bindFramebuffer(gl.FRAMEBUFFER, T.f); gl.viewport(0, 0, aw, ah); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (!list.length) return;
    let pr = null; gl.enable(gl.BLEND);
    const use = q => { if (pr === q) return; pr = q; gl.useProgram(pr.p); U4(pr, 'uDst', rect[0], rect[1], rect[2], rect[3]); U2(pr, 'uDstSize', aw, ah); UI(pr, 'uT', 0); UI(pr, 'uM', 1); };
    for (const s of list) {
      const ag = s.gnk && (+s.gn || 0) > 0 ? aeGrain(s) : null; use(ag ? (GL.pCompAE || (GL.pCompAE = program(FS_COMP_AE))) : GL.pComp);   // AE grain: its own program
      const L = lays.get(s.id), m = s.blend === 'clip' ? null : matteOf(s), b = BLENDS[s.blend] || BLENDS.normal;
      gl.blendFunc(gl[b[0]], gl[b[1]]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, L.tex);
      U4(pr, 'uSrc', L.rect[0], L.rect[1], L.rect[2], L.rect[3]); U2(pr, 'uSrcSize', L.rw, L.rh); UI(pr, 'uCubic', (L.kx < ax * 0.99 || L.ky < ay * 0.99) ? 1 : 0);
      if (m) {
        const M = lays.get(m.id); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, M.tex);
        UI(pr, 'uMat', MATTE[s.mmode] || 1); U4(pr, 'uMSrc', M.rect[0], M.rect[1], M.rect[2], M.rect[3]); U2(pr, 'uMSize', M.rw, M.rh); UI(pr, 'uMCubic', (M.kx < ax * 0.99 || M.ky < ay * 0.99) ? 1 : 0);
      } else { UI(pr, 'uMat', 0); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, L.tex); }
      { const f = hiFill(s) ? fillOf(s) : null, mf = m && hiFill(m) ? fillOf(m) : null;   // r3: sHiP
        UI(pr, 'uFillOn', f ? 1 : 0); if (f) U4(pr, 'uFill', f[0], f[1], f[2], f[3]); UI(pr, 'uMFillOn', mf ? 1 : 0); if (mf) U4(pr, 'uMFill', mf[0], mf[1], mf[2], mf[3]); }
      U1(pr, 'uGAmt', Math.max(0, +s.gn || 0) / 100); UI(pr, 'uGMode', GRAIN[s.gnm] || 4); U1(pr, 'uGSeed', seedOf(s.id)); U1(pr, 'uGOp', clamp(+s.op || 0, 0, 1));   // r3: grain, the layer's own colour line
      U1(pr, 'uLvK', lvK(s));   // r4
      if (ag) { UI(pr, 'uGKind', ag.kind); UI(pr, 'uGOvf', ag.ovf); UI(pr, 'uGSeedI', ag.seed); U1(pr, 'uGPh', ag.ph); UI(pr, 'uGCyc', ag.cyc); U1(pr, 'uGA0', ag.a0); }   // AE Noise Alpha's exact field
      const lo = lineOn(s) && GL.layers.has(s.id); UI(pr, 'uLineOn', lo ? 1 : 0); UI(pr, 'uLine', 2);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, lo ? layerLine(GL.layers.get(s.id), s) : GL.lut);
      U1(pr, 'uLRep', +s.vRep || 0); U1(pr, 'uLPh', (+s.vPh || 0) / 360); UI(pr, 'uLCyc', s.vmode === 'cycle' ? 1 : 0); U1(pr, 'uLPost', Math.max(0, Math.round(+s.vPost || 0)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  };
  const sep = D.en.bands, ovL = drawn.filter(s => s.ov), nbL = sep ? drawn.filter(s => !s.ov && s.nb) : [];   // r3: over the Colorama / skipping the bands
  stack(drawn.filter(s => !s.ov && !(sep && s.nb)), ACC, 'accSig');
  let nbTex = null, ovTex = null;
  if (nbL.length) { const T = target('ACCNB', aw, ah); stack(nbL, T, 'nbSig'); nbTex = T.t; } else GL.nbSig = '';
  if (ovL.length) { const T = target('ACCOV', aw, ah); stack(ovL, T, 'ovSig'); ovTex = T.t; } else GL.ovSig = '';
  let clipTex = null;
  if (clips.length) { const CL = target('CLIP', aw, ah); stack(clips, CL, 'clipSig'); clipTex = CL.t; } else GL.clipSig = '';
  if (smList) { const SM = target('SMASK', aw, ah); stack(smList, SM, 'smaskSig'); smask.tex = SM.t; smask.rect = rect; } else GL.smaskSig = '';   // the strokes' mask as it shows (r21)
  // r23 (the user: "Feather this mask is only supposed to apply to whatever is being masked by that shape"): with p.cMaskOnly the shapes not
  // masked by the mask's shape (and drawn) are stacked apart: where they are, the feather does not fade the picture.
  // r24 (the user: "that ellipse on top is still getting masked"): what it masks = the layers under it in the stack (the field it cuts) and the ones
  // matted by it; a layer stacked above the mask's shape is on top of it and stays (r23 freed the under ones too, so the field flooded the comp)
  let freeTex = null;
  if (cmask && !cmask.empty && P.cMaskOnly && P.cMask) { const mi = shapes.findIndex(s => s.id === P.cMask); const fl = vis.filter(s => shapes.indexOf(s) > mi && !usedAsMatte.has(s.id) && s.blend !== 'clip' && (matteOf(s) || {}).id !== P.cMask); const T = target('FREE', aw, ah); stack(fl, T, 'freeSig'); freeTex = T.t; } else GL.freeSig = '';
  INFO.rw = aw; INFO.rh = ah; INFO.layers = lays.size; INFO.ov = ovL.map(s => s.id + (matteOf(s) ? '>' + matteOf(s).id : '')).join(' '); INFO.nb = nbL.length;
  return { tex: ACC.t, clipTex, nbTex, ovTex, smask, cmask, freeTex, w: aw, h: ah, rect, cubic: (k0 > ax * 1.01 || k0 > ay * 1.01) ? 1 : 0 };
}

// a shape's fill: solid grey, or a black -> white gradient (linear at an angle, or radial) across its own box
const grey = v => { const L = Math.round(clamp(v, 0, 1) * 255); return 'rgb(' + L + ',' + L + ',' + L + ')'; };
function shapeFill(ctx, s) {
  if (s.fill !== 'linear' && s.fill !== 'radial') return grey(s.lv);
  const [x0, y0, x1, y1] = localBBox(s.pts, s.closed), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = Math.max(1e-3, (x1 - x0) / 2), hy = Math.max(1e-3, (y1 - y0) / 2);
  let g;
  if (s.fill === 'linear') {
    const a = s.ga * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), L = Math.max(1e-3, (Math.abs(hx * dx) + Math.abs(hy * dy)) * s.gs);
    g = ctx.createLinearGradient(cx - dx * L, cy - dy * L, cx + dx * L, cy + dy * L);
  } else g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1e-3, Math.hypot(hx, hy) * s.gs));
  if (s.gc > 0) {   // r29: cycling bands: start level -> end level -> start…, sliding by the phase (+ speed x time)
    const ph = s.gp + s.gv * aliveT();   // r32: on the alive clock
    for (let i = 0; i <= 48; i++) { const u = i / 48, k = 0.5 + 0.5 * Math.cos(2 * Math.PI * (u * s.gc - ph)); g.addColorStop(u, grey(s.lv2 + (s.lv - s.lv2) * k)); }
  } else { g.addColorStop(0, grey(s.lv)); g.addColorStop(1, grey(s.lv2)); }
  return g;
}

let live = 0, frameNo = 0;
const FXBUF = new Float32Array(48 * 4);
const STATS = { frames: 0, cpu: 0, t: performance.now() };
function renderComp(dest, alphaOut) {   // r6: one comp (D) into dest (null = the canvas)
  const t0 = performance.now();
  const P = evalParams(), shapes = D.shapes.map(evShape).map(s => aliveShape(s, aliveT()));
  syncVideos(shapes);   // r3   // r29-30 (r32: on the alive clock, never cut by a loop): alive (breath, pulse, drift, blur variance); the overlay keeps the still shape
  const zP = +P.pZoom > 0 ? +P.pZoom : 1, dpr = cv.width / Math.max(1, VW.w), k0 = VW.z * zP * dpr;   // ds (2026-10-30): Post · Zoom (round the comp's middle)
  const kS = typeof OPT === 'object' && OPT && +OPT.srcBudget > 0 ? Math.min(k0, Math.sqrt(+OPT.srcBudget / (D.comp.w * D.comp.h))) : k0;   // ds (2026-11-02): the shapes' pass capped (player opts.srcBudget, comp px); the bands pass stays at k0
  const src = prepareSource(P, shapes, kS);
  const hiP = P.cHiP !== false, ls = JSON.stringify([P.stops, P.cInterp, P.cSpace, +P.cSmooth || 0, hiP, P.cMode, P.cMode === 'cycle' ? stopsCF(P.stops) : 0]);
  if (ls !== lutSig) {
    lutSig = ls; const data = bakeLut(P); gl.bindTexture(gl.TEXTURE_2D, GL.lut);
    if (hiP) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, LUT_N, 1, 0, gl.RGBA, gl.FLOAT, lutHi);   // r2: a 16-bit line (no 8-bit steps in a long soft stretch)
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, LUT_N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    lutChanged();
  }
  const pr = GL.pMain;
  gl.bindFramebuffer(gl.FRAMEBUFFER, dest ? dest.f : null); gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(pr.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tex); UI(pr, 'uSrc', 0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, GL.lut); UI(pr, 'uLut', 1);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, src.clipTex || src.tex); UI(pr, 'uClip', 2); UI(pr, 'uClipOn', src.clipTex ? 1 : 0);
  gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, src.smask && !src.smask.empty ? src.smask.tex : src.tex); UI(pr, 'uSMask', 3); UI(pr, 'uSMaskOn', src.smask ? 1 : 0);
  if (src.smask && src.smask.empty) U4(pr, 'uSMRect', -1e6, -1e6, 1, 1);   // r3: reads 0 everywhere
  else if (src.smask) { const r = src.smask.rect; U4(pr, 'uSMRect', r[0], r[1], r[2], r[3]); UI(pr, 'uSMFeather', src.smask.feather ? 1 : 0); }
  gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, src.nbTex || src.tex); UI(pr, 'uNB', 4); UI(pr, 'uNBOn', src.nbTex ? 1 : 0);   // r3
  gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, src.ovTex || src.tex); UI(pr, 'uOV', 5); UI(pr, 'uOVOn', src.ovTex && D.en.color ? 1 : 0); U1(pr, 'uOVOp', P.ovOp == null ? 1 : clamp(+P.ovOp, 0, 1));
  { const q = P.ovClip, on = q && q.on !== false && +q.w > 0 && +q.h > 0; U4(pr, 'uOVClip', on ? +q.x || 0 : 0, on ? +q.y || 0 : 0, on ? +q.w : 0, on ? +q.h : 0); }
  U1(pr, 'uSMOp', src.smask && src.smask.op != null ? src.smask.op : 1);   // r2: the strokes fade with their mask shape's opacity
  U2(pr, 'uView', cv.width, cv.height); U2(pr, 'uOrig', (VW.ox + D.comp.w * VW.z * (1 - zP) / 2) * dpr, (VW.oy + D.comp.h * VW.z * (1 - zP) / 2) * dpr); U1(pr, 'uZ', k0);
  U2(pr, 'uComp', D.comp.w, D.comp.h);
  U4(pr, 'uRast', src.rect[0], src.rect[1], src.rect[2], src.rect[3]); U2(pr, 'uSrcSize', src.w, src.h); UI(pr, 'uCubic', src.cubic);
  U1(pr, 'uLbg', P.lbg); U3(pr, 'uPaste', window.RZS_EXPORT ? hex2rgb(P.cBgCol) : [10 / 255, 10 / 255, 10 / 255]); UI(pr, 'uAlphaOut', alphaOut ? 1 : 0); UI(pr, 'uStraight', +P.cStraight >= 0.5 ? 1 : 0); U1(pr, 'uStraightK', clamp(+P.cStraight || 0, 0, 1));   // r4
  const I = patternInfo(P), pix = 1 / Math.max(k0, 1e-4);
  UV(pr, 'uPCum', I.cum, 9); UV(pr, 'uPInt', I.ints, 9); UV(pr, 'uPR', I.R, 8); UV(pr, 'uPLo', I.LO, 8); UV(pr, 'uPHi', I.HI, 8); UV(pr, 'uPPl', I.PL, 8);
  UI(pr, 'uPN', I.n); U1(pr, 'uPer', I.per); U1(pr, 'uPTot', I.tot); U1(pr, 'uCenter', P.dKeep ? I.mean : 0.5);
  { const ag = P.bAng * Math.PI / 180, soft = Math.hypot(P.bSoftH * Math.cos(ag), P.bSoftV * Math.sin(ag));   // an H / V blur of the map = this much across the bands
    U1(pr, 'uHalf', Math.max(soft * 0.5, pix * 0.5)); } U1(pr, 'uPix', pix * 0.5);
  const a = P.bAng * Math.PI / 180;
  U2(pr, 'uAcross', Math.cos(a), Math.sin(a)); U2(pr, 'uAlong', -Math.sin(a), Math.cos(a));
  U1(pr, 'uBOff', P.bOff + P.bDrift * live); U1(pr, 'uBLo', P.bLo); U1(pr, 'uBHi', P.bHi); UI(pr, 'uBInv', P.bInv ? 1 : 0); U2(pr, 'uBPh', P.bPhG, P.bPhB);
  { const list = (P.fx || []).filter(f => f.on && FX[f.t]).slice(0, FX_MAX); FXBUF.fill(0); list.forEach((f, k) => FX[f.t].pack(f.v, FXBUF, k * 24));
    UI(pr, 'uFxN', list.length); if (pr.u.uFx) gl.uniform4fv(pr.u.uFx, FXBUF); }
  const mW = P.mapW > 0 ? P.mapW : D.comp.w, mH = P.mapH > 0 ? P.mapH : D.comp.h;
  U4(pr, 'uMap', D.comp.w / 2 + P.mapX - mW / 2, D.comp.h / 2 + P.mapY - mH / 2, mW, mH);
  UI(pr, 'uBeh', P.dBeh === 'stretch' ? 1 : P.dBeh === 'tile' ? 2 : 0); UI(pr, 'uDClip', P.dClip ? 1 : 0);
  { const bx = P.mapBoxOn && Array.isArray(P.mapBox) && P.mapBox.length === 4 ? P.mapBox : null;   // r3: where the map layer ends (from AE)
    UI(pr, 'uMBox', bx ? 1 : 0); U4(pr, 'uMBoxR', bx ? +bx[0] : 0, bx ? +bx[1] : 0, bx ? +bx[2] : 0, bx ? +bx[3] : 0); U1(pr, 'uMBoxE', 0.5 * pix * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))) * 0.999); }
  UI(pr, 'uBands', D.en.bands ? 1 : 0); UI(pr, 'uChH', CHI[P.dChH] ?? 0); UI(pr, 'uChV', CHI[P.dChV] ?? 1);
  UI(pr, 'uWrap', P.dWrap ? 1 : 0); UI(pr, 'uSpace', P.dSpace === 'band' ? 1 : 0); U1(pr, 'uMaxH', P.dMaxH); U1(pr, 'uMaxV', P.dMaxV); U1(pr, 'uFlip', P.dFlip ? -1 : 1);
  UI(pr, 'uStrokes', D.en.strokes ? 1 : 0); UV(pr, 'uSEM', (P.sEdges || []).map(v => v ? 1 : 0), 16);
  UI(pr, 'uSSide', P.sSide === 'after' ? 1 : P.sSide === 'before' ? 2 : 0);
  UI(pr, 'uSBlend', ({ screen: 0, add: 1, lighten: 2, darken: 3 })[P.sBlend] ?? 0); UI(pr, 'uSFollow', P.sFollow ? 1 : 0); UI(pr, 'uSInv', P.sInv ? 1 : 0);
  U1(pr, 'uSW', P.sWidth); U1(pr, 'uSGrad', P.sGrad); U1(pr, 'uSOff', P.sOff); U1(pr, 'uSInt', P.sInt); U1(pr, 'uSChoke', P.sChoke); U1(pr, 'uSSoft', P.sSoft);
  UI(pr, 'uColor', D.en.color ? 1 : 0); UI(pr, 'uFrom', P.cFrom === 'alpha' ? 1 : P.cFrom === 'zero' ? 2 : 0); UI(pr, 'uOut', P.cOut === 'opaque' ? 1 : 0);
  U1(pr, 'uPhase', (+P.cShift || 0) + (P.cMode === 'cycle' ? (+P.cPh || 0) / 360 : 0)); U1(pr, 'uRep', P.cRep); UI(pr, 'uCycle', P.cMode === 'cycle' ? 1 : 0); U1(pr, 'uPost', Math.max(0, Math.round(+P.cPost || 0)));   // r3: AE's phase = in x reps + shift / 360, wrapping
  { const on = [P.soOn, P.so2On].map(v => v && D.en.color ? 1 : 0);   // r3: the band overlays
    for (let k = 0; k < 2; k++) { const tx = on[k] ? soTex(P, k, I.per) : null; if (!tx) on[k] = 0; gl.activeTexture(k ? gl.TEXTURE7 : gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, tx || GL.lut); }
    UI(pr, 'uSOT0', 6); UI(pr, 'uSOT1', 7); UI(pr, 'uSOOn', on[0] || on[1] ? 1 : 0); if (pr.u.uSOL) gl.uniform2i(pr.u.uSOL, on[0], on[1]);
    for (let k = 0; k < 2; k++) { const pre = k ? 'so2' : 'so', v = Array.isArray(P[pre + 'V']) ? P[pre + 'V'] : [], img = !!P[pre + 'Img'];
      U4(pr, 'uSOV' + k, img && v[1] > v[0] ? v[0] : 0, img && v[1] > v[0] ? v[1] : 0, v[3] > v[2] ? v[2] : 0, v[3] > v[2] ? v[3] : 0); }
    U2(pr, 'uSOOff', +P.soOff || 0, +P.so2Off || 0); U2(pr, 'uSOOp', clamp(+P.soOp, 0, 1), clamp(+P.so2Op, 0, 1));
    const BM = { normal: 0, screen: 1, add: 2, lighten: 3, multiply: 4, darkerColor: 5 }; if (pr.u.uSOBlend) gl.uniform2i(pr.u.uSOBlend, BM[P.soBlend] ?? 1, BM[P.so2Blend] ?? 1); }
  U1(pr, 'uInLo', P.cInLo); U1(pr, 'uInHi', P.cInHi); U1(pr, 'uInGam', Math.max(0.01, P.cInGam)); U1(pr, 'uBlend', P.cBlend); U3(pr, 'uBgCol', hex2rgb(P.cBgCol));
  UI(pr, 'uMode', Math.max(0, VIEWS.findIndex(v => v[0] === D.view.mode)));
  U1(pr, 'uDither', P.dither); U1(pr, 'uSeed', D.tl.play ? (frameNo % 997) : 0); U1(pr, 'uInDither', +P.cInDither || 0);
  UI(pr, 'uROn', P.rOn ? 1 : 0); UI(pr, 'uRProf', ({ round: 0, soft: 1, ridge: 2, flat: 3 })[P.rProf] ?? 0); UI(pr, 'uRLightShape', P.rLightShape !== false ? 1 : 0); UI(pr, 'uAfter', P.bAfter ? 1 : 0); U1(pr, 'uBOp', P.bOp == null ? 1 : clamp(+P.bOp, 0, 1));
  for (const [u, k] of [['uRDepth', 'rDepth'], ['uRIor', 'rIor'], ['uRBulge', 'rBulge'], ['uRFlat', 'rFlat'], ['uRValley', 'rValley'], ['uRShear', 'rShear'], ['uRDisp', 'rDisp'], ['uRFrost', 'rFrost'], ['uREFrost', 'rEFrost'],
    ['uRHi', 'rHi'], ['uRHiPos', 'rHiPos'], ['uRHiW', 'rHiW'], ['uREdge', 'rEdge'], ['uRShade', 'rShade'], ['uRShW', 'rShW']]) U1(pr, u, +P[k] || 0);
  gl.activeTexture(gl.TEXTURE9); gl.bindTexture(gl.TEXTURE_2D, src.freeTex || src.tex); UI(pr, 'uFree', 9); UI(pr, 'uFreeOn', src.freeTex ? 1 : 0);   // r23
  { const cm = src.cmask; gl.activeTexture(gl.TEXTURE8); gl.bindTexture(gl.TEXTURE_2D, cm && !cm.empty ? cm.tex : src.tex); UI(pr, 'uCM', 8); UI(pr, 'uCMOn', cm ? 1 : 0);   // r6
    if (cm && !cm.empty) U4(pr, 'uCMRect', cm.rect[0], cm.rect[1], cm.rect[2], cm.rect[3]); else U4(pr, 'uCMRect', -1e6, -1e6, 1, 1); U1(pr, 'uCMOp', cm && !cm.empty ? cm.op : 0); UI(pr, 'uCMInv', P.cMaskInv ? 1 : 0); gl.activeTexture(gl.TEXTURE0); }
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  STATS.cpu = performance.now() - t0; STATS.frames++;
}
// r6: the comps, bottom first: each with its own state (rasters, accumulations, colour line), the first on the canvas, the others
// rendered with a clear background and laid over it (normal / screen / add / multiply, times their opacity), all at D's time
const FS_LAYER = `#version 300 es
precision highp float;
uniform sampler2D uT;
uniform float uOp;
out vec4 o;
void main() { o = texelFetch(uT, ivec2(gl_FragCoord.xy), 0) * uOp; }`;
const RC = new Map(), RCKEYS = ['layers', 'ACC', 'ACCNB', 'ACCOV', 'CLIP', 'SMASK', 'FREE', 'accSig', 'nbSig', 'ovSig', 'clipSig', 'smaskSig', 'freeSig', 'lut'];
let rcCur = null;
function useRC(id) {
  if (rcCur && rcCur.id === id) return;
  if (rcCur) { for (const k of RCKEYS) rcCur[k] = GL[k]; rcCur.lutSig = lutSig; rcCur.SOT = [SOT[0], SOT[1]]; }
  let rc = RC.get(id);
  if (!rc) {
    if (!rcCur) { rc = { id }; for (const k of RCKEYS) rc[k] = GL[k]; rc.lutSig = lutSig; rc.SOT = [SOT[0], SOT[1]]; }   // the first: what is already there
    else rc = { id, layers: new Map(), ACC: null, ACCNB: null, ACCOV: null, CLIP: null, SMASK: null, FREE: null, freeSig: '', accSig: '', nbSig: '', ovSig: '', clipSig: '', smaskSig: '', lut: newTex(), lutSig: '', SOT: [{ sig: '', tex: null, ok: false }, { sig: '', tex: null, ok: false }] };
    RC.set(id, rc);
  }
  for (const k of RCKEYS) GL[k] = rc[k]; lutSig = rc.lutSig; SOT[0] = rc.SOT[0]; SOT[1] = rc.SOT[1]; rcCur = rc;
}
function freeRC(rc) {   // a comp that is gone: its GPU state goes too
  for (const R of rc.layers.values()) { gl.deleteTexture(R.raw); if (R.line) gl.deleteTexture(R.line); for (const n of ['A', 'B']) if (R[n]) { gl.deleteTexture(R[n].t); gl.deleteFramebuffer(R[n].f); } }
  for (const n of ['ACC', 'ACCNB', 'ACCOV', 'CLIP', 'SMASK', 'FREE']) if (rc[n]) { gl.deleteTexture(rc[n].t); gl.deleteFramebuffer(rc[n].f); }
  if (rc.lut) gl.deleteTexture(rc.lut); for (const T of rc.SOT) if (T.tex) gl.deleteTexture(T.tex);
  const L = GL['COMP_' + rc.id]; if (L) { gl.deleteTexture(L.t); gl.deleteFramebuffer(L.f); delete GL['COMP_' + rc.id]; }
}
const LAYER_BLEND = { normal: ['ONE', 'ONE_MINUS_SRC_ALPHA'], screen: ['ONE', 'ONE_MINUS_SRC_COLOR'], add: ['ONE', 'ONE'], multiply: ['DST_COLOR', 'ONE_MINUS_SRC_ALPHA'] };
function layOver(T, op, blend, dst) {   // (dst: a target to lay it on; the canvas by default)
  const pr = GL.pLayer || (GL.pLayer = program(FS_LAYER)), b = LAYER_BLEND[blend] || LAYER_BLEND.normal;
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.f : null); gl.viewport(0, 0, dst ? dst.w : cv.width, dst ? dst.h : cv.height); gl.useProgram(pr.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T.t); UI(pr, 'uT', 0); U1(pr, 'uOp', clamp(op, 0, 1));
  gl.enable(gl.BLEND); gl.blendFunc(gl[b[0]], gl[b[1]]); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
const WARM = new Set();   // ds: comps drawn once (their first draw is the costly one)
function render() {
  if (!gl || glLost) return;
  VID_USED.clear();
  const list = typeof compList === 'function' ? compList() : [{ id: 'root', doc: D, op: 1, blend: 'normal' }];
  const act = typeof CL === 'object' && CL.i > 0 && rootDoc().stack ? (rootDoc().stack[CL.i - 1] || {}).id || 'root' : 'root';
  // r17 Post · Opacity: Base's fades the whole effect (the canvas, so every comp and nothing else); another comp's multiplies its layer
  const pOpOf = d => { const tr = d.K && d.K.pOp, v = tr && tr.length ? evalTrack(tr, d.tl.t) : d.p.pOp; return v == null || !isFinite(+v) ? 1 : clamp(+v, 0, 1); };
  let whole = 1;
  if (list.length <= 1 || D.view.mode !== 'final') { useRC(list.length > 1 ? act : 'root'); renderComp(null, GL_ALPHA); if (D.view.mode === 'final' && list.length <= 1) whole = pOpOf(D); }   // one comp (or a look at the one being edited)
  else {
    const keep = D, t = D.tl.t, play = D.tl.play;
    // ds (2026-11-03): a comp set to 'under' sits under the first one (a loader over the remnant it lands as): the first one is drawn with a
    // clear background into its own target, the 'under' comps go on the canvas first (on the first one's ground colour when the page is opaque)
    const under = list.some((c, i) => i > 0 && c.blend === 'under'), later = []; let rootT = null, bg = null;
    // ds (2026-11-03): the page's per-comp opacity and clock (player comp()): a root at 0 isn't drawn, one in between goes through its target
    // like 'under'; a comp on its own clock keeps the one alive clock (aliveT() would restart it from that comp's time)
    // ds (2026-11-03, patch 9): groups (a stack entry's grp; the page's group(name, { op, blend })): each put together on its own, then laid
    const GR = rootDoc()._groups || {}, gOp = n => GR[n] && GR[n].op != null ? clamp(+GR[n].op, 0, 1) : 1;
    const grouped = list.some(c => c.g && c.g !== 'main') || gOp('main') < 0.9995;
    const rootOp = clamp(+list[0].op, 0, 1), viaT = under || rootOp < 0.9995 || grouped, al = aliveT(), ox0 = VW.ox, oy0 = VW.oy;
    if (grouped) {   // patch 12: group by group through two shared buffers, or straight onto the canvas when one group shows alone
      const run = (c, i, f) => { const d = c.doc, vm = d.view.mode, own = c.t != null && isFinite(c.t), ownA = i > 0 && c.al != null && isFinite(c.al); D = d;
        try {
          if (D !== keep) { D.tl.t = own ? clamp(+c.t, 0, D.tl.dur) : t; D.tl.play = play; D.view.mode = 'final'; }   // the shared clock (or the comp's own)
          ALIVE.t = D.tl.t; ALIVE.ofs = (ownA ? +c.al : al) - D.tl.t;   // the one alive clock (or the comp's own)
          useRC(c.id); if (typeof compPath === 'function') compPath(c);
          const gg = GR[c.g || 'main']; VW.ox = ox0 + ((gg && gg.dx) || 0); VW.oy = oy0 + ((gg && gg.dy) || 0);
          return f();
        } finally { d.view.mode = vm; D = keep; } };
      whole = pOpOf(keep); const bg = hex2rgb(keep.p.cBgCol || '#ffffff');
      const names = ['main']; for (const c of list) if (c.g && !names.includes(c.g)) names.push(c.g);
      const plan = names.map(n => ({ n, go: gOp(n), gb: (GR[n] && GR[n].blend) || 'normal', m: list.map((c, i) => [c, i]).filter(([c]) => (c.g || 'main') === n) })).filter(q => q.go > 1e-4);
      const single = plan.length === 1 && plan[0].go >= 0.9995 && (plan[0].gb === 'add' || plan[0].gb === 'normal');
      const SCR = () => target('COMP_SCR', cv.width, cv.height);
      const clearTo = (T, opaque) => { gl.bindFramebuffer(gl.FRAMEBUFFER, T ? T.f : null); gl.viewport(0, 0, cv.width, cv.height); if (opaque) gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.clearColor(0, 0, 0, 0); };
      let onCanvas = false; const canvasReady = () => { if (!onCanvas) { clearTo(null, !GL_ALPHA); onCanvas = true; } };
      try {
        for (const q of plan) {
          const vis = q.m.filter(([c, i]) => (i === 0 ? rootOp : c.op) > 1e-4), GT = !single && vis.length > 1 ? target('GRP_ACC', cv.width, cv.height) : null;
          if (GT) clearTo(GT, false);
          for (const [c, i] of vis) run(c, i, () => {
            const o = i === 0 ? rootOp : c.op * pOpOf(D); if (!(o > 1e-4)) return;
            if (single && i === 0 && o >= 0.9995 && !onCanvas) { renderComp(null, GL_ALPHA); onCanvas = true; WARM.add(c.id); return; }   // (alone: the root straight onto the canvas)
            const T = SCR(); renderComp(T, true); WARM.add(c.id);
            if (GT) layOver(T, o, c.blend, GT); else { canvasReady(); layOver(T, single ? o : o * q.go, single ? c.blend : q.gb); }
          });
          if (GT) { canvasReady(); layOver(GT, q.go, q.gb); }
        }
        canvasReady();
        list.forEach((c, i) => { if (i > 0 && !WARM.has(c.id)) run(c, i, () => { renderComp(SCR(), true); WARM.add(c.id); }); });   // comps not drawn yet: once, unseen (no hitch when they show)
      } finally { D = keep; ALIVE.t = D.tl.t; ALIVE.ofs = al - D.tl.t; if (typeof compPath === 'function') compPath(null); VW.ox = ox0; VW.oy = oy0; }
    } else {
    try {
      list.forEach((c, i) => {
        D = c.doc; const vm = D.view.mode, own = c.t != null && isFinite(c.t), ownA = i > 0 && c.al != null && isFinite(c.al);
        if (D !== keep) { D.tl.t = own ? clamp(+c.t, 0, D.tl.dur) : t; D.tl.play = play; D.view.mode = 'final'; }   // the shared clock (or the comp's own)
        if (own || ownA) { ALIVE.t = D.tl.t; ALIVE.ofs = (ownA ? +c.al : al) - D.tl.t; }
        useRC(c.id); if (typeof compPath === 'function') compPath(c);   // (patch 10: the player's per-comp path clock)
        const go = gOp(c.g || 'main'), gg = GR[c.g || 'main']; VW.ox = ox0 + ((gg && gg.dx) || 0); VW.oy = oy0 + ((gg && gg.dy) || 0);   // (patch 11: the group's place)
        try { if (i === 0) { bg = D.p.cBgCol; if (viaT) { if (rootOp > 1e-4 && go > 1e-4) { rootT = target('COMP_ROOT', cv.width, cv.height); renderComp(rootT, true); } } else renderComp(null, GL_ALPHA); whole = pOpOf(D); } else { const o = c.op * pOpOf(D), w = WARM.has(c.id); if ((o > 1e-4 && go > 1e-4) || !w) { const T = target('COMP_' + c.id, cv.width, cv.height); renderComp(T, true); if ((o > 1e-4 && go > 1e-4) || !w) { if (viaT) later.push([T, o, c.blend, c.g || 'main']); else layOver(T, o, c.blend); } WARM.add(c.id); } } }   // ds (2026-11-02): a comp showing nothing isn't drawn (after once: its layers made, no hitch when it shows)
        finally { D.view.mode = vm; }
      });
    } finally { D = keep; ALIVE.t = D.tl.t; ALIVE.ofs = al - D.tl.t; if (typeof compPath === 'function') compPath(null); VW.ox = ox0; VW.oy = oy0; }
    if (viaT) {
      const g = hex2rgb(bg || '#ffffff'); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(GL_ALPHA ? 0 : g[0], GL_ALPHA ? 0 : g[1], GL_ALPHA ? 0 : g[2], GL_ALPHA ? 0 : 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.clearColor(0, 0, 0, 0);
      if (!grouped) {
        for (const [T, o, b] of later) if (b === 'under') layOver(T, o, 'normal');
        if (rootT) layOver(rootT, rootOp, 'normal');
        for (const [T, o, b] of later) if (b !== 'under') layOver(T, o, b);
      } else {
        const names = ['main']; for (const c of list) if (c.g && !names.includes(c.g)) names.push(c.g);
        for (const n of names) {
          const go = gOp(n), gb = (GR[n] && GR[n].blend) || 'normal'; if (go <= 1e-4) continue;
          const parts = [...later.filter(x => x[3] === n && x[2] === 'under').map(x => [x[0], x[1], 'normal']), ...(n === 'main' && rootT ? [[rootT, rootOp, 'normal']] : []), ...later.filter(x => x[3] === n && x[2] !== 'under')].filter(x => x[1] > 1e-4);
          if (!parts.length) continue;
          if (parts.length === 1) { layOver(parts[0][0], parts[0][1] * go, gb); continue; }   // (one comp: it is the group)
          const GT = target('GRP_' + n, cv.width, cv.height); gl.bindFramebuffer(gl.FRAMEBUFFER, GT.f); gl.viewport(0, 0, cv.width, cv.height); gl.clear(gl.COLOR_BUFFER_BIT);
          for (const [T, o, b] of parts) layOver(T, o, b, GT);
          layOver(GT, go, gb);
        }
      }
    }
    }   // (patch 12: the way without groups)
  }
  { const o = whole >= 0.9995 ? '' : String(Math.round(whole * 1000) / 1000); if (cv.style.opacity !== o) cv.style.opacity = o; }
  vidCleanup();
  if (RC.size > list.length + 1) for (const [id, rc] of [...RC]) if (!list.some(c => c.id === id) && id !== act && rc !== rcCur) { freeRC(rc); RC.delete(id); }
}
