import { useEffect, useRef } from "react";
import { Renderer, Geometry, Program, Mesh, Texture } from "ogl";

function GradientBlinds() {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set device pixel ratio (capped at 2x to balance quality and performance)
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Initialize WebGL renderer with full window dimensions
    const renderer = new Renderer({
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: dpr,
    });

    // Get WebGL context and append canvas to container
    const gl = renderer.gl;
    const canvas = gl.canvas;
    
    // Style the canvas to cover the full screen
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    
    containerRef.current.appendChild(canvas);

    // ============================================================================
    // VIDEO TEXTURE SETUP
    // ============================================================================
    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const video = document.createElement("video");
    video.src = "/dashboard/bg-trimmed-color.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    video.play().catch((e) => {
      console.log("Video autoplay failed:", e);
      document.addEventListener("click", () => video.play(), { once: true });
    });

    // ============================================================================
    // CENTER SHAPE TEXTURE SETUP
    // ============================================================================
    const shapeTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const shapeImage = new Image();
    shapeImage.crossOrigin = "anonymous";
    shapeImage.onload = () => {
      shapeTexture.image = shapeImage;
      shapeTexture.needsUpdate = true;
    };
    shapeImage.src = "/dashboard/centerShape.svg";

    // ============================================================================
    // SHADER PROGRAM
    // ============================================================================
    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;

        uniform float uTime;
        uniform vec2 iResolution;
        uniform float uDpr;
        uniform float uZoom;
        uniform sampler2D iChannel0;
        uniform sampler2D iChannel1;

        varying vec2 vUv;
        
        float hash(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }
        
        float valueNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }
        
        vec3 applyFilmGrain(vec3 color, vec2 uv, vec2 resolution, float dpr, float time) {
            float grainScale = 120.0;
            float grainIntensity = 0.06;
            vec2 grainUV = uv * resolution / dpr;
            float grain = valueNoise(grainUV * grainScale / 100.0 + time * 0.5);
            grain = grain * 0.7 + 0.3;
            return color + grain * grainIntensity;
        }

        vec3 applyColoramaFromLuma(float luminance, float inputPhase, float cycleRepetitions) {
            vec3 color0 = vec3(1,1,1);
            vec3 color01 = vec3(0.843, 0.859, 0.867);
            vec3 color02 = vec3(0.937, 0.961, 0.933);
            vec3 color03 = vec3(0.898, 0.961, 0.839);
            vec3 color04 = vec3(0.561, 0.796, 0.996);
            vec3 color05 = vec3(0.165, 0.314, 0.878);
            vec3 color06 = vec3(0.161, 0.318, 0.878);
            vec3 color1 = vec3(0.937, 0.961, 0.933);
            vec3 color2 = vec3(0.898, 0.961, 0.839);
            vec3 color3 = vec3(0.090, 0.322, 0.914);
            vec3 color4 = vec3(0.090, 0.322, 0.914);
            
            float t = fract(luminance * cycleRepetitions + inputPhase);
            
            vec3 colorResult;
            float localT;
           
            if(t < 0.25){
                localT = t / 0.25;
                vec3 bg1 = vec3(0.980, 0.990, 0.975);
                vec3 bg2 = vec3(0.960, 0.980, 0.950);
                colorResult = mix(bg1, bg2, smoothstep(0.0, 1.0, localT));
            
            } else if (t < 0.50) {
                localT = (t - 0.25) / 0.25;
                float gradientPos = smoothstep(0.0, 1.0, localT);
                
                vec3 green1 = vec3(0.980, 0.990, 0.975);
                vec3 green2 = vec3(0.960, 0.980, 0.950);
                vec3 green3 = vec3(0.937, 0.961, 0.933);
                vec3 green4 = vec3(0.920, 0.955, 0.910);
                vec3 green5 = vec3(0.898, 0.961, 0.839);
                vec3 green6 = vec3(0.880, 0.950, 0.820);
                
                vec3 greenGradient;
                if (gradientPos < 0.20) {
                    greenGradient = mix(green1, green2, gradientPos / 0.20);
                } else if (gradientPos < 0.40) {
                    greenGradient = mix(green2, green3, (gradientPos - 0.20) / 0.20);
                } else if (gradientPos < 0.60) {
                    greenGradient = mix(green3, green4, (gradientPos - 0.40) / 0.20);
                } else if (gradientPos < 0.80) {
                    greenGradient = mix(green4, green5, (gradientPos - 0.60) / 0.20);
                } else {
                    greenGradient = mix(green5, green6, (gradientPos - 0.80) / 0.20);
                }
                
                vec3 blue1 = vec3(0.761, 0.906, 1.000);
                vec3 blue2 = vec3(0.561, 0.796, 0.996);
                vec3 blue3 = vec3(0.400, 0.680, 0.980);
                vec3 blue4 = vec3(0.250, 0.500, 0.930);
                vec3 blue5 = vec3(0.165, 0.314, 0.878);
                vec3 blue6 = vec3(0.161, 0.318, 0.878);
                
                vec3 blueGradient;
                if (gradientPos < 0.20) {
                    blueGradient = mix(blue1, blue2, gradientPos / 0.20);
                } else if (gradientPos < 0.40) {
                    blueGradient = mix(blue2, blue3, (gradientPos - 0.20) / 0.20);
                } else if (gradientPos < 0.60) {
                    blueGradient = mix(blue3, blue4, (gradientPos - 0.40) / 0.20);
                } else if (gradientPos < 0.80) {
                    blueGradient = mix(blue4, blue5, (gradientPos - 0.60) / 0.20);
                } else {
                    blueGradient = mix(blue5, blue6, (gradientPos - 0.80) / 0.20);
                }
                
                colorResult = mix(greenGradient, blueGradient, localT);
             
            } else if (t < 0.75) {
                localT = (t - 0.50) / 0.25;
                colorResult = mix(color05, color06, smoothstep(0.0, 1.0, localT));
            } 
            
            return colorResult;
        }

        vec2 createStripedDisplacement(vec2 uv, float numSegments, float angle) {
            float slantedX = uv.x - uv.y * tan(angle);
            float segmentWidth = 1.0 / numSegments;
            float localUVx = fract(slantedX / segmentWidth);
            float displacement = 1.0 - localUVx;
            displacement = pow(displacement, 0.5);
            float signedDisplacement = (displacement - 0.5) * 2.0;
            
            return vec2(signedDisplacement, localUVx);
        }

        vec2 coverUV(vec2 uv, vec2 screenSize, vec2 imageSize) {
            float screenAspect = screenSize.x / screenSize.y;
            float imageAspect = imageSize.x / imageSize.y;
            
            vec2 scale = vec2(1.0);
            if (screenAspect > imageAspect) {
                scale.y = imageAspect / screenAspect;
            } else {
                scale.x = screenAspect / imageAspect;
            }
            
            vec2 offset = (1.0 - scale) * 0.5;
            return uv * scale + offset;
        }
        
        vec2 applyDisplacement(vec2 uv, float signedDisplacement, vec2 maxDisplacement, vec2 resolution) {
            vec2 displaceOffset = vec2(
                signedDisplacement * maxDisplacement.x / resolution.x,
                signedDisplacement * maxDisplacement.y / resolution.y
            );
            return uv + displaceOffset;
        }

        const float MAX_BLUR_RADIUS = 2.0;
        vec4 applyBlurWithDisplacement(
            sampler2D tex, 
            vec2 uv,
            float signedDisplacement, vec2 maxDisplacement,
            vec2 resolution, vec2 imageSize, float radius, float sigma
        ) {
            vec4 color = vec4(0.0);
            float totalWeight = 0.0;
            
            vec2 displaceOffset = vec2(
                signedDisplacement * maxDisplacement.x / resolution.x,
                signedDisplacement * maxDisplacement.y / resolution.y
            );
            
            vec2 displacedUV = uv + displaceOffset;
            
            for (float x = -MAX_BLUR_RADIUS; x <= MAX_BLUR_RADIUS; x++) {
                for (float y = -MAX_BLUR_RADIUS; y <= MAX_BLUR_RADIUS; y++) {
                    if (abs(x) > radius || abs(y) > radius) continue;
                    
                    vec2 offset = vec2(x, y) / resolution;
                    float weight = exp(-(x * x + y * y) / (2.0 * sigma * sigma));
                    
                    color += texture2D(tex, coverUV(displacedUV + offset, resolution, imageSize)) * weight;
                    
                    totalWeight += weight;
                }
            }
            
            return color / totalWeight;
        }

        void main() {
            const float u_numSegments = 60.0;
            const float angle = 0.13;
            const float blurRadius = 6.0;
            const float sigma = 4.0;
            
            const vec2 imageSize = vec2(4500.0, 3000.0);
            
            vec2 maxDisplacement = vec2(22.0, 29.0) * uDpr;

            // Apply zoom: scale UV coordinates from center (0.5, 0.5)
            // This zooms EVERYTHING uniformly - video, shapes, and all effects
            vec2 uv = (vUv - 0.5) / uZoom + 0.5;
            
            vec2 displacementData = createStripedDisplacement(uv, u_numSegments, angle);
            float signedDisplacement = displacementData.x;
            float localUVx = displacementData.y;
            
            vec4 lumaTexture = applyBlurWithDisplacement(
                               iChannel0,
                               uv,
                               signedDisplacement, maxDisplacement,
                               iResolution, imageSize, blurRadius, sigma
                              );
            float luma = dot(lumaTexture.rgb, vec3(0.299, 0.587, 0.114));
            
            float inputPhase = 1.85;
            float cycleRepetitions = 1.0;
            vec3 color = applyColoramaFromLuma(luma, inputPhase, cycleRepetitions);
            
           color = applyFilmGrain(color, uv, iResolution, uDpr, uTime);

            float shapeScaleX = 0.139;
            float shapeScaleY = 0.50;
            float shapeOffsetX = 0.5;
            float shapeOffsetY = 0.45;

            float screenAspect = iResolution.x / iResolution.y;
            vec2 shapeScale = vec2(shapeScaleX * screenAspect, shapeScaleY);

            // Use zoomed uv for proper scaling with zoom
            vec2 shapeUV = (uv - vec2(shapeOffsetX, shapeOffsetY)) / shapeScale + 0.5;

            if (shapeUV.x >= 0.0 && shapeUV.x <= 1.0 && shapeUV.y >= 0.0 && shapeUV.y <= 1.0) {
                vec4 shapeColor = texture2D(iChannel1, shapeUV);
                
                if (shapeColor.a > 0.0) {
                    
                    float edgeProximity = 1.0 - shapeColor.a;
                    edgeProximity = smoothstep(0.0, 0.5, edgeProximity);
                    
                    float edgeBlurRadius = 8.0;
                    float edgeBlurSigma = 4.0;
                    
                    vec3 blurredBg = vec3(0.0);
                    float blurWeight = 0.0;
                    
                    for (float bx = -3.0; bx <= 3.0; bx += 1.0) {
                        for (float by = -3.0; by <= 3.0; by += 1.0) {
                            vec2 blurOffset = vec2(bx, by) * edgeBlurRadius / iResolution;
                            float weight = exp(-(bx * bx + by * by) / (2.0 * edgeBlurSigma * edgeBlurSigma));
                            
                            vec2 sampleUV = uv + blurOffset;
                            
                            vec2 sampleDisp = createStripedDisplacement(sampleUV, u_numSegments, angle);
                            vec4 sampleLuma = applyBlurWithDisplacement(
                                iChannel0, sampleUV,
                                sampleDisp.x, maxDisplacement,
                                iResolution, imageSize, blurRadius, sigma
                            );
                            float sampleL = dot(sampleLuma.rgb, vec3(0.299, 0.587, 0.114));
                            vec3 sampleColor = applyColoramaFromLuma(sampleL, inputPhase, cycleRepetitions);
                            
                            blurredBg += sampleColor * weight;
                            blurWeight += weight;
                        }
                    }
                    blurredBg /= blurWeight;
                    
                    vec3 baseLightBlue = vec3(0.90, 0.95, 1.0);
                    vec3 shapeResult = baseLightBlue;
                    
                    vec3 purpleColor = vec3(0.65, 0.45, 0.85);
                    vec3 deepPurple = vec3(0.45, 0.25, 0.70);
                    vec3 lightPurple = vec3(0.80, 0.65, 0.95);
                    
                    float purpleEdgeDist = shapeColor.a;
                    float purpleZone = smoothstep(0.0, 0.6, 1.0 - purpleEdgeDist);
                    
                    vec3 purpleGradient = mix(lightPurple, purpleColor, purpleZone);
                    
                    shapeResult = mix(shapeResult, purpleGradient, purpleZone * 0.7);
                    
                    float shadowDepth = 0.4;
                    float shadowSpread = 0.5;
                    
                    float innerShadow = smoothstep(0.0, shadowSpread, 1.0 - shapeColor.a);
                    
                    vec2 shadowDir = normalize(vec2(-0.5, 0.5));
                    vec2 centeredUV = shapeUV - 0.5;
                    float directionalBias = dot(normalize(centeredUV), shadowDir) * 0.5 + 0.5;
                    innerShadow *= mix(0.6, 1.0, directionalBias);
                    
                    vec3 shadowColor = mix(deepPurple, vec3(0.3, 0.2, 0.4), 0.5);
                    shapeResult = mix(shapeResult, shadowColor, innerShadow * shadowDepth);
                    
                    float centerNumStripes = 3.0;
                    float centerSlitAngle = 0.30;
                    
                    float slantedX = uv.x - uv.y * tan(centerSlitAngle);
                    
                    float shapeScreenWidth = shapeScale.x;
                    float segmentWidth = shapeScreenWidth / centerNumStripes;
                    float localStripePos = fract(slantedX / segmentWidth);
                    
                    float shapeLeftX = shapeOffsetX - shapeScale.x * 0.5;
                    float normalizedX = (slantedX - shapeLeftX) / shapeScale.x;
                    float stripeIndex = floor(normalizedX * centerNumStripes);
                    stripeIndex = clamp(stripeIndex, 0.0, centerNumStripes - 1.0);
                    
                    vec3 paleBlue = vec3(0.92, 0.96, 1.0);
                    vec3 lightBlue = vec3(0.82, 0.91, 0.98);
                    vec3 mediumBlue = vec3(0.65, 0.82, 0.95);
                    vec3 deeperBlue = vec3(0.50, 0.75, 0.92);
                    
                    float animSpeed = 1.5;
                    float waveDuration = 0.6;
                    float holdTime = 1.0;
                    float cycleTime = (centerNumStripes * waveDuration) + holdTime + 1.0;
                    
                    float animTime = mod(uTime * animSpeed, cycleTime);
                    
                    float stripeActivation = (animTime / waveDuration) - stripeIndex;
                    float slitFill = smoothstep(0.0, 1.0, stripeActivation);
                    
                    float allFilledTime = centerNumStripes * waveDuration;
                    if (animTime > allFilledTime && animTime < allFilledTime + holdTime) {
                        slitFill = 1.0;
                    }
                    
                    float resetStart = allFilledTime + holdTime;
                    if (animTime > resetStart) {
                        float resetProgress = (animTime - resetStart) / 1.0;
                        slitFill = 1.0 - smoothstep(0.0, 1.0, resetProgress);
                    }
                    
                    float stripeProgress = localStripePos;
                    stripeProgress = pow(stripeProgress, 0.6);
                    
                    vec3 inactiveColor;
                    if (stripeProgress < 0.5) {
                        inactiveColor = mix(paleBlue, lightBlue, stripeProgress * 2.0);
                    } else {
                        inactiveColor = mix(lightBlue, paleBlue, (stripeProgress - 0.5) * 2.0);
                    }
                    
                    vec3 activeColor;
                    if (stripeProgress < 0.5) {
                        activeColor = mix(lightBlue, mediumBlue, stripeProgress * 2.0);
                    } else {
                        activeColor = mix(mediumBlue, deeperBlue, (stripeProgress - 0.5) * 2.0);
                    }
                    
                    vec3 stripeColor = mix(inactiveColor, activeColor, slitFill);
                    
                    vec3 highlightBlue = vec3(0.88, 0.94, 0.99);
                    float edgeHighlight = smoothstep(0.0, 0.08, localStripePos) * 
                                         smoothstep(1.0, 0.92, localStripePos);
                    stripeColor = mix(stripeColor, highlightBlue, edgeHighlight * 0.2);
                    
                    float activeGlow = smoothstep(0.05, 0.0, localStripePos) * slitFill * 0.15;
                    stripeColor = mix(stripeColor, deeperBlue, activeGlow);
                    
                    float centerDisplacement = 1.0 - localStripePos;
                    centerDisplacement = pow(centerDisplacement, 0.5);
                    float signedCenterDisp = (centerDisplacement - 0.5) * 2.0;
                    
                    vec2 centerMaxDisp = vec2(8.0, 12.0) * uDpr;
                    
                    vec2 centerDispOffset = vec2(
                        signedCenterDisp * centerMaxDisp.x / iResolution.x,
                        signedCenterDisp * centerMaxDisp.y / iResolution.y
                    );
                    
                    vec2 displacedSampleUV = uv + centerDispOffset * slitFill;
                    
                    vec2 sampleDisp = createStripedDisplacement(displacedSampleUV, u_numSegments, angle);
                    vec4 refractedLuma = applyBlurWithDisplacement(
                        iChannel0, displacedSampleUV,
                        sampleDisp.x, maxDisplacement,
                        iResolution, imageSize, 2.0, 2.0
                    );
                    float refractedL = dot(refractedLuma.rgb, vec3(0.299, 0.587, 0.114));
                    vec3 refractedColor = applyColoramaFromLuma(refractedL, inputPhase, cycleRepetitions);
                    
                    float glassRefraction = 0.15 * slitFill;
                    stripeColor = mix(stripeColor, refractedColor, glassRefraction);
                    
                    vec3 blurredStripeColor = vec3(0.0);
                    float stripeBlurWeight = 0.0;
                    float stripeBlurRadius = 6.0;
                    float stripeBlurSigma = 3.0;
                    
                    for (float bx = -2.0; bx <= 2.0; bx += 1.0) {
                        for (float by = -2.0; by <= 2.0; by += 1.0) {
                            vec2 sampleOffset = vec2(bx, by) * stripeBlurRadius / iResolution;
                            float weight = exp(-(bx * bx + by * by) / (2.0 * stripeBlurSigma * stripeBlurSigma));
                            
                            vec2 blurSampleUV = uv + sampleOffset;
                            
                            float sampleSlantedX = blurSampleUV.x - blurSampleUV.y * tan(centerSlitAngle);
                            float sampleLocalStripePos = fract(sampleSlantedX / segmentWidth);
                            float sampleStripeProgress = pow(sampleLocalStripePos, 0.6);
                            
                            vec3 sampleInactiveColor;
                            if (sampleStripeProgress < 0.5) {
                                sampleInactiveColor = mix(paleBlue, lightBlue, sampleStripeProgress * 2.0);
                            } else {
                                sampleInactiveColor = mix(lightBlue, paleBlue, (sampleStripeProgress - 0.5) * 2.0);
                            }
                            
                            vec3 sampleActiveColor;
                            if (sampleStripeProgress < 0.5) {
                                sampleActiveColor = mix(lightBlue, mediumBlue, sampleStripeProgress * 2.0);
                            } else {
                                sampleActiveColor = mix(mediumBlue, deeperBlue, (sampleStripeProgress - 0.5) * 2.0);
                            }
                            
                            vec3 sampleStripeColor = mix(sampleInactiveColor, sampleActiveColor, slitFill);
                            
                            blurredStripeColor += sampleStripeColor * weight;
                            stripeBlurWeight += weight;
                        }
                    }
                    blurredStripeColor /= stripeBlurWeight;
                    
                    float blurIntensity = 0.65;
                    stripeColor = mix(stripeColor, blurredStripeColor, blurIntensity);
                    
                    shapeResult = stripeColor;
                    
                    shapeResult = applyFilmGrain(shapeResult, uv, iResolution, uDpr, uTime);
                    
                    float alphaEdge = 1.0 - shapeColor.a;
                    float edgeZone = smoothstep(0.0, 0.7, alphaEdge);
                    float combinedEdge = max(edgeProximity, edgeZone);
                    
                    float softEdge = pow(combinedEdge, 0.6);
                    
                    float edgeBlurSize = 18.0 * softEdge;
                    vec2 blurStep = vec2(edgeBlurSize) / iResolution;
                    
                    vec3 gaussianBlurColor = blurredBg;
                    
                    if (softEdge > 0.05) {
                        vec3 blurSum = blurredBg * 0.35;
                        float weightSum = 0.35;
                        
                        vec2 s1 = uv + vec2(blurStep.x, 0.0);
                        vec2 s2 = uv + vec2(-blurStep.x, 0.0);
                        vec2 s3 = uv + vec2(0.0, blurStep.y);
                        vec2 s4 = uv + vec2(0.0, -blurStep.y);
                        
                        vec2 s5 = uv + vec2(blurStep.x * 0.7, blurStep.y * 0.7);
                        vec2 s6 = uv + vec2(-blurStep.x * 0.7, blurStep.y * 0.7);
                        vec2 s7 = uv + vec2(blurStep.x * 0.7, -blurStep.y * 0.7);
                        vec2 s8 = uv + vec2(-blurStep.x * 0.7, -blurStep.y * 0.7);
                        
                        vec2 d1 = createStripedDisplacement(s1, u_numSegments, angle);
                        vec4 t1 = applyBlurWithDisplacement(iChannel0, s1, d1.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t1.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.12;
                        
                        vec2 d2 = createStripedDisplacement(s2, u_numSegments, angle);
                        vec4 t2 = applyBlurWithDisplacement(iChannel0, s2, d2.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t2.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.12;
                        
                        vec2 d3 = createStripedDisplacement(s3, u_numSegments, angle);
                        vec4 t3 = applyBlurWithDisplacement(iChannel0, s3, d3.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t3.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.12;
                        
                        vec2 d4 = createStripedDisplacement(s4, u_numSegments, angle);
                        vec4 t4 = applyBlurWithDisplacement(iChannel0, s4, d4.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t4.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.12;
                        
                        vec2 d5 = createStripedDisplacement(s5, u_numSegments, angle);
                        vec4 t5 = applyBlurWithDisplacement(iChannel0, s5, d5.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t5.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.08;
                        
                        vec2 d6 = createStripedDisplacement(s6, u_numSegments, angle);
                        vec4 t6 = applyBlurWithDisplacement(iChannel0, s6, d6.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t6.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.08;
                        
                        vec2 d7 = createStripedDisplacement(s7, u_numSegments, angle);
                        vec4 t7 = applyBlurWithDisplacement(iChannel0, s7, d7.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t7.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.08;
                        
                        vec2 d8 = createStripedDisplacement(s8, u_numSegments, angle);
                        vec4 t8 = applyBlurWithDisplacement(iChannel0, s8, d8.x, maxDisplacement, iResolution, imageSize, 3.0, 3.0);
                        blurSum += applyColoramaFromLuma(dot(t8.rgb, vec3(0.299, 0.587, 0.114)), inputPhase, cycleRepetitions) * 0.08;
                        
                        weightSum += 0.48 + 0.32;
                        gaussianBlurColor = blurSum / weightSum;
                    }
                    
                    float outerBleedIn = smoothstep(0.3, 0.0, shapeColor.a) * 0.6;
                    vec3 outerStripeColor = applyColoramaFromLuma(
                        dot(lumaTexture.rgb, vec3(0.299, 0.587, 0.114)), 
                        inputPhase, cycleRepetitions
                    );
                    shapeResult = mix(shapeResult, outerStripeColor, outerBleedIn);
                    
                    float edgeBlendStrength = 0.9;
                    
                    float blendFactor = smoothstep(0.0, 1.0, softEdge * edgeBlendStrength);
                    shapeResult = mix(shapeResult, gaussianBlurColor, blendFactor);
                    
                    float edgeGlow = smoothstep(0.5, 0.15, softEdge) * 0.08;
                    vec3 glowColor = mix(vec3(0.92, 0.96, 1.0), outerStripeColor, 0.3);
                    shapeResult += edgeGlow * glowColor;
                    
                    color = mix(color, shapeResult, shapeColor.a);
                }
            }

            {
            float shapeScaleXOuter = 0.139;
            float shapeScaleYOuter = 0.50;
            float shapeOffsetXOuter = 0.5;
            float shapeOffsetYOuter = 0.45;
            float screenAspectOuter = iResolution.x / iResolution.y;
            vec2 shapeScaleOuter = vec2(shapeScaleXOuter * screenAspectOuter, shapeScaleYOuter);
            vec2 shapeUVOuter = (uv - vec2(shapeOffsetXOuter, shapeOffsetYOuter)) / shapeScaleOuter + 0.5;
            
            vec4 shapeAlphaCheck = vec4(0.0);
            if (shapeUVOuter.x >= 0.0 && shapeUVOuter.x <= 1.0 && shapeUVOuter.y >= 0.0 && shapeUVOuter.y <= 1.0) {
                shapeAlphaCheck = texture2D(iChannel1, shapeUVOuter);
            }
            
            if (shapeAlphaCheck.a < 0.1) {
                    float purpleRadius = 20.0;
                float closestAlpha = 0.0;
                
                for (float px = -1.0; px <= 1.0; px += 0.5) {
                    for (float py = -1.0; py <= 1.0; py += 0.5) {
                        vec2 sampleOffset = vec2(px, py) * purpleRadius / iResolution;
                        vec2 sampleVUv = uv + sampleOffset;
                        vec2 sampleShapeUV = (sampleVUv - vec2(shapeOffsetXOuter, shapeOffsetYOuter)) / shapeScaleOuter + 0.5;
                        
                        if (sampleShapeUV.x >= 0.0 && sampleShapeUV.x <= 1.0 && 
                            sampleShapeUV.y >= 0.0 && sampleShapeUV.y <= 1.0) {
                            vec4 sampleShape = texture2D(iChannel1, sampleShapeUV);
                            closestAlpha = max(closestAlpha, sampleShape.a);
                        }
                    }
                }
                
                if (closestAlpha > 0.1) {
                        
                        vec3 outerGlassColor = color;
                        
                        vec3 purpleTint = vec3(0.70, 0.50, 0.90);
                        vec3 lightPurpleTint = vec3(0.85, 0.75, 0.95);
                        
                        float purpleIntensity = smoothstep(0.1, 0.8, closestAlpha) * 0.65;
                        
                        vec3 purpleTintedGlass = mix(outerGlassColor, outerGlassColor * purpleTint * 1.3, purpleIntensity);
                        
                        vec3 purpleGlow = purpleTint * purpleIntensity * 0.4;
                        purpleTintedGlass += purpleGlow;
                        
                        vec2 purpleDispData = createStripedDisplacement(uv, u_numSegments, angle);
                        float purpleLocalUVx = purpleDispData.y;
                        
                        float stripeHighlight = smoothstep(0.0, 0.10, purpleLocalUVx) * 
                                               smoothstep(1.0, 0.90, purpleLocalUVx);
                        vec3 highlightColor = mix(lightPurpleTint, vec3(0.95, 0.92, 1.0), 0.5);
                        purpleTintedGlass = mix(purpleTintedGlass, highlightColor, stripeHighlight * 0.12);
                        
                        float edgeBlend = smoothstep(0.0, 0.5, closestAlpha);
                        color = mix(outerGlassColor, purpleTintedGlass, edgeBlend);
                    }
                }
            }

            {
                float blurShapeScaleX = 0.139;
                float blurShapeScaleY = 0.50;
                float blurShapeOffsetX = 0.5;
                float blurShapeOffsetY = 0.45;
                float blurScreenAspect = iResolution.x / iResolution.y;
                vec2 blurShapeScale = vec2(blurShapeScaleX * blurScreenAspect, blurShapeScaleY);
                vec2 blurShapeUV = (uv - vec2(blurShapeOffsetX, blurShapeOffsetY)) / blurShapeScale + 0.5;
                
                float blurRegionAlpha = 0.0;
                float blurExtendRadius = 35.0;
                
                if (blurShapeUV.x >= 0.0 && blurShapeUV.x <= 1.0 && 
                    blurShapeUV.y >= 0.0 && blurShapeUV.y <= 1.0) {
                    vec4 blurShapeColor = texture2D(iChannel1, blurShapeUV);
                    blurRegionAlpha = blurShapeColor.a;
                }
                
                float nearbyAlpha = 0.0;
                float nearbyDistance = 999.0;
                float totalNearbyWeight = 0.0;
                float weightedAlpha = 0.0;
                
                for (float bx = -1.0; bx <= 1.0; bx += 0.25) {
                    for (float by = -1.0; by <= 1.0; by += 0.25) {
                        vec2 nearbyOffset = vec2(bx, by) * blurExtendRadius / iResolution;
                        vec2 nearbyVUv = uv + nearbyOffset;
                        vec2 nearbyShapeUV = (nearbyVUv - vec2(blurShapeOffsetX, blurShapeOffsetY)) / blurShapeScale + 0.5;
                        
                        if (nearbyShapeUV.x >= 0.0 && nearbyShapeUV.x <= 1.0 && 
                            nearbyShapeUV.y >= 0.0 && nearbyShapeUV.y <= 1.0) {
                            vec4 nearbyShape = texture2D(iChannel1, nearbyShapeUV);
                            if (nearbyShape.a > 0.01) {
                                float dist = length(vec2(bx, by));
                                float weight = exp(-dist * dist * 2.0);
                                weightedAlpha += nearbyShape.a * weight;
                                totalNearbyWeight += weight;
                                nearbyAlpha = max(nearbyAlpha, nearbyShape.a);
                                nearbyDistance = min(nearbyDistance, dist);
                            }
                        }
                    }
                }
                
                if (totalNearbyWeight > 0.0) {
                    weightedAlpha /= totalNearbyWeight;
                }
                
                float edgeGradient = 1.0 - smoothstep(0.0, 1.5, nearbyDistance);
                edgeGradient = edgeGradient * edgeGradient;
                
                float inBlurRegion = max(blurRegionAlpha, edgeGradient * weightedAlpha);
                
                if (inBlurRegion > 0.001) {
                    float overlayBlurRadius = 45.0;
                    float overlayBlurSigma = 18.0;
                    
                    vec3 blurredColor = vec3(0.0);
                    float blurTotalWeight = 0.0;
                    
                    for (float bx = -4.0; bx <= 4.0; bx += 1.0) {
                        for (float by = -4.0; by <= 4.0; by += 1.0) {
                            vec2 blurOffset = vec2(bx, by) * overlayBlurRadius / iResolution;
                            float weight = exp(-(bx * bx + by * by) / (2.0 * overlayBlurSigma * overlayBlurSigma));
                            
                            vec2 samplePos = uv + blurOffset;
                            
                            vec2 sampleDisp = createStripedDisplacement(samplePos, u_numSegments, angle);
                            vec4 sampleLuma = applyBlurWithDisplacement(
                                iChannel0, samplePos,
                                sampleDisp.x, maxDisplacement,
                                iResolution, imageSize, blurRadius, sigma
                            );
                            float sampleL = dot(sampleLuma.rgb, vec3(0.299, 0.587, 0.114));
                            vec3 sampleColor = applyColoramaFromLuma(sampleL, inputPhase, cycleRepetitions);
                            
                            vec2 sampleShapeUV = (samplePos - vec2(blurShapeOffsetX, blurShapeOffsetY)) / blurShapeScale + 0.5;
                            if (sampleShapeUV.x >= 0.0 && sampleShapeUV.x <= 1.0 && 
                                sampleShapeUV.y >= 0.0 && sampleShapeUV.y <= 1.0) {
                                vec4 sampleShapeAlpha = texture2D(iChannel1, sampleShapeUV);
                                
                                if (sampleShapeAlpha.a > 0.0) {
                                    float sampleStripeX = samplePos.x - samplePos.y * tan(0.30);
                                    float sampleSegWidth = blurShapeScale.x / 3.0;
                                    float sampleLocalStripe = fract(sampleStripeX / sampleSegWidth);
                                    float stripeProgress = pow(sampleLocalStripe, 0.6);
                                    
                                    vec3 paleBlue = vec3(0.92, 0.96, 1.0);
                                    vec3 lightBlue = vec3(0.82, 0.91, 0.98);
                                    vec3 mediumBlue = vec3(0.65, 0.82, 0.95);
                                    
                                    if (stripeProgress < 0.5) {
                                        sampleColor = mix(paleBlue, lightBlue, stripeProgress * 2.0);
                                    } else {
                                        sampleColor = mix(lightBlue, mediumBlue, (stripeProgress - 0.5) * 2.0);
                                    }
                                }
                            }
                            
                            blurredColor += sampleColor * weight;
                            blurTotalWeight += weight;
                        }
                    }
                    blurredColor /= blurTotalWeight;
                    
                    float blurStrength = 0.98;
                    
                    float smoothBlend = smoothstep(0.0, 0.3, inBlurRegion);
                    smoothBlend = smoothBlend * smoothBlend * (3.0 - 2.0 * smoothBlend);
                    float blurBlend = blurStrength * smoothBlend;
                    
                    color = mix(color, blurredColor, blurBlend);
                }
            }

            gl_FragColor = vec4(vec3(color), 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        iResolution: { value: [window.innerWidth * dpr, window.innerHeight * dpr] },
        uDpr: { value: dpr },
        uZoom: { value: 2.5 },  // Set zoom to 2.5x
        iChannel0: { value: texture },
        iChannel1: { value: shapeTexture },
      },
    });

    // ============================================================================
    // WINDOW RESIZE HANDLER
    // ============================================================================
    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.iResolution.value = [
        window.innerWidth * dpr,
        window.innerHeight * dpr,
      ];
    }
    window.addEventListener("resize", resize, false);

    // ============================================================================
    // GEOMETRY SETUP
    // ============================================================================
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // ============================================================================
    // RENDER LOOP
    // ============================================================================
    let animationFrameId;
    function update(t) {
      animationFrameId = requestAnimationFrame(update);

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.image = video;
        texture.needsUpdate = true;
      }

      program.uniforms.uTime.value = t * 0.001;

      renderer.render({ scene: mesh });
    }
    animationFrameId = requestAnimationFrame(update);

    // Cleanup function
    cleanupRef.current = () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      video.pause();
      video.src = "";
      if (containerRef.current && canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
    };

    return cleanupRef.current;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
}

export default GradientBlinds;
