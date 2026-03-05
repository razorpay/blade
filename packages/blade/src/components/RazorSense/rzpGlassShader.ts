const rzpGlassVertexShader = /* glsl */ `
precision mediump float;

attribute vec2 position;
attribute vec2 uv;

// Zoom & Pan uniforms (computed in vertex shader for efficiency)
uniform float uZoom;
uniform vec2 uPan;  // vec2(uPanX, uPanY)

// Output varyings
varying vec2 vUv;           // Raw screen UV (for screen-space effects like feathering)
varying vec2 vContentUv;    // Transformed UV for video/content sampling (zoom + pan applied)

void main() {
    // Raw screen UV for screen-space effects
    vUv = uv;
    
    // Compute zoomed/panned UV for content sampling
    // Zoom: scale around center (0.5, 0.5)
    // Pan: offset the view
    vContentUv = (uv - 0.5) / uZoom + 0.5;
    vContentUv += uPan;
    
    gl_Position = vec4(position, 0, 1);
}
`;

const rzpGlassFragmentShader = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform vec2 iResolution;
uniform float uDpr;
uniform sampler2D uVideoTexture;
uniform sampler2D uGradientMap;
uniform sampler2D uGradientMap2;       // Second gradient map for cross-fade blending
uniform sampler2D uCenterGradientMap;  // Separate gradient map for center ellipse

// Layer toggles (enable/disable actual effects)
uniform float uEnableDisplacement;
uniform float uEnableColorama;
uniform float uEnableBloom;
uniform float uEnableLightSweep;

// ============================================
// COLORAMA UNIFORMS (Adobe AE v5 Pipeline)
// Pipeline: Scalar → Remap → Warp → Wrap → Lookup → Blend
// ============================================

// --- 1. INPUT PHASE (Scalar Index Generation) ---
uniform float uInputMin;          // Input range min (default 0.0)
uniform float uInputMax;          // Input range max (default 1.0)

// --- 2. MODIFY PHASE (Index Space Warping) ---
uniform float uModifyGamma;       // Gamma curve: <1 = brights, >1 = darks (default 1.0)
uniform float uPosterizeLevels;   // 0 = off, >0 = number of discrete steps
uniform float uCycleRepetitions;  // Stretch/compress the index (default 1.0)
uniform float uPhaseShift;        // Static offset (default 0.0)
uniform float uCycleSpeed;        // Cycling animation speed (default 0.0)

// --- 3. OUTPUT CYCLE (Wrap & Lookup) ---
uniform float uWrapMode;          // 0 = clamp, 1 = wrap/fract (default 1.0)
uniform float uReverse;           // 0 = normal, 1 = reverse gradient (default 0.0)

// --- 4. COMPOSITE ---
uniform float uBlendWithOriginal;    // 0 = full effect, 1 = original (default 0.0)
uniform float uGradientMapBlend;     // 0 = uGradientMap, 1 = uGradientMap2 (default 0.0)

// --- 5. LIGHT EFFECT ---
uniform float uLightIntensity;    // Strength of light sweep effect
uniform float uFrameCount;        // Current frame number
uniform float uLightStartFrame;   // Frame when light effect starts

// --- 6. DISPLACEMENT ---
uniform float uNumSegments;       // Number of glass slits (default 45.0)
uniform float uSlitAngle;         // Angle of slits in radians (default 0.13)
uniform float uDisplacementX;     // X displacement amount (default -12.0)
uniform float uDisplacementY;     // Y displacement amount (default -20.0)

// --- 7. CENTER ELEMENT ---
uniform float uEnableCenterElement;    // Toggle center element (0 = off, 1 = on)
uniform float uCenterAnimDuration;     // Duration of one animation cycle in seconds
uniform float uCenterAnimTime;         // Current animation time in seconds (resets with video loop)

// --- 8. COLOR CORRECTION ---
uniform float uCCBlackPoint;     // Levels black point (default 0.0)
uniform float uCCWhitePoint;     // Levels white point (default 1.0)
uniform float uCCMidtoneGamma;   // Midtone gamma (default 1.2)
uniform float uCCGamma;          // Output gamma (default 1.2)
uniform float uCCContrast;       // Contrast boost (default 0.0)

// --- 9. ZOOM & PAN ---
uniform float uZoom;             // Zoom level (1.0 = normal, 2.0 = 2x zoom) - still needed for edge feather check
uniform vec4 uEdgeFeather;       // Per-side feathering: vec4(top, right, bottom, left) clockwise, 0 = none, 1 = max
uniform vec2 uRefResolution;     // Reference resolution for zoom-independent displacement
uniform vec4 uVisibleUvBounds;   // vec4(minX, minY, maxX, maxY) - visible portion of canvas in container

// --- 10. RIPPLE WAVE ---
uniform float uEnableRippleWave;   // Toggle procedural ripple (0 = off, 1 = on)
uniform float uRippleSpeed;        // Ring expansion duration in seconds
uniform float uRippleBlend;        // Gaussian ring thickness
uniform float uRippleAngularPower; // Sharpness of four-way diagonal lobes
uniform float uRippleRadialFalloff; // Max radius a ring expands to (UV space)
uniform float uRippleWaitTime;     // Silence gap between bursts in seconds

// UV coordinates from the vertex shader
varying vec2 vUv;                // Raw screen UV (for screen-space effects)
varying vec2 vContentUv;         // Transformed UV with zoom/pan applied (for content sampling)

// ============================================
// UTILITY FUNCTIONS
// ============================================
// Rec. 709 luminance calculation
float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

// ============================================
// COLORAMA EFFECT (Adobe After Effects v5 Pipeline)
// ============================================
//
// Pipeline:
//   Image → Scalar Field (0-1) → Warp/Animate → Gradient Lookup → Composite
//
// This matches AE's indexed gradient remapping with time-domain cycling.
vec3 applyColoramaWithGradient(
    sampler2D gradientMap,  // Gradient map texture to sample from
    float rawIntensity,    // Raw luminance from pixel
    float inputMin,        // Input range min
    float inputMax,        // Input range max
    float gamma,           // Gamma curve (pow)
    float posterizeLevels, // 0 = off, else discrete steps
    float cycleReps,       // Cycle repetitions (stretch)
    float phaseShift,      // Static offset
    float cycleSpeed,      // Time-based cycling
    float wrapMode,        // 0 = clamp, 1 = wrap
    float reverse          // 0 = normal, 1 = flip
) {
    // ─────────────────────────────────────────────
    // STEP 1: INPUT PHASE - Scalar Index Generation
    // ─────────────────────────────────────────────
    // Normalize intensity to input range
    float t = clamp((rawIntensity - inputMin) / (inputMax - inputMin), 0.0, 1.0);

    // ─────────────────────────────────────────────
    // STEP 2: MODIFY PHASE - Index Space Warping
    // ─────────────────────────────────────────────

    // a) Gamma / Curves - reshape the intensity distribution
    t = pow(t, gamma);

    // b) Posterize - quantize to discrete levels (branchless)
    //    When posterizeLevels <= 0, keeps t unchanged
    float posterized = floor(t * posterizeLevels + 0.0001) / max(posterizeLevels, 0.0001);
    t = mix(t, posterized, step(0.001, posterizeLevels));

    // c) Cycle Repetitions - stretch/compress across gradient
    t = t * cycleReps;

    // d) Phase Shift - static offset
    t = t + phaseShift;

    // e) Cycling Animation - time-based offset
    t = t + cycleSpeed * uTime;

    // ─────────────────────────────────────────────
    // STEP 3: OUTPUT CYCLE - Wrap & Lookup (branchless)
    // ─────────────────────────────────────────────

    // Wrap (fract) vs Clamp - branchless selection
    t = mix(clamp(t, 0.0, 1.0), fract(t), step(0.5, wrapMode));

    // Reverse direction - branchless
    t = mix(t, 1.0 - t, step(0.5, reverse));

    // Gradient lookup (1D texture sample)
    return texture2D(gradientMap, vec2(t, 0.5)).rgb;
}

// ============================================
// DISPLACEMENT FUNCTIONS
// ============================================
// Create striped displacement map for glass refraction effect
// Returns: x = signed displacement (-1 to 1), y = local UV x position within segment
// gradientStart: gradient value at left edge (typically 1.0 for white)
// gradientEnd: gradient value at right edge (typically 0.0 for black)
// gradientPower: power curve for falloff (1.0 = linear, <1.0 = steeper, >1.0 = gentler)
// centerPoint: center value for signed conversion (typically 0.5)
// aspect: screen aspect ratio (width/height) for consistent slit angle
vec2 createStripedDisplacement(
    vec2 uv,
    float numSegments,
    float angle,
    float gradientStart,
    float gradientEnd,
    float gradientPower,
    float centerPoint,
    float aspect
) {
    // Work in aspect-corrected UV space where x and y have equal visual scale
    // This ensures consistent slit angle regardless of viewport dimensions
    vec2 aspectUV = uv * vec2(aspect, 1.0);
    
    // Apply slant in aspect-corrected space
    float slantedX = aspectUV.x - aspectUV.y * tan(angle);

    // Calculate segment properties (account for aspect-scaled x range)
    float segmentWidth = aspect / numSegments;
    float localUVx = fract(slantedX / segmentWidth); // 0-1 within each segment

    // Create the displacement map gradient
    // Use smoothstep for smoother interpolation
    float smoothUVx = smoothstep(0.0, 1.0, localUVx);
    // Interpolate from gradientEnd (left) to gradientStart (right)
    float rawGradient = mix(gradientEnd, gradientStart, smoothUVx);

    // Apply power curve for falloff control
    rawGradient = pow(rawGradient, gradientPower);

    // Convert to signed displacement (-1 to 1) using centerPoint
    // centerPoint is the neutral value (typically 0.5)
    float signedDisplacement = (rawGradient - centerPoint) / centerPoint;

    return vec2(signedDisplacement, localUVx);
}

// Apply displacement offset to UV coordinates
vec2 applyDisplacement(vec2 uv, float signedDisplacement, vec2 maxDisplacement, vec2 resolution) {
    vec2 displaceOffset = vec2(
        signedDisplacement * maxDisplacement.x / resolution.x,
        signedDisplacement * maxDisplacement.y / resolution.y
    );
    return uv + displaceOffset;
}

// Create thin slanted stripes with multi-stop gradient color
// Returns RGB color: gradient stripes with 3 color stops
// Stop 1 (0%): colorStart, Stop 2 (stopPosition): colorMid, Stop 3 (100%): transparent
vec4 createStripes(
    vec2 uv,
    float numSegments,
    float angle,
    float stopPosition,   // Position of middle stop (0.0 to 1.0)
    vec4 colorStart,      // Color at 0% (left edge)
    vec4 colorMid,        // Color at stopPosition
    float aspect          // Screen aspect ratio for consistent angle
) {
    // Work in aspect-corrected UV space where x and y have equal visual scale
    vec2 aspectUV = uv * vec2(aspect, 1.0);
    
    // Apply slant in aspect-corrected space
    float slantedX = aspectUV.x - aspectUV.y * tan(angle);

    // Calculate segment properties (account for aspect-scaled x range)
    float segmentWidth = aspect / numSegments;
    float localUVx = 1.0 - fract(slantedX / segmentWidth);  // 0-1 within each segment, reversed

    // Multi-stop gradient:
    // 0% -> colorStart (green)
    // stopPosition -> colorMid (white)
    // 100% -> transparent (black with 0 opacity)

    vec4 gradientColor;
    float opacity;

    if (localUVx < stopPosition) {
        float t = localUVx / stopPosition;
        gradientColor = mix(colorMid, colorStart, t);
        opacity = 0.5;
    } else {
        float t = (localUVx - stopPosition) / (1.0 - stopPosition);
        gradientColor = mix(vec4(0.0), colorMid, t);
        opacity = 0.5 - t * 0.5;
    }

    return gradientColor * opacity;
}

// Sample texture with displacement applied
vec4 sampleWithDisplacement(
    sampler2D tex,
    vec2 uv,
    float signedDisplacement,
    vec2 maxDisplacement,
    vec2 resolution
) {
    vec2 displacedUV = applyDisplacement(uv, signedDisplacement, maxDisplacement, resolution);
    return texture2D(tex, displacedUV);
}

// ============================================
// POST-PROCESSING EFFECTS
// ============================================
vec3 applyBloom(vec3 color, float intensity, float innerMask) {
    const float whiteCoreThresholdMin = 0.5;   // Start of white core mask
    const float whiteCoreThresholdMax = 0.85;  // End of white core mask
    const float whiteCoreBlendStrength = 0.85; // How much to blend towards pure white

    const float bloomThresholdMin = 0.3;       // Start of bloom glow
    const float bloomThresholdMax = 0.7;       // End of bloom glow
    const vec3 bloomColor = vec3(1.0, 0.99, 0.97); // Warm white bloom tint
    const float bloomStrength = 0.10;          // Intensity of bloom glow
    // -------------------------------

    // Calculate how much we're in the "center" bright area
    // Use a tighter threshold for the white core
    float whiteCoreMask = smoothstep(whiteCoreThresholdMin, whiteCoreThresholdMax, intensity) * innerMask;

    // Pure white target
    vec3 pureWhite = vec3(1.0);

    // Blend the center towards pure white (not additive, but replacement blend)
    // This ensures the very center goes to white, not gray
    color = mix(color, pureWhite, whiteCoreMask * whiteCoreBlendStrength);

    // Additional soft bloom glow around the white core
    float bloomBase = smoothstep(bloomThresholdMin, bloomThresholdMax, intensity);
    float bloomAmount = bloomBase * innerMask;
    color += bloomColor * bloomAmount * bloomStrength;

    return color;
}

// ============================================
// ANIMATED POLYGON SHAPE
// ============================================
// Struct to return shape data
struct ShapeData {
    float shape;      // The shape value (0 = outside, 1 = center)
    float gradient;   // Gradient from gray (edge) to white (center)
};

// Signed distance function for a regular polygon
// p: point to test, r: radius, n: number of sides
float sdPolygon(vec2 p, float r, float n) {
    // Angle and radius
    float an = 3.141593 / n;
    vec2 acs = vec2(cos(an), sin(an));

    // Reduce to first sector
    float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
    p = length(p) * vec2(cos(bn), abs(sin(bn)));

    // Line sdf
    p -= r * acs;
    p.y += clamp(-p.y, 0.0, r * acs.y);

    return length(p) * sign(p.x);
}

// Fast signed distance function for an ellipse
// Approximation that avoids expensive acos(), cube roots, and branching
// Accurate enough for visual effects, ~5x faster than exact version
float sdEllipse(vec2 p, vec2 ab) {
    // Normalize point by ellipse radii
    vec2 q = p / ab;
    float k1 = length(q);
    
    // Early out for points very close to center (avoid division issues)
    if (k1 < 0.0001) return -min(ab.x, ab.y);
    
    // Gradient-based distance approximation
    vec2 q2 = q / ab;  // Second normalization for gradient
    float k2 = length(q2);
    
    return k1 * (k1 - 1.0) / k2;
}

// Helper: Calculate a single shape instance at a given animation phase
ShapeData calculateSingleShape(
    vec2 uv,
    float linearT,           // Animation phase 0-1
    float solidCoreMask,
    vec2 resolution,
    // Shape parameters
    float shapeType,
    float shapeWidth,
    float shapeHeight,
    float centerY,
    float animRange,
    float edgeSoftness,
    float grayLevel,
    float shapeAngleStart,
    float shapeAngleEnd,
    float shapeSize
) {
    // Map 0-1 to position range (left to right)
    float posOffset = (linearT * 2.0 - 1.0) * animRange;
    float centerX = 0.5 + posOffset;

    // Animate rotation
    float animatedAngle = mix(shapeAngleStart, shapeAngleEnd, linearT);

    // Correct for aspect ratio
    float aspect = resolution.x / resolution.y;

    // Calculate position relative to center
    vec2 shapeCenter = vec2(centerX, centerY);
    vec2 delta = uv - shapeCenter;

    // Rotate delta by animated angle FIRST
    float cosA = cos(animatedAngle);
    float sinA = sin(animatedAngle);
    vec2 rotatedDelta = vec2(
        delta.x * cosA - delta.y * sinA,
        delta.x * sinA + delta.y * cosA
    );

    // Apply aspect correction AFTER rotation
    rotatedDelta.x *= aspect;

    // Calculate distance based on shape type
    float dist;
    if (shapeType < 0.5) {
        dist = sdEllipse(rotatedDelta, vec2(shapeWidth, shapeHeight));
    } else {
        vec2 scaledDelta = rotatedDelta / vec2(shapeWidth, shapeHeight);
        dist = sdPolygon(scaledDelta, shapeSize / min(shapeWidth, shapeHeight), shapeType);
        dist *= min(shapeWidth, shapeHeight);
    }

    // Normalize distance for gradient
    float normalizedDist;
    if (shapeType < 0.5) {
        normalizedDist = dist / max(shapeWidth, shapeHeight) + 1.0;
    } else {
        normalizedDist = (dist / shapeSize) + 1.0;
    }
    normalizedDist = clamp(normalizedDist, 0.0, 1.0);

    // Create soft shape mask
    float shapeMask = 1.0 - smoothstep(-edgeSoftness * 0.1, edgeSoftness * 0.05, dist);

    // Create gradient
    float gradient = mix(1.0, grayLevel, smoothstep(0.0, 1.0, normalizedDist));

    // Apply solid core mask
    shapeMask *= solidCoreMask;

    ShapeData result;
    result.shape = shapeMask;
    result.gradient = gradient;
    return result;
}

// Creates two staggered animated shapes that move left-to-right
// When one reaches the far edge, another appears from the left
ShapeData calculateAnimatedShape(
    vec2 uv,
    float time,            // Current animation time in seconds
    float solidCoreMask,
    vec2 resolution
) {
    // --- Configurable parameters ---
    const float shapeType = 3.0;            // 0 = ellipse, 3 = triangle, 4 = square, 5 = pentagon, etc.
    const float shapeWidth = 0.1;           // Width/horizontal scale (wide)
    const float shapeHeight = 0.8;          // Height/vertical scale (short)
    const float centerY = 0.4;              // Vertical center position
    float cycleDuration = uCenterAnimDuration; // Seconds per animation cycle (from uniform)
    const float animRange = 0.7;            // How far left/right it travels
    const float edgeSoftness = 0.5;         // Softness of shape edge
    const float grayLevel = 0.5;            // Gray color at shape edge
    const float shapeAngleStart = 0.6;     // Rotation angle at start (slight tilt)
    const float shapeAngleEnd = 0.1;      // Rotation angle at end (opposite tilt)
    const float shapeSize = 0.4;            // Overall size for polygon mode
    const float staggerOffset = 0.4;        // Offset between the two shapes (0.5 = half cycle apart)
    const float shape2Scale = 1.3;          // Scale multiplier for 2nd shape (1.0 = same size)
    // -------------------------------

    // Time-based animation: time / cycleDuration gives progress through cycle
    float linearT1 = fract(time / cycleDuration);              // Shape 1: 0->1 repeating
    float linearT2 = fract(time / cycleDuration + staggerOffset);  // Shape 2: offset by staggerOffset

    // Calculate both shapes (shape 2 is slightly larger)
    ShapeData shape1 = calculateSingleShape(
        uv, linearT1, solidCoreMask, resolution,
        shapeType, shapeWidth, shapeHeight, centerY, animRange,
        edgeSoftness, grayLevel, shapeAngleStart, shapeAngleEnd, shapeSize
    );

    ShapeData shape2 = calculateSingleShape(
        uv, linearT2, solidCoreMask, resolution,
        shapeType, shapeWidth * shape2Scale, shapeHeight * shape2Scale, centerY, animRange,
        edgeSoftness, grayLevel, shapeAngleStart, shapeAngleEnd, shapeSize * shape2Scale
    );

    // Combine both shapes (take max of masks, blend gradients)
    ShapeData result;
    result.shape = max(shape1.shape, shape2.shape);
    // Weighted average of gradients based on shape masks
    float totalMask = shape1.shape + shape2.shape;
    if (totalMask > 0.001) {
        result.gradient = (shape1.gradient * shape1.shape + shape2.gradient * shape2.shape) / totalMask;
    } else {
        result.gradient = 0.5;
    }

    return result;
}

// Apply shape effect to intensity (for colorama/displacement pipeline)
float applyShapeToIntensity(
    float baseIntensity,
    ShapeData shapeData,
    float effectStrength
) {
    // Blend the shape gradient into the base intensity
    // This makes the shape area brighter/differently colored through colorama
    float shapeContribution = shapeData.gradient * shapeData.shape;
    return mix(baseIntensity, shapeContribution, shapeData.shape * effectStrength);
}


// ============================================
// PROCEDURAL FOUR-WAY RIPPLE BASE
// ============================================
// Discrete Gaussian ring pulses with true cubic ease-out timing.
// Each ring expands from center following 1-(1-t)³, then fades out.
// Three rings staggered evenly ensure one is always visible.
float gaussRing(float r, float ringR, float width) {
    float d = r - ringR;
    return exp(-(d * d) / (width * width));
}

float generateFourWayRipple(vec2 uv, float time) {
    float aspect = iResolution.x / iResolution.y;
    vec2 centered = uv - 0.5;
    centered.x *= aspect;

    float r = length(centered);
    float a = atan(centered.y, centered.x);

    // 4-lobe directional mask on the diagonals (45°, 135°, 225°, 315°)
    float angular = pow(abs(sin(a * 2.0)), uRippleAngularPower);

    // Bow the wavefronts into gentle arcs along the diagonal directions
    float curvedR = r - angular * 0.06;

    // uRippleSpeed = expansion duration (how long the ring takes to expand)
    // uRippleWaitTime = silence gap after expansion before next ring starts
    // Total cycle      = expansionTime + rippleWaitTime  (fully decoupled)
    float expansionTime = uRippleSpeed;
    float totalPeriod   = expansionTime + uRippleWaitTime;
    float width         = uRippleBlend;

    // Use fract(time/period) to avoid precision drift from mod(largeTime, period) in GLSL
    float phase = fract(time / totalPeriod);
    float t     = phase * totalPeriod;  // 0..totalPeriod (same cycle, stable wrap)

    float ripple = 0.0;
    for (int i = 0; i < 1; i++) {
        float isActive = step(t, expansionTime);              // 1 during expansion, 0 during wait
        float localT   = clamp(t / expansionTime, 0.0, 1.0);   // 0→1 within expansion

        float eased     = 1.0 - pow(1.0 - localT, 2.5);
        float ringR     = eased * uRippleRadialFalloff;
        float fade      = 1.0 - localT;
        float innerFade = smoothstep(0.0, 0.02, ringR);  // visible from center (was 0.18)
        ripple += gaussRing(curvedR, ringR, width) * fade * innerFade * isActive;
    }
    ripple = clamp(ripple, 0.0, 1.0);

    // Confine rings to the 4 diagonal beams
    float wave = ripple * angular;

    // Envelope: small inner hole so ripples start close to center, sharp outer falloff
    float envelope = smoothstep(0.01, 0.18, r)
                   * smoothstep(uRippleRadialFalloff, uRippleRadialFalloff * 0.6, r);
    wave *= envelope;

    // Near-white ambient background
    float ambient = 0.4;

    return clamp(wave * 0.28 + ambient, 0.0, 1.0);
}

// AE-style color processing (levels, gamma, contrast). Used in both ripple and normal mode.
vec3 applyColorCorrection(vec3 color) {
    color = (color - uCCBlackPoint) / (uCCWhitePoint - uCCBlackPoint);
    color = pow(max(color, vec3(0.0)), vec3(1.0 / (uCCMidtoneGamma * uCCGamma)));
    color = color * (1.0 + uCCContrast) - uCCContrast * 0.5;
    return clamp(color, 0.0, 1.0);
}

// Feather at container edges (visible bounds). Used in both ripple and normal mode.
vec3 applyEdgeFeathering(vec3 color) {
    // Apply edge feathering when zoomed in
    // Feathering is applied at the container edges (visible bounds), not canvas edges
    // uEdgeFeather = vec4(top, right, bottom, left) — clockwise like CSS
    if (any(greaterThan(uEdgeFeather, vec4(0.0)))) {
        vec2 screenUV = vUv;

        // Get visible UV bounds (where container clips the canvas)
        float visMinX = uVisibleUvBounds.x;
        float visMinY = uVisibleUvBounds.y;
        float visMaxX = uVisibleUvBounds.z;
        float visMaxY = uVisibleUvBounds.w;

        // Calculate visible dimensions in UV space for aspect-correct feathering on X axis
        float visibleWidth = visMaxX - visMinX;
        float visibleHeight = visMaxY - visMinY;
        float visibleAspect = visibleWidth / visibleHeight;

        // Per-side feather amounts (X sides get aspect correction for pixel-equal width)
        float featherTop    = uEdgeFeather.x * 0.15 / visibleAspect;
        float featherRight  = uEdgeFeather.y * 0.15 / visibleAspect;
        float featherBottom = uEdgeFeather.z * 0.15 / visibleAspect;
        float featherLeft   = uEdgeFeather.w * 0.15 / visibleAspect;

        // Apply feathering at container edges (visible bounds)
        float left   = smoothstep(visMinX, visMinX + featherLeft,   screenUV.x);
        float right  = smoothstep(visMaxX, visMaxX - featherRight,  screenUV.x);
        float bottom = smoothstep(visMinY, visMinY + featherBottom,  screenUV.y);
        float top    = smoothstep(visMaxY, visMaxY - featherTop,     screenUV.y);

        float edgeMask = left * right * bottom * top;
        color = mix(vec3(1.0), color, edgeMask);
    }
    return color;
}

void main() {
    // ============================================
    // LAYER 1: Base glass effect (fine slits, whole image)
    // ============================================
    float numSegments = uNumSegments;
    float angle = uSlitAngle;
    const float blurRadius = 9.0;
    const float sigma = 4.0;

    // Calculate aspect ratio for consistent slit angles
    float aspect = iResolution.x / iResolution.y;

    // ============================================
    // RIPPLE WAVE MODE (short-circuits the standard pipeline)
    // ============================================
    if (uEnableRippleWave > 0.5) {
        // Compute glass-slit displacement (same as standard pipeline) and apply
        // it to the screen UV so the ripple pattern is seen through the glass slits.
        float resolutionScale = iResolution.x / uRefResolution.x;
        vec2 rippleMaxDisplacement = vec2(uDisplacementX, uDisplacementY) * uDpr * resolutionScale;

        vec2 rippleDisplacementData = createStripedDisplacement(
            vUv, numSegments, angle,
            1.0, 0.0, 1.0, 0.5, aspect
        );
        float rippleSignedDisplacement = rippleDisplacementData.x;

        vec2 rippleUv = vUv;
        if (uEnableDisplacement > 0.5) {
            rippleUv = applyDisplacement(vUv, rippleSignedDisplacement, rippleMaxDisplacement, iResolution);
        }

        float rippleValue = generateFourWayRipple(rippleUv, uTime);

        vec3 rippleColor;
        if (uEnableColorama > 0.5) {
            vec3 colorResult1 = applyColoramaWithGradient(
                uGradientMap, rippleValue,
                uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
                uCycleRepetitions, uPhaseShift, uCycleSpeed,
                uWrapMode, uReverse
            );
            vec3 colorResult2 = applyColoramaWithGradient(
                uGradientMap2, rippleValue,
                uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
                uCycleRepetitions, uPhaseShift, uCycleSpeed,
                uWrapMode, uReverse
            );
            rippleColor = mix(colorResult1, colorResult2, uGradientMapBlend);
        } else {
            rippleColor = vec3(rippleValue);
        }

        rippleColor = applyColorCorrection(rippleColor);
        rippleColor = applyEdgeFeathering(rippleColor);
        gl_FragColor = vec4(rippleColor, 1.0);
        return;
    }

    // Displacement parameters (in pixels, scaled by DPR)
    // Scale displacement by reference resolution ratio to maintain consistency across browser zoom levels
    float resolutionScale = iResolution.x / uRefResolution.x;
    vec2 maxDisplacement = vec2(uDisplacementX, uDisplacementY) * uDpr * resolutionScale;

    // Use pre-computed UV from vertex shader (zoom + pan already applied)
    vec2 uv = vContentUv;

    // Base displacement (fine slits)
    // Use raw screen UV (vUv) so slit positions stay fixed on screen regardless of pan/zoom
    float gradientStart = 1.0;
    float gradientEnd = 0.0;
    float gradientPower = 1.0;
    float centerPoint = 0.5;
    vec2 displacementData = createStripedDisplacement(
        vUv,
        numSegments,
        angle,
        gradientStart,
        gradientEnd,
        gradientPower,
        centerPoint,
        aspect
    );
    float signedDisplacement = displacementData.x;
    float localUVx = displacementData.y;

    // ============================================
    // LAYER 2: Inner glass effect (larger slits, center only, STATIC)
    // ============================================
    // Inner segments are a divisor of outer segments for perfect alignment
    // 45 / 5 = 9 segments (5x larger slits that align with outer grid)
    float innerNumSegments = numSegments;
    float innerAngle = angle;            // Same angle as outer

    // Inner slits are STATIC - use raw screen UV so slits stay fixed on screen
    vec2 innerDisplacementData = createStripedDisplacement(
        vUv,
        innerNumSegments,
        innerAngle,
        gradientStart,
        gradientEnd,
        gradientPower,
        centerPoint,
        aspect
    );
    float innerSignedDisplacement = innerDisplacementData.x;
    float innerLocalUVx = innerDisplacementData.y;

    // ============================================
    // COMPUTE SOLID CORE MASK EARLY (needed for light & displacement masking)
    // ============================================
    vec4 videoFrameSample = texture2D(uVideoTexture, uv);
    float maskIntensity = luminance(videoFrameSample.rgb);
    float solidCoreMask = smoothstep(0.4, 0.7, maskIntensity);

    // Store original displacement for shape refraction (before masking)
    float originalInnerDisplacement = innerSignedDisplacement;

    // Mask inner displacement by solidCoreMask - no inner displacement in center
    innerSignedDisplacement *= (1.0 - solidCoreMask);

    // Inner layer displacement uses same values (scaled by resolutionScale for zoom independence)
    vec2 innerMaxDisplacement = vec2(30.0, 0.0) * uDpr * resolutionScale;

    // ============================================
    // CENTER ELEMENT (Static Ellipse + Animated Shapes)
    // ============================================
    float staticEllipseMask = 0.0;
    float staticEllipseGradient = 0.0;
    ShapeData shapeData;
    shapeData.shape = 0.0;
    shapeData.gradient = 0.0;

    float centerFadeInDuration = 10.0;
    float centerFramesSinceStart = uFrameCount - uLightStartFrame;
    float centerEffectActivation = clamp(centerFramesSinceStart / centerFadeInDuration, 0.0, 1.0);

    if (uEnableCenterElement > 0.5) {
        // Calculate static ellipse mask
        {
            const float ellipseCenterX = 0.3;
            const float ellipseCenterY = -0.15;
            const float ellipseWidth = 0.5;
            const float ellipseHeight = 0.8;
            const float ellipseAngle = 0.3;
            const float ellipseSoftness = 1.0;
            const float ellipseGrayLevel = 0.5;

            float aspect = iResolution.x / iResolution.y;

            // Use RAW UV (no displacement) for the mask calculation
            vec2 delta = uv - vec2(ellipseCenterX, ellipseCenterY);

            // Rotate
            float cosA = cos(ellipseAngle);
            float sinA = sin(ellipseAngle);
            vec2 rotatedDelta = vec2(
                delta.x * cosA - delta.y * sinA,
                delta.x * sinA + delta.y * cosA
            );
            rotatedDelta.x *= aspect;

            // Calculate ellipse distance
            float ellipseDist = sdEllipse(rotatedDelta, vec2(ellipseWidth, ellipseHeight));

            // Soft shape mask
            staticEllipseMask = 1.0 - smoothstep(-ellipseSoftness * 0.1, ellipseSoftness * 0.05, ellipseDist);

            // Gradient
            float normalizedDist = ellipseDist / max(ellipseWidth, ellipseHeight) + 1.0;
            normalizedDist = clamp(normalizedDist, 0.0, 1.0);
            staticEllipseGradient = mix(1.0, ellipseGrayLevel, smoothstep(0.0, 1.0, normalizedDist));

            // Apply solid core mask
            staticEllipseMask *= solidCoreMask;
        }

        // Block displacement inside the static ellipse
        originalInnerDisplacement *= (1.0 - staticEllipseMask);
        innerSignedDisplacement *= (1.0 - staticEllipseMask);
        signedDisplacement *= (1.0 - staticEllipseMask);



        // Calculate displaced UV for shape - use inner displacement for the shape refraction
        vec2 shapeDisplacedUV = applyDisplacement(uv, originalInnerDisplacement, innerMaxDisplacement, iResolution);

        // Calculate animated shape using DISPLACED UVs so glass slits refract through it
        shapeData = calculateAnimatedShape(
            shapeDisplacedUV,  // Use displaced UVs!
            uCenterAnimTime,   // Time-based animation in seconds (resets with video loop)
            solidCoreMask,
            iResolution
        );

        // Combine static ellipse with animated shapes
        {
            float combinedShape = max(shapeData.shape, staticEllipseMask) * centerEffectActivation;
            float totalMask = shapeData.shape + staticEllipseMask;
            float combinedGradient = shapeData.gradient;
            if (totalMask > 0.001) {
                combinedGradient = (shapeData.gradient * shapeData.shape + staticEllipseGradient * staticEllipseMask) / totalMask;
            }
            shapeData.shape = combinedShape;
            shapeData.gradient = combinedGradient;
        }
    }

    // ============================================
    // INNER EFFECT ACTIVATION - starts after uLightStartFrame
    // ============================================
    float innerFadeInDuration = 10.0;  // Slower fade-in for inner effect
    float innerFramesSinceStart = uFrameCount - uLightStartFrame;
    float innerEffectActivation = clamp(innerFramesSinceStart / innerFadeInDuration, 0.0, 1.0);

    // Create edge mask (solidCoreMask already computed earlier for light masking)
    float edgeMask = smoothstep(0.3, 0.6, maskIntensity);      // Where shape starts

    // Blend outer and inner slits on the edges
    // Inner contribution is multiplied by activation (fades in after frame 200)
    float outerContribution = 1.0 - edgeMask * 0.5 * innerEffectActivation;
    float innerContribution = edgeMask * innerEffectActivation;

    // Combined displacement: inner effect fades in over time
    float combinedDisplacement = signedDisplacement * outerContribution +
                                  innerSignedDisplacement * innerContribution;

    // Blend max displacement smoothly
    vec2 combinedMaxDisplacement = maxDisplacement * outerContribution +
                                    innerMaxDisplacement * innerContribution;

    // For the CENTER area (solidCoreMask): use 100% inner (larger) slits displacement
    // For the EDGES: use the combined displacement (blended outer + inner)
    // This ensures the logo center always has the larger slits
    combinedDisplacement = mix(combinedDisplacement, originalInnerDisplacement, solidCoreMask);
    combinedMaxDisplacement = mix(combinedMaxDisplacement, innerMaxDisplacement, solidCoreMask);

    // ============================================
    // LAYER 1: DISPLACEMENT (toggleable)
    // ============================================
    vec4 textureSample;
    if (uEnableDisplacement > 0.5) {
        textureSample = sampleWithDisplacement(
            uVideoTexture, uv,
            combinedDisplacement, combinedMaxDisplacement,
            iResolution
        );
    } else {
        // No displacement - sample directly
        textureSample = texture2D(uVideoTexture, uv);
    }

    // Blend localUVx for highlights - also fades in with activation
    float combinedLocalUVx = localUVx * outerContribution + innerLocalUVx * innerContribution;
    localUVx = combinedLocalUVx;

    // Store innerMask for later use (bloom, etc.) - also tied to activation
    float innerMask = edgeMask * innerEffectActivation;

    // Get Phase From: Intensity (Rec. 709 luminance)
    float baseIntensity = luminance(textureSample.rgb);

    // Boost intensity in center areas to push them more towards white
    float centerWhiteBoost = 0.1;
    baseIntensity = baseIntensity + innerMask * centerWhiteBoost;
    baseIntensity = clamp(baseIntensity, 0.0, 1.0);

    // Keep base intensity for outer colorama (using uGradientMap)
    float outerIntensity = baseIntensity;

    // ============================================
    // CENTER GREEN STRIPES OVERLAY (before colorama)
    // ============================================
    float stripeFadeOutDuration = 10.0;
    float stripeFramesSinceStart = uFrameCount - uLightStartFrame;
    // Effect is active UNTIL uLightStartFrame, then fades out
    float stripeEffectActivation = 1.0 - clamp(stripeFramesSinceStart / stripeFadeOutDuration, 0.0, 1.0);

    // Animated vertical height mask - grows from 0 to full height
    // Height animation: starts at center (0.5) and expands outward
    float stripeHeightDelay = 15.0;  // frames to wait before starting
    float stripeHeightGrowDuration = 80.0;  // frames to reach full height
    float stripeHeightProgress = clamp((uFrameCount - stripeHeightDelay) / stripeHeightGrowDuration, 0.0, 1.0);
    // Ease the progress for smoother animation
    float easedHeightProgress = 1.0 - pow(1.0 - stripeHeightProgress, 2.0);
    
    // Calculate animated bounds - expand from center (0.5) outward
    float heightHalfSpan = 0.2 * easedHeightProgress;  // 0.06 = half of the 0.12 total height (0.44 to 0.56)
    float softEdge = 0.1 * easedHeightProgress;        // Soft edge also scales with progress
    float bottomEdge = 0.5 - heightHalfSpan - softEdge;
    float bottomFull = 0.5 - heightHalfSpan;
    float topFull = 0.5 + heightHalfSpan;
    float topEdge = 0.5 + heightHalfSpan + softEdge;
    
    // When progress is 0, force mask to 0 to avoid glitchy edge at y=0.5
    float stripeHeightMask = easedHeightProgress > 0.001 
        ? smoothstep(bottomEdge, bottomFull, uv.y) * smoothstep(topEdge, topFull, uv.y)
        : 0.0;

    vec4 centerGreenSlantedLines = createStripes(
      vUv + vec2(-0.0035, 0.0),                     // slight offset to avoid moiré
      numSegments,
      uSlitAngle,
      0.15,                                       // stopPosition (20%)
      vec4(20.0/255.0, 200.0/255.0, 20.0/255.0, 0.2), // colorStart (green at 0%)
      vec4(0.0, 0.0, 0.0, 0.0),                       // colorMid (white at 20%)
      aspect                                          // aspect ratio for consistent angle
    ) * solidCoreMask * stripeHeightMask;

    // Overlay green stripes on center element area
    float stripeOverlayMask = solidCoreMask * stripeEffectActivation;
    // Modify baseIntensity/outerIntensity with stripes before colorama
    vec4 stripedTexture = vec4(textureSample.rgb, 1.0) - centerGreenSlantedLines*0.7 * stripeOverlayMask;
    stripedTexture = clamp(stripedTexture, 0.0, 1.0);

    // Update intensity for colorama input
    float stripedIntensity = luminance(stripedTexture.rgb);
    outerIntensity = mix(baseIntensity, stripedIntensity, stripeOverlayMask);

    // ============================================
    // LAYER 2: COLORAMA (toggleable)
    // ============================================
    vec3 color;
    if (uEnableColorama > 0.5) {
        // OUTER colorama: uses base intensity, cross-fades between uGradientMap and uGradientMap2
        vec3 outerColoramaResult1 = applyColoramaWithGradient(
            uGradientMap, outerIntensity,
            uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
            uCycleRepetitions, uPhaseShift, uCycleSpeed,
            uWrapMode, uReverse
        );
        vec3 outerColoramaResult2 = applyColoramaWithGradient(
            uGradientMap2, outerIntensity,
            uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
            uCycleRepetitions, uPhaseShift, uCycleSpeed,
            uWrapMode, uReverse
        );
        vec3 outerColoramaResult = mix(outerColoramaResult1, outerColoramaResult2, uGradientMapBlend);

        // Start with outer colorama as base
        vec3 blendedColorama = outerColoramaResult;

        // CENTER colorama: only compute when inside shape (skip texture sample otherwise)
        // This saves a texture lookup + specular pow() for ~90% of pixels
        if (shapeData.shape > 0.001) {
            vec3 centerColoramaResult = applyColoramaWithGradient(
                uCenterGradientMap, shapeData.gradient,
                uInputMin, uInputMax, uModifyGamma, uPosterizeLevels,
                uCycleRepetitions, uPhaseShift, uCycleSpeed,
                uWrapMode, uReverse
            );

            // Add specular highlight to center (shiny reflection effect)
            float specularPower = 8.0;      // Higher = tighter/smaller highlight
            float specularIntensity = 1.9;  // Brightness of the specular
            float specular = pow(shapeData.gradient, specularPower) * specularIntensity;
            centerColoramaResult += vec3(specular);  // Add bright highlight

            // Blend between outer and center colorama based on shape
            blendedColorama = mix(outerColoramaResult, centerColoramaResult, shapeData.shape);
        }

        color = mix(blendedColorama, textureSample.rgb, uBlendWithOriginal);
    } else {
        color = textureSample.rgb;
    }

    // Store intensity for bloom (use the blended value)
    float intensity = mix(outerIntensity, shapeData.gradient, shapeData.shape);

    // ============================================
    // LAYER 3: BLOOM (toggleable)
    // ============================================
    if (uEnableBloom > 0.5) {
        color = applyBloom(color, intensity, innerMask);
    }

    // ============================================
    // LAYER 4: SHAPE HIGHLIGHT (toggleable via light sweep toggle)
    // ============================================
    if (uEnableLightSweep > 0.5) {
        float lightFadeInDuration = 30.0;
        float framesSinceStart = uFrameCount - uLightStartFrame;
        float lightActivation = clamp(framesSinceStart / lightFadeInDuration, 0.0, 1.0);

        // Add subtle brightness boost at shape center
        float shapeHighlight = pow(shapeData.gradient, 2.0) * shapeData.shape;
        color += vec3(1.0) * shapeHighlight * 0.15 * uLightIntensity * lightActivation;
    }

    // Color correction and edge feathering (shared with ripple mode)
    color = applyColorCorrection(color);
    color = applyEdgeFeathering(color);

    gl_FragColor = vec4(color, 1.0);
}
`;

export { rzpGlassFragmentShader, rzpGlassVertexShader };
