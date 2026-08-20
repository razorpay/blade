/*
 * RazorSense emotional-mode shader.
 *
 * The motion fields, palette stops, flute geometry, and transition timing mirror
 * the authored RazorSense design-language experience. The expensive Canvas2D
 * pixel loop used by the launch site is expressed here as one WebGL pass.
 */

const razorSenseMoodVertexShader = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const razorSenseMoodFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uCalmTexture;
uniform sampler2D uJoyfulTexture;
uniform sampler2D uCautionTexture;
uniform sampler2D uRegretTexture;
uniform vec4 uModeWeights;
uniform float uColorSchemeMix;
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTrailTexture;
uniform vec2 uTrailTexel;

const vec2 DESIGN_SIZE = vec2(1364.0, 440.0);
const float SOURCE_ZOOM = 1.206;
const float EFFECT_OVERSCAN = 1.34;

float srgbToLinearChannel(float value) {
  return value <= 0.04045
    ? value / 12.92
    : pow((value + 0.055) / 1.055, 2.4);
}

float linearToSrgbChannel(float value) {
  return value <= 0.0031308
    ? value * 12.92
    : 1.055 * pow(max(value, 0.0), 1.0 / 2.4) - 0.055;
}

vec3 srgbToLinear(vec3 color) {
  return vec3(
    srgbToLinearChannel(color.r),
    srgbToLinearChannel(color.g),
    srgbToLinearChannel(color.b)
  );
}

vec3 linearToSrgb(vec3 color) {
  return vec3(
    linearToSrgbChannel(color.r),
    linearToSrgbChannel(color.g),
    linearToSrgbChannel(color.b)
  );
}

vec3 blendedStop(vec3 calm, vec3 joyful, vec3 caution, vec3 regret) {
  return srgbToLinear(calm) * uModeWeights.x
    + srgbToLinear(joyful) * uModeWeights.y
    + srgbToLinear(caution) * uModeWeights.z
    + srgbToLinear(regret) * uModeWeights.w;
}

vec3 mixedPalette(float value) {
  float p0 = dot(vec4(0.2828, 0.36, 0.0, 0.0), uModeWeights);
  float p1 = dot(vec4(0.3443, 0.41, 0.127, 0.1066), uModeWeights);
  float p2 = dot(vec4(0.4508, 0.48, 0.4221, 0.3402), uModeWeights);
  float p3 = dot(vec4(0.4918, 0.65, 0.623, 0.5205), uModeWeights);
  float p4 = dot(vec4(0.5697, 0.70, 0.8484, 0.8525), uModeWeights);
  float p5 = dot(vec4(0.6352, 0.79, 1.0, 0.9795), uModeWeights);

  vec3 c0 = blendedStop(
    vec3(0.658824, 0.811765, 0.996078),
    vec3(0.972549),
    vec3(1.0, 0.984314, 0.960784),
    vec3(0.964706, 0.435294, 0.380392)
  );
  vec3 c1 = blendedStop(
    vec3(0.529412, 0.752941, 0.996078),
    vec3(0.839216, 0.960784, 0.854902),
    vec3(1.0, 0.941176, 0.882353),
    vec3(1.0, 0.941176, 0.882353)
  );
  vec3 c2 = blendedStop(
    vec3(0.321569, 0.454902, 1.0),
    vec3(0.772549, 0.941176, 0.843137),
    vec3(1.0, 0.819608, 0.631373),
    vec3(0.984314, 0.827451, 0.776471)
  );
  vec3 c3 = blendedStop(
    vec3(0.380392, 0.533333, 1.0),
    vec3(0.419608, 0.85098, 0.937255),
    vec3(1.0, 0.772549, 0.560784),
    vec3(1.0, 0.745098, 0.631373)
  );
  vec3 c4 = blendedStop(
    vec3(0.666667, 0.811765, 0.972549),
    vec3(0.772549, 0.941176, 0.843137),
    vec3(0.980392, 0.882353, 0.764706),
    vec3(0.964706, 0.435294, 0.380392)
  );
  vec3 c5 = blendedStop(
    vec3(0.8, 0.882353, 0.988235),
    vec3(0.976471, 0.984314, 0.972549),
    vec3(0.992157, 0.670588, 0.34902),
    vec3(1.0, 0.501961, 0.498039)
  );

  if (value <= p0) return linearToSrgb(c0);
  if (value <= p1) return linearToSrgb(mix(c0, c1, clamp((value - p0) / max(p1 - p0, 0.0001), 0.0, 1.0)));
  if (value <= p2) return linearToSrgb(mix(c1, c2, clamp((value - p1) / max(p2 - p1, 0.0001), 0.0, 1.0)));
  if (value <= p3) return linearToSrgb(mix(c2, c3, clamp((value - p2) / max(p3 - p2, 0.0001), 0.0, 1.0)));
  if (value <= p4) return linearToSrgb(mix(c3, c4, clamp((value - p3) / max(p4 - p3, 0.0001), 0.0, 1.0)));
  if (value <= p5) return linearToSrgb(mix(c4, c5, clamp((value - p4) / max(p5 - p4, 0.0001), 0.0, 1.0)));
  return linearToSrgb(c5);
}

vec3 mixedDarkPalette(float value) {
  float p0 = dot(vec4(0.38, 0.42, 0.46, 0.38), uModeWeights);
  float p1 = dot(vec4(0.44, 0.50, 0.54, 0.45), uModeWeights);
  float p2 = dot(vec4(0.50, 0.58, 0.62, 0.52), uModeWeights);
  float p3 = dot(vec4(0.56, 0.66, 0.70, 0.60), uModeWeights);
  float p4 = dot(vec4(0.62, 0.76, 0.80, 0.68), uModeWeights);
  float p5 = dot(vec4(0.70, 0.88, 0.92, 0.78), uModeWeights);

  vec3 c0 = blendedStop(
    vec3(14.0, 19.0, 24.0) / 255.0,
    vec3(14.0, 21.0, 17.0) / 255.0,
    vec3(26.0, 21.0, 16.0) / 255.0,
    vec3(26.0, 18.0, 18.0) / 255.0
  );
  vec3 c1 = blendedStop(
    vec3(15.0, 23.0, 34.0) / 255.0,
    vec3(18.0, 58.0, 43.0) / 255.0,
    vec3(34.0, 24.0, 15.0) / 255.0,
    vec3(32.0, 19.0, 20.0) / 255.0
  );
  vec3 c2 = blendedStop(
    vec3(17.0, 37.0, 72.0) / 255.0,
    vec3(29.0, 96.0, 72.0) / 255.0,
    vec3(78.0, 43.0, 16.0) / 255.0,
    vec3(75.0, 27.0, 26.0) / 255.0
  );
  vec3 c3 = blendedStop(
    vec3(23.0, 60.0, 130.0) / 255.0,
    vec3(59.0, 146.0, 115.0) / 255.0,
    vec3(122.0, 65.0, 16.0) / 255.0,
    vec3(118.0, 37.0, 34.0) / 255.0
  );
  vec3 c4 = blendedStop(
    vec3(40.0, 90.0, 189.0) / 255.0,
    vec3(123.0, 198.0, 163.0) / 255.0,
    vec3(185.0, 107.0, 29.0) / 255.0,
    vec3(176.0, 68.0, 59.0) / 255.0
  );
  vec3 c5 = blendedStop(
    vec3(169.0, 201.0, 238.0) / 255.0,
    vec3(197.0, 234.0, 212.0) / 255.0,
    vec3(245.0, 212.0, 163.0) / 255.0,
    vec3(242.0, 185.0, 177.0) / 255.0
  );

  if (value <= p0) return linearToSrgb(c0);
  if (value <= p1) return linearToSrgb(mix(c0, c1, clamp((value - p0) / max(p1 - p0, 0.0001), 0.0, 1.0)));
  if (value <= p2) return linearToSrgb(mix(c1, c2, clamp((value - p1) / max(p2 - p1, 0.0001), 0.0, 1.0)));
  if (value <= p3) return linearToSrgb(mix(c2, c3, clamp((value - p2) / max(p3 - p2, 0.0001), 0.0, 1.0)));
  if (value <= p4) return linearToSrgb(mix(c3, c4, clamp((value - p3) / max(p4 - p3, 0.0001), 0.0, 1.0)));
  if (value <= p5) return linearToSrgb(mix(c4, c5, clamp((value - p4) / max(p5 - p4, 0.0001), 0.0, 1.0)));
  return linearToSrgb(c5);
}

vec2 coverUv(vec2 uv) {
  float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
  float sourceAspect = DESIGN_SIZE.x / DESIGN_SIZE.y;
  vec2 covered = uv;

  if (canvasAspect < sourceAspect) {
    covered.x = (covered.x - 0.5) * (canvasAspect / sourceAspect) + 0.5;
  } else {
    covered.y = (covered.y - 0.5) * (sourceAspect / canvasAspect) + 0.5;
  }

  // The settled launch-film dark aperture is 1.208x the matched light frame.
  // Expand only the horizontal camera around the same center so the material
  // opens without introducing lateral drift.
  float horizontalZoom = SOURCE_ZOOM * mix(1.0, 1.208, uColorSchemeMix);
  return vec2(
    (covered.x - 0.5) / horizontalZoom + 0.5,
    (covered.y - 0.5) / SOURCE_ZOOM + 0.5
  );
}

float fluteMap(vec2 uv) {
  vec2 pixel = vec2(uv.x, 1.0 - uv.y) * DESIGN_SIZE;
  vec2 center = DESIGN_SIZE * 0.5 + vec2(14.0, -18.0) * EFFECT_OVERSCAN;
  float angle = radians(106.0);
  vec2 delta = pixel - center;
  vec2 local = vec2(
    cos(angle) * delta.x + sin(angle) * delta.y,
    -sin(angle) * delta.x + cos(angle) * delta.y
  );
  float flutePitch = 34.0 * EFFECT_OVERSCAN;
  float totalHeight = 28.0 * flutePitch;

  if (
    abs(local.x) > 649.0 * EFFECT_OVERSCAN * 0.5 ||
    abs(local.y) > totalHeight * 0.5
  ) {
    return 0.5;
  }

  return fract((local.y + totalHeight * 0.5) / flutePitch);
}

float trailAt(vec2 uv) {
  return texture2D(uTrailTexture, clamp(uv, 0.0, 1.0)).a;
}

vec2 pointerWarp(vec2 uv) {
  float trail = trailAt(uv);
  if (trail < 0.004) return uv;

  float rotation = radians(15.0);
  mat2 flowRotation = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
  vec2 pixel = uv * DESIGN_SIZE;
  vec2 flowSpace = flowRotation * pixel;
  float phase = uTime * 3.9;
  float stretch = pow(3.0, 1.98);
  float baseScale = 0.004;
  float detailScale = 1.7 * 2.9;
  float flowX = cos(flowSpace.y * baseScale / stretch * 1.7 + phase);
  flowX += sin(flowSpace.y * baseScale / stretch * detailScale + phase * 1.6);
  float flowY = sin(flowSpace.x * baseScale * stretch * 1.7 + phase * 0.9);
  flowY += cos(flowSpace.x * baseScale * stretch * detailScale + phase * 1.3);

  float left = trailAt(uv - vec2(uTrailTexel.x, 0.0));
  float right = trailAt(uv + vec2(uTrailTexel.x, 0.0));
  float down = trailAt(uv - vec2(0.0, uTrailTexel.y));
  float up = trailAt(uv + vec2(0.0, uTrailTexel.y));
  vec2 trailGradient = vec2(right - left, up - down);
  vec2 swirl = vec2(-trailGradient.y, trailGradient.x) * 36.0 * 0.73;
  vec2 flowPixels = flowRotation * vec2(flowX, flowY) * 26.0 + swirl;

  return uv + flowPixels / DESIGN_SIZE * trail;
}

vec3 rotateHue(vec3 color, float angle) {
  vec3 axis = normalize(vec3(1.0));
  return color * cos(angle)
    + cross(axis, color) * sin(angle)
    + axis * dot(axis, color) * (1.0 - cos(angle));
}

float textureLuminance(sampler2D textureSampler, vec2 uv) {
  vec2 pixel = EFFECT_OVERSCAN / DESIGN_SIZE;
  vec3 color = texture2D(textureSampler, clamp(uv, 0.0, 1.0)).rgb * 0.30;
  color += texture2D(textureSampler, clamp(uv + vec2(pixel.x * 2.25, 0.0), 0.0, 1.0)).rgb * 0.12;
  color += texture2D(textureSampler, clamp(uv - vec2(pixel.x * 2.25, 0.0), 0.0, 1.0)).rgb * 0.12;
  color += texture2D(textureSampler, clamp(uv + vec2(0.0, pixel.y * 3.0), 0.0, 1.0)).rgb * 0.14;
  color += texture2D(textureSampler, clamp(uv - vec2(0.0, pixel.y * 3.0), 0.0, 1.0)).rgb * 0.14;
  color += texture2D(textureSampler, clamp(uv + vec2(0.0, pixel.y * 7.5), 0.0, 1.0)).rgb * 0.09;
  color += texture2D(textureSampler, clamp(uv - vec2(0.0, pixel.y * 7.5), 0.0, 1.0)).rgb * 0.09;
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

float bayer2(vec2 position) {
  return mod(2.0 * position.x + 3.0 * position.y, 4.0);
}

float bayer4(vec2 position) {
  return 4.0 * bayer2(mod(position, 2.0)) + bayer2(floor(position / 2.0));
}

float bayer8(vec2 position) {
  return 4.0 * bayer4(mod(position, 4.0)) + bayer2(floor(position / 4.0));
}

float dither8x8(vec2 position) {
  vec2 matrixPosition = mod(floor(position), 8.0);
  return (bayer8(matrixPosition) + 0.5) / 64.0 - 0.5;
}

void main() {
  vec2 sourceWarpUv = pointerWarp(vUv);
  vec2 sourceUv = coverUv(sourceWarpUv);
  float flute = fluteMap(vUv);
  float signedFlute = (flute - 0.5) * 2.0;
  sourceUv += vec2(
    -signedFlute * 6.0 * EFFECT_OVERSCAN / DESIGN_SIZE.x,
    signedFlute * 11.0 * EFFECT_OVERSCAN / DESIGN_SIZE.y
  );

  float luma = 0.0;
  if (uModeWeights.x > 0.0001) {
    luma += textureLuminance(uCalmTexture, sourceUv) * uModeWeights.x;
  }
  if (uModeWeights.y > 0.0001) {
    luma += textureLuminance(uJoyfulTexture, sourceUv) * uModeWeights.y;
  }
  if (uModeWeights.z > 0.0001) {
    luma += textureLuminance(uCautionTexture, sourceUv) * uModeWeights.z;
  }
  if (uModeWeights.w > 0.0001) {
    luma += textureLuminance(uRegretTexture, sourceUv) * uModeWeights.w;
  }
  luma = floor(clamp(luma * 255.0 + dither8x8(gl_FragCoord.xy), 0.0, 255.0)) / 255.0;

  vec3 lightColor = mixedPalette(luma);
  vec3 color = lightColor;
  if (uColorSchemeMix > 0.0001) {
    // The launch-film dark material suppresses the broad page wash while its
    // cobalt cores stay luminous. A steeper response keeps that negative space.
    float darkLuma = pow(luma, 1.15);
    vec3 darkColor = mixedDarkPalette(darkLuma);
    color = linearToSrgb(mix(
      srgbToLinear(lightColor),
      srgbToLinear(darkColor),
      uColorSchemeMix
    ));
    // A separate, low-opacity achromatic ridge recreates the broad silver
    // refraction that sits outside the saturated core in the dark film. It is
    // deliberately gated to middle luminance so the page stays charcoal.
    float neutralEcho = smoothstep(0.62, 0.98, abs(signedFlute));
    neutralEcho *= smoothstep(0.24, 0.54, darkLuma);
    neutralEcho *= 1.0 - smoothstep(0.78, 0.96, darkLuma);
    neutralEcho *= uColorSchemeMix;
    color = mix(color, vec3(0.56, 0.62, 0.70), neutralEcho * 0.18);
    float railEdge = pow(abs(signedFlute), 6.0) * uColorSchemeMix;
    color += vec3(0.0, 0.015, 0.065) * railEdge;
  }
  float trail = trailAt(vUv);
  color = mix(color, rotateHue(color, radians(7.0)), trail);

  gl_FragColor = vec4(color, 1.0);
}
`;

export { razorSenseMoodVertexShader, razorSenseMoodFragmentShader };
