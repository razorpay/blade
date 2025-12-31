import { ShaderMaterial } from "three";

/**
 * ShaderBuilder - Combines multiple shader effects into a single material
 *
 * Usage:
 *   const material = buildShaderMaterial({
 *     baseTexture: myTexture,
 *     effects: [displacement, vignette, colorGrading],
 *     uniforms: { uVignetteIntensity: { value: 0.3 } }
 *   });
 */

// Base vertex shader (shared by all effects)
const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Builds a combined fragment shader from multiple effects
 */
function buildFragmentShader(effects, pipeline) {
  // Collect all GLSL function definitions
  const glslFunctions = effects.map((e) => e.glsl).join("\n");

  // Collect all uniform declarations
  const uniformDeclarations = effects
    .flatMap((effect) =>
      Object.keys(effect.uniforms).map((name) => {
        const value = effect.uniforms[name].value;
        if (value === null || (value && value.isTexture)) {
          // Check if it's a color uniform (by naming convention)
          if (name.toLowerCase().includes("color")) {
            return `uniform vec3 ${name};`;
          }
          return `uniform sampler2D ${name};`;
        } else if (typeof value === "number") {
          return `uniform float ${name};`;
        } else if (
          value &&
          value.x !== undefined &&
          value.y !== undefined &&
          value.z !== undefined
        ) {
          return `uniform vec3 ${name};`;
        } else if (value && value.x !== undefined && value.y !== undefined) {
          return `uniform vec2 ${name};`;
        } else if (Array.isArray(value) && value.length === 3) {
          return `uniform vec3 ${name};`;
        }
        return `uniform float ${name};`;
      })
    )
    .join("\n");

  return `
    uniform sampler2D uTexture;
    ${uniformDeclarations}
    varying vec2 vUv;
    
    ${glslFunctions}
    
    void main() {
      vec2 uv = vUv;
      
      ${pipeline}
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

/**
 * Merges uniforms from multiple effects
 */
function mergeUniforms(baseTexture, effects, customUniforms = {}) {
  const merged = {
    uTexture: { value: baseTexture },
  };

  // Add uniforms from each effect
  effects.forEach((effect) => {
    Object.entries(effect.uniforms).forEach(([key, value]) => {
      merged[key] = { ...value };
    });
  });

  // Override with custom uniforms
  Object.entries(customUniforms).forEach(([key, value]) => {
    if (merged[key]) {
      merged[key] = value;
    } else {
      merged[key] = value;
    }
  });

  return merged;
}

/**
 * Main builder function
 *
 * @param {Object} config
 * @param {Texture} config.baseTexture - The main texture to apply effects to
 * @param {Array} config.effects - Array of effect objects from effects.js
 * @param {String} config.pipeline - GLSL code for the main() function body
 * @param {Object} config.uniforms - Custom uniform overrides
 * @returns {ShaderMaterial}
 */
export function buildShaderMaterial({
  baseTexture,
  effects = [],
  pipeline,
  uniforms = {},
}) {
  const fragmentShader = buildFragmentShader(effects, pipeline);
  const mergedUniforms = mergeUniforms(baseTexture, effects, uniforms);

  return new ShaderMaterial({
    uniforms: mergedUniforms,
    vertexShader: baseVertexShader,
    fragmentShader,
  });
}

/**
 * Updates a uniform value on an existing material
 */
export function updateUniform(material, name, value) {
  if (material.uniforms[name]) {
    material.uniforms[name].value = value;
  }
}
