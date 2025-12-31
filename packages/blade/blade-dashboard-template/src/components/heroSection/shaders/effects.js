/**
 * Shader Effects Library
 * Each effect exports: uniforms, and GLSL function code
 * Effects are composable and can be chained together
 */

// ============================================
// DISPLACEMENT EFFECT
// ============================================
export const displacement = {
    name: "displacement",
    uniforms: {
      uDisplacement: { value: null },
      uHorizontalDisplacement: { value: 0.02 },
      uVerticalDisplacement: { value: 0.03 },
      // Higher values increase the distance between visible "slits" in the displacement map
      // by zooming into the displacement texture around the center.
      uDisplacementZoom: { value: 1.0 },
    },
    // GLSL function that modifies UV
    glsl: `
      vec2 applyDisplacement(vec2 uv, sampler2D dispMap, float hDisp, float vDisp) {
        // Zoom displacement-map UVs around the center.
        // uDisplacementZoom > 1.0 => zoom in => larger features => slits farther apart.
        vec2 dispUv = (uv - 0.5) / max(uDisplacementZoom, 0.0001) + 0.5;
        dispUv = clamp(dispUv, 0.0, 1.0);
        vec4 dispSample = texture2D(dispMap, dispUv);
        float hOffset = (dispSample.r - 0.5) * 2.0 * hDisp;
        float vOffset = (dispSample.g - 0.5) * 2.0 * vDisp;
        return uv + vec2(hOffset, vOffset);
      }
    `,
  };
  
  // ============================================
  // VIGNETTE EFFECT
  // ============================================
  export const vignette = {
    name: "vignette",
    uniforms: {
      uVignetteIntensity: { value: 0.5 },
      uVignetteRadius: { value: 0.8 },
    },
    glsl: `
      vec3 applyVignette(vec3 color, vec2 uv, float intensity, float radius) {
        vec2 center = uv - 0.5;
        float dist = length(center);
        float vig = smoothstep(radius, radius - 0.5, dist);
        return color * mix(1.0 - intensity, 1.0, vig);
      }
    `,
  };
  
  // ============================================
  // CHROMATIC ABERRATION EFFECT
  // ============================================
  export const chromaticAberration = {
    name: "chromaticAberration",
    uniforms: {
      uChromaticStrength: { value: 0.005 },
    },
    glsl: `
      vec3 applyChromaticAberration(sampler2D tex, vec2 uv, float strength) {
        vec2 dir = uv - 0.5;
        float r = texture2D(tex, uv + dir * strength).r;
        float g = texture2D(tex, uv).g;
        float b = texture2D(tex, uv - dir * strength).b;
        return vec3(r, g, b);
      }
    `,
  };
  
  // ============================================
  // RGB SHIFT EFFECT
  // ============================================
  export const rgbShift = {
    name: "rgbShift",
    uniforms: {
      uRgbShiftAmount: { value: 0.01 },
      uRgbShiftAngle: { value: 0.0 },
    },
    glsl: `
      vec3 applyRgbShift(sampler2D tex, vec2 uv, float amount, float angle) {
        vec2 offset = vec2(cos(angle), sin(angle)) * amount;
        float r = texture2D(tex, uv + offset).r;
        float g = texture2D(tex, uv).g;
        float b = texture2D(tex, uv - offset).b;
        return vec3(r, g, b);
      }
    `,
  };
  
  // ============================================
  // BLUR EFFECT (Simple box blur)
  // ============================================
  export const blur = {
    name: "blur",
    uniforms: {
      uBlurStrength: { value: 0.002 },
    },
    glsl: `
      vec3 applyBlur(sampler2D tex, vec2 uv, float strength) {
        vec3 color = vec3(0.0);
        float total = 0.0;
        for (float x = -2.0; x <= 2.0; x += 1.0) {
          for (float y = -2.0; y <= 2.0; y += 1.0) {
            color += texture2D(tex, uv + vec2(x, y) * strength).rgb;
            total += 1.0;
          }
        }
        return color / total;
      }
    `,
  };
  
  // ============================================
  // COLOR GRADING EFFECT
  // ============================================
  export const colorGrading = {
    name: "colorGrading",
    uniforms: {
      uBrightness: { value: 0.0 },
      uContrast: { value: 1.0 },
      uSaturation: { value: 1.0 },
    },
    glsl: `
      vec3 applyColorGrading(vec3 color, float brightness, float contrast, float saturation) {
        // Brightness
        color += brightness;
        
        // Contrast
        color = (color - 0.5) * contrast + 0.5;
        
        // Saturation
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(gray), color, saturation);
        
        return clamp(color, 0.0, 1.0);
      }
    `,
  };
  
  // ============================================
  // WAVE DISTORTION EFFECT
  // ============================================
  export const waveDistortion = {
    name: "waveDistortion",
    uniforms: {
      uWaveAmplitude: { value: 0.01 },
      uWaveFrequency: { value: 10.0 },
      uTime: { value: 0 },
    },
    glsl: `
      vec2 applyWaveDistortion(vec2 uv, float amplitude, float frequency, float time) {
        uv.x += sin(uv.y * frequency + time) * amplitude;
        uv.y += cos(uv.x * frequency + time) * amplitude;
        return uv;
      }
    `,
  };
  
  // ============================================
  // COLORAMA EFFECT (After Effects style)
  // ============================================
  // Remaps pixel intensity to a gradient map texture
  export const colorama = {
    name: "colorama",
    uniforms: {
      uGradientMap: { value: null }, // Gradient map texture
      uColoramaPhaseShift: { value: 0.0 }, // The "Input Phase" dial - rotates colors along gradient
      uColoramaRepetitions: { value: 1.0 }, // Number of gradient cycles (e.g., 1.21)
    },
    glsl: `
      vec3 applyColorama(
        vec3 color,
        sampler2D gradientMap,
        float phaseShift,
        float repetitions
      ) {
        // 1. Calculate Intensity
        float intensity = color.g * 1.0;
        
        // 2. Apply Repetitions & Phase Shift
        // We multiply intensity by repetitions FIRST to squeeze the cycle.
        // We add phaseShift to rotate the colors.
        float phase = (intensity * repetitions) + phaseShift;
        
        // 3. CYCLE (The Fix)
        // Instead of clamp(), we use fract(). 
        // fract(1.2) becomes 0.2. This creates the infinite loop/cycle.
        phase = clamp(phase, 0.0, 1.0);
        
        // 4. Sample the Gradient
        // Note: We use the alpha channel (rgba) too, in case your gradient has transparency
        vec4 mapColor = texture2D(gradientMap, vec2(phase, 0.5));
        
        // 5. Composite Over Layer
        // If the gradient has transparency (alpha < 1), show the original color underneath.
        return mapColor.rgb;
      }
    `,
  };
  