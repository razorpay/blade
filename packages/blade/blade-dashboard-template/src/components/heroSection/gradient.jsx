import { useEffect, useRef } from "react";
import { Renderer, Geometry, Program, Mesh } from "ogl";

const GradientBlinds = ({ className, dpr, paused = false }) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr:
        dpr ??
        (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    // Define polygon points (default: box centered at 0.5, 0.5)
    // Points are in UV space (0-1), defined clockwise or counter-clockwise
    const MAX_POINTS = 12;
    const offsetX = 0.3;
    const offsetY = 0.1;
    const size = 0.2;
    const polygonPoints = [
      [offsetX + 0, offsetY + 0], // bottom-left
      [offsetX + 0.3, offsetY], // bottom-right
      [offsetX + 0.45, offsetY + 0.6 + size], // top-right
      [offsetX + 0.1, offsetY + 0.35 + size], // top-left
    ];

    // Flatten points into a Float32Array for the shader (x1,y1,x2,y2,...)
    function flattenPoints(points) {
      const arr = [];
      for (let i = 0; i < MAX_POINTS; i++) {
        if (points[i]) {
          arr.push(points[i][0], points[i][1]);
        } else {
          arr.push(0, 0);
        }
      }
      return arr;
    }

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
      uniform float uPolygonData[${MAX_POINTS * 2}];  // Flattened x,y pairs
      uniform int uNumPoints;

      varying vec2 vUv;

      // Signed distance to a line segment
      float sdSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
      }

      // Cross product for 2D (returns scalar z-component)
      float cross2d(vec2 a, vec2 b) {
          return a.x * b.y - a.y * b.x;
      }

      // Hash function for noise
      float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      // Value noise
      float valueNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          
          // Smoothstep for interpolation
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          // Four corners
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          // Bilinear interpolation
          return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      // Layered grain with multiple octaves
      float grain(vec2 uv, float scale, float intensity) {
          float n = 0.0;
          n += valueNoise(uv * scale) * 0.5;
          n += valueNoise(uv * scale * 2.0) * 0.25;
          n += valueNoise(uv * scale * 4.0) * 0.125;
          return (n - 0.4) * intensity;  // Center around 0
      }

      // Northern lights/Aurora effect
      float aurora(vec2 uv, float time) {
          // Create flowing waves
          float wave1 = sin(uv.x * 3.0 + time * 0.5 + uv.y * 2.0) * 0.5 + 0.5;
          float wave2 = sin(uv.x * 5.0 - time * 0.3 + uv.y * 3.0) * 0.5 + 0.5;
          float wave3 = sin(uv.x * 4.0 + time * 0.7 + uv.y * 1.5) * 0.5 + 0.5;
          
          // Add noise for organic feel
          float noise1 = valueNoise(vec2(uv.x * 3.0 + time * 0.2, uv.y * 2.0));
          float noise2 = valueNoise(vec2(uv.x * 5.0 - time * 0.15, uv.y * 3.0 + time * 0.1));
          
          // Combine waves and noise
          float aurora = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
          aurora *= noise1 * 0.6 + noise2 * 0.4;
          
          // Add vertical streaming effect
          float streams = sin(uv.x * 8.0 + time * 0.8) * 0.5 + 0.5;
          streams *= smoothstep(0.3, 0.7, noise1);
          aurora += streams * 0.2;
          
          return aurora;
      }

      // Get point from flattened array
      vec2 getPoint(int idx) {
          vec2 result = vec2(0.0);
          for (int k = 0; k < ${MAX_POINTS}; k++) {
              if (k == idx) {
                  result = vec2(uPolygonData[k * 2], uPolygonData[k * 2 + 1]);
              }
          }
          return result;
      }

      // Polygon SDF with proper inside/outside detection
      float sdPolygon(vec2 p, int numPoints) {
          vec2 p0 = getPoint(0);
          float d = dot(p - p0, p - p0);
          float s = 1.0;
          
          for (int i = 0; i < ${MAX_POINTS}; i++) {
              if (i >= numPoints) break;
              
              // Get current and previous vertex
              int j = i == 0 ? numPoints - 1 : i - 1;
              
              vec2 vi = getPoint(i);
              vec2 vj = getPoint(j);
              
              // Distance to edge
              vec2 e = vj - vi;
              vec2 w = p - vi;
              vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
              d = min(d, dot(b, b));
              
              // Winding number for inside/outside
              bvec3 cond = bvec3(p.y >= vi.y, p.y < vj.y, e.x * w.y > e.y * w.x);
              if (all(cond) || all(not(cond))) s *= -1.0;
          }
          
          return s * sqrt(d);
      }

      // Calculate polygon centroid
      vec2 getPolygonCentroid(int numPoints) {
          vec2 centroid = vec2(0.0);
          for (int i = 0; i < ${MAX_POINTS}; i++) {
              if (i >= numPoints) break;
              centroid += getPoint(i);
          }
          return centroid / float(numPoints);
      }

      // SDF for a scaled polygon (scaled around centroid) with offset - uniform scale
      float sdPolygonScaled(vec2 p, int numPoints, float scale, vec2 offset) {
          vec2 centroid = getPolygonCentroid(numPoints);
          // Apply offset to the point (moves the light shape)
          vec2 offsetP = p - offset;
          // Transform point to scaled space (scale the point away from centroid)
          vec2 scaledP = centroid + (offsetP - centroid) / scale;
          return sdPolygon(scaledP, numPoints) * scale;
      }

      // SDF for a polygon with non-uniform scaling (separate X and Y)
      float sdPolygonScaledXY(vec2 p, int numPoints, vec2 scale, vec2 offset) {
          vec2 centroid = getPolygonCentroid(numPoints);
          vec2 offsetP = p - offset;
          // Non-uniform scale: scale X and Y independently
          vec2 scaledP = centroid + (offsetP - centroid) / scale;
          // Use average scale for distance approximation
          float avgScale = (scale.x + scale.y) * 0.5;
          return sdPolygon(scaledP, numPoints) * avgScale;
}

void main() {
          vec2 fragCoord = vUv * iResolution;
          vec2 uv = fragCoord / iResolution.xy;
          
          // Ribbed glass parameters
          const float numSegments = 25.0;
          const float segmentWidth = 1.0 / numSegments;
          const float angle = 0.15; // 15 degrees in radians
          
          // Offset x based on y to create angled slits
          float angledX = uv.x - uv.y * tan(angle);
          
          // Determine which segment and local position within it
          float segmentIndex = floor(angledX / segmentWidth);
          float segmentStart = segmentIndex * segmentWidth;
          float localX = (angledX - segmentStart) / segmentWidth; // 0 to 1 within segment
          localX = fract(localX); // Wrap to handle negative values
          
          // Grow-in animations - polygon and light are out of sync
          // Polygon grows first (faster), Y axis leads X axis
          float polyGrowDuration = 1.5;
          float polyGrowProgress = clamp(uTime / polyGrowDuration, 0.0, 1.0);
          float easePolyGrow = polyGrowProgress * polyGrowProgress * (3.0 - 2.0 * polyGrowProgress);
          
          // Y grows faster than X (Y leads by ~0.5s)
          float polyGrowProgressX = clamp((uTime - 0.5) / polyGrowDuration, 0.0, 1.0);
          float easePolyGrowX = polyGrowProgressX * polyGrowProgressX * (3.0 - 2.0 * polyGrowProgressX);
          float easePolyGrowY = easePolyGrow;  // Y uses the original faster timing
          
          // Light grows after with delay (slower, starts later)
          float lightDelay = -.05;
          float lightGrowDuration = 2.5;
          float lightGrowProgress = clamp((uTime - lightDelay) / lightGrowDuration, 0.0, 1.0);
          float easeLightGrow = lightGrowProgress * lightGrowProgress * (3.0 - 2.0 * lightGrowProgress);
          
          // Light also starts with some initial size
          float minLightScale = 0.1;
          float lightScale = minLightScale + (0.75 - minLightScale) * easeLightGrow;
          float lightFalloff = 0.15 + 0.03 * sin(uTime * 2.0);  // Animated light falloff
          vec2 lightOffset = vec2(
              -0.04 + 0.025 * sin(uTime * 0.5) + 0.01 * sin(uTime * 1.3),
              -0.13 + 0.02 * cos(uTime * 0.35) + 0.008 * cos(uTime * 1.7)
          );  // Animated light position offset with varied momentum
          float lightDist = sdPolygonScaled(uv, uNumPoints, lightScale + 0.001, lightOffset);
          // Light is 1 inside the scaled polygon, fades uniformly to 0 outside
          float light = 1.0 - smoothstep(0.0, lightFalloff, lightDist);
          light *= easeLightGrow;  // Also fade in the light intensity
          
          // Colors for slits: white to blue only (no cream in slits)
          vec3 white = vec3(1.0, 1.0, 1.0);
          vec3 lightBlue = vec3(0.3, 0.3, .8);
          vec3 deepBlue = vec3(0.2, 0.5, 1);
          
          // Blue intensity varies with distance from light
          vec3 blue = mix(deepBlue, lightBlue, light);
          
          // Puffy/convex gradient - more blue, less white
          float t = localX;
          
          // Use cosine for a puffy/convex look - but reduce white intensity
          float whiteness = cos(t * 4.0) * .2 + 0.15;  // Less white overall
          whiteness = max(whiteness, 0.0);
          
          // Subtle highlight near left edge
          float edgeHighlight = smoothstep(0.01, 0.0, t) * 0.015;
          whiteness = whiteness + edgeHighlight;
          
          vec3 baseColor = mix(blue, white, whiteness);
          
          // Add grain/noise to the strips for a more natural look
          float grainScale = 800.0;  // Higher = finer grain
          float grainIntensity = 0.08;  // Subtle grain
          float grainValue = grain(uv * iResolution / 100.0, grainScale, grainIntensity);
          
          // Apply grain - more visible in darker areas, less in bright areas
          baseColor += grainValue * (1.0 - whiteness * 0.5);
          
          // Light adds very strong brightness near center - slits vanish
          baseColor = mix(baseColor, white, pow(light, .9) * 1.0);
          
          // Polygon mask - fade to background outside the polygon
          float falloff = 0.2 + 0.05 * sin(uTime * 2.0);  // Animated falloff
          
          // Calculate polygon SDF with grow animation (polygon grows from centroid)
          // Y grows first, then X catches up
          // Start with some initial size (not from 0)
          float minScaleX = 0.15;  // Initial X scale
          float minScaleY = 0.25;  // Initial Y scale (taller to start)
          vec2 polyScale = vec2(
              minScaleX + (1.0 - minScaleX) * easePolyGrowX,  // X grows slower
              minScaleY + (1.0 - minScaleY) * easePolyGrowY   // Y grows faster
          );
          float polyDist = sdPolygonScaledXY(uv, uNumPoints, polyScale, vec2(0.0));
          
          // Create smooth falloff mask (1 inside polygon, fades to 0 outside)
          // Start with some falloff visible
          float minFalloffScale = 1.2;
          float avgPolyGrow = (easePolyGrowX + easePolyGrowY) * 0.5;
          float falloffScale = minFalloffScale + (1.0 - minFalloffScale) * avgPolyGrow;
          float mask = 1.0 - smoothstep(0.0, falloff * falloffScale, polyDist);
          
          // Bias slits toward white near the falloff edge
          float edgeFade = smoothstep(0.0, falloff * 0.8, polyDist);  // 1 at edge, 0 inside
          baseColor = mix(baseColor, white, edgeFade * .8);
          
          // Banding effect - soft darker streaks along individual slits
          // Determine if this slit should have a dark band (sparse distribution)
          float slitSeed = hash(vec2(segmentIndex * 1.337, 42.0));
          float hasBand = step(0.55, slitSeed);  // ~45% of slits have bands
          
          // Band intensity varies per slit
          float bandStrength = hash(vec2(segmentIndex * 2.71, 13.0)) * 0.5 + 0.5;
          
          // Soft vertical gradient along the slit - bands fade in/out along length
          float verticalPos = uv.y + uv.x * tan(angle);  // Position along the slit direction
          float bandStart = hash(vec2(segmentIndex * 3.14, 7.0)) * 0.3;  // Random start position
          float bandLength = 0.3 + hash(vec2(segmentIndex * 1.5, 99.0)) * 0.5;  // Random length
          
          // Create soft falloff at band edges
          float bandY = smoothstep(bandStart, bandStart + 0.1, verticalPos) * 
                        (1.0 - smoothstep(bandStart + bandLength - 0.1, bandStart + bandLength, verticalPos));
          
          // Band is darker toward the center of the slit, fades at edges
          float bandX = 1.0 - abs(localX - 0.5) * 1.5;
          bandX = max(bandX, 0.0);
          
          // Combine all factors
          float darkBand = hasBand * bandStrength * bandY * bandX;
          
          // Only show in the falloff/edge region (matches reference)
          float bandRegion = smoothstep(-0.02, falloff * 0.5, polyDist) * (1.0 - smoothstep(falloff * 0.8, falloff, polyDist));
          darkBand *= bandRegion * 0.25;
          
          // Apply as darkening (subtract from color)
          baseColor -= darkBand * vec3(0.08, 0.06, 0.02);  // Slightly warm shadow
          
          // Background is white (no green gradient)
          vec3 bgColor = vec3(1.0);
          
          // Blend with background based on mask (outside the polygon)
          baseColor = mix(bgColor, baseColor, mask);
          
          gl_FragColor = vec4(baseColor, 1.0);
      }
  `,
      uniforms: {
        uTime: { value: 0 },
        iResolution: {
          value: [gl.drawingBufferWidth, gl.drawingBufferHeight],
        },
        uPolygonData: { value: flattenPoints(polygonPoints) },
        uNumPoints: { value: polygonPoints.length },
      },
    });
    programRef.current = program;

    // Helper to update polygon points
    function setPolygonPoints(points) {
      program.uniforms.uPolygonData.value = flattenPoints(points);
      program.uniforms.uNumPoints.value = points.length;
    }

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      program.uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });
    geometryRef.current = geometry;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const update = (t) => {
      rafRef.current = requestAnimationFrame(update);
      if (!paused && programRef.current && meshRef.current) {
        try {
          program.uniforms.uTime.value = t * 0.001;
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === "function") {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [dpr, paused]);

  return (
    <div
      ref={containerRef}
      className={`gradient-blinds-container ${className || ""}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    />
  );
};

export default GradientBlinds;
