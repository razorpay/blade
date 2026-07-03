export const FLUID_GRADIENT_LOOP = 12.0;

// vec3 c0 = vec3(0.55, 0.95, 0.75);
// vec3 c1 = vec3(0.35, 0.90, 0.65);
// vec3 c2 = vec3(0.20, 0.88, 0.70);
// vec3 c3 = vec3(0.08, 0.82, 0.48);
// vec3 c4 = vec3(0.04, 0.68, 0.30);

// vec3 c0 = vec3(0.72, 0.92, 1.00); // light sky blue
// vec3 c1 = vec3(0.38, 0.72, 0.98); // cornflower blue
// vec3 c2 = vec3(0.16, 0.50, 0.92); // medium blue
// vec3 c3 = vec3(0.08, 0.30, 0.78); // deep royal blue
// vec3 c4 = vec3(0.10, 0.28, 0.72); // deep blue (not black)

export const fragmentShader = /* glsl */ `
precision mediump float;

uniform float uTime;    // pre-wrapped: mod(raw, LOOP)
uniform vec2  iResolution;
uniform vec2  uOrigin;  // gradient origin in UV space (0,0)=top-left (1,1)=bottom-right
varying vec2 vUv;

// Cubic smoothstep inside each segment — no kink at stop boundaries
vec3 gradientColor(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c0 = vec3(0.682, 0.957, 0.831);  // 174, 244, 212
  vec3 c1 = vec3(0.310, 0.882, 0.620);  //  79, 225, 158
  vec3 c2 = vec3(0.306, 0.973, 0.910);  //  78, 248, 232
  vec3 c3 = vec3(0.004, 0.753, 0.443);  //   1, 192, 113
  vec3 c4 = vec3(0.004, 0.753, 0.443);  //   1, 192, 113
  float s;
  if (t < 0.25) { s = smoothstep(0.0,1.0, t/0.25);         return mix(c0,c1,s); }
  if (t < 0.55) { s = smoothstep(0.0,1.0,(t-0.25)/0.30);   return mix(c1,c2,s); }
  if (t < 0.80) { s = smoothstep(0.0,1.0,(t-0.55)/0.25);   return mix(c2,c3,s); }
                  s = smoothstep(0.0,1.0,(t-0.80)/0.20);   return mix(c3,c4,s);
}

// Value noise
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

void main() {
  // Envelope controls: how the gradient fades from center outward
  const float FADE_OUTER_EDGE = 1.4;   // distance where gradient fully fades to black
  const float FADE_INNER_EDGE = 0.4;  // distance where gradient is at full opacity

  vec2 uv = vUv - uOrigin;
  float angle = atan(uv.y, uv.x);
  float r = length(uv);

  // Warp: traces a circle in noise space → exactly periodic in LOOP seconds.
  // speed = 2π * n / LOOP  (n integer → 1 full orbit per loop)
  float ws = 6.2832 / 12.0;   // 2π/LOOP — 1 orbit in LOOP s
  float ws2 = ws * 2.0;       // 2 orbits in LOOP s
  float warp =
    vnoise(vec2(cos(angle)*1.4 + sin(uTime*ws )*2.0, sin(angle)*1.4 + cos(uTime*ws )*2.0)) * 0.50 +
    vnoise(vec2(cos(angle)*2.6 + sin(uTime*ws2)*1.2, sin(angle)*2.6 + cos(uTime*ws2)*1.2)) * 0.25;
  float organicR = r + (warp - 0.45) * 0.04;

  // Three wave sines — speeds are 2π*n/LOOP (n=3,2,1) → integer cycles in LOOP s.
  // Spatial frequencies are irrational ratios so they never phase-lock into
  // distinct bands; the result is one broad, shifting swell.
  float s1 = 6.2832 * 3.0 / 12.0;  // 3 cycles in LOOP s
  float s2 = 6.2832 * 2.0 / 12.0;  // 2 cycles
  float s3 = 6.2832 * 1.0 / 12.0;  // 1 cycle
  float w =
    sin(organicR * 4.80 - uTime * s1) * 0.55 +
    sin(organicR * 2.55 - uTime * s2) * 0.30 +
    sin(organicR * 1.45 - uTime * s3) * 0.15;

  float phase = w * 0.5 + 0.5;
  vec3 color = gradientColor(phase);

  float envelope = smoothstep(FADE_OUTER_EDGE, FADE_INNER_EDGE, r);
  color = color * envelope;

  // Film grain effect
  float grain = hash(vUv * 500.0 + fract(uTime * 0.5)) * 2.0 - 1.0;
  color += grain * 0.0002;

  gl_FragColor = vec4(color, 1.0);
}
`;
