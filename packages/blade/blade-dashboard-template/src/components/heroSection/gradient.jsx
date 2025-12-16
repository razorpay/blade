import { useEffect, useRef } from "react";
import { Renderer, Geometry, Program, Mesh, Texture } from "ogl";

const GradientBlinds = ({ className, dpr, paused = false, videoSrc = "/dashboard/output.mp4" }) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const textureRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pixelRatio = Math.min(
      dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      2
    );

    const rect = container.getBoundingClientRect();
    console.log("Initializing GradientBlinds - Container:", rect.width, "x", rect.height, "DPR:", pixelRatio);

    const renderer = new Renderer({
      width: rect.width,
      height: rect.height,
      dpr: pixelRatio,
      alpha: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);
    
    console.log("Canvas appended to container, canvas size:", canvas.width, "x", canvas.height);

    // Load video texture
    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    textureRef.current = texture;

    const video = document.createElement("video");
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    videoRef.current = video;

    // Add event listeners for debugging
    video.addEventListener("loadeddata", () => {
      console.log("Video loaded successfully:", video.videoWidth, "x", video.videoHeight);
    });
    
    video.addEventListener("error", (e) => {
      console.error("Video error:", e, video.error);
    });

    // Start playing the video
    video.play().then(() => {
      console.log("Video playing");
    }).catch((e) => {
      console.log("Video autoplay failed:", e);
      // Add click handler to start video on user interaction
      const playHandler = () => {
        video.play().then(() => console.log("Video started after user interaction"));
      };
      document.addEventListener("click", playHandler, { once: true });
    });

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
      uniform sampler2D iChannel0;
      varying vec2 vUv;

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

      // Apply film grain effect (biased towards bright)
      vec3 applyFilmGrain(vec3 color, vec2 uv, vec2 resolution, float dpr, float time) {
          float grainScale = 120.0;  // Higher = finer grain
          float grainIntensity = 0.06;  // Subtle grain amount
          vec2 grainUV = uv * resolution / dpr;  // Screen-space grain
          float grain = valueNoise(grainUV * grainScale / 100.0 + time * 0.5);  // 0 to 1
          grain = grain * 0.7 + 0.3;  // Bias towards bright (0.3 to 1.0 range)
          return color + grain * grainIntensity;
      }
      
      // Colorama-style effect: maps luminance to a color wheel
      vec3 applyColoramaFromLuma(float luminance, float inputPhase, float cycleRepetitions) {
          // Output Cycle - color wheel (counter-clockwise: light to dark)
          vec3 color1 = vec3(0.937, 0.961, 0.933);   // #EFF5EE - Off-white/pale green (lightest)
          vec3 color2 = vec3(0.898, 0.961, 0.839);   // #E5F5D6 - Yellow-green tint
          vec3 color3 = vec3(0.4, 0.6, 0.996);   // #8FCAFE - Light blue
          vec3 color4 = vec3(0.161, 0.302, 0.878);   // #2951E0 - Deep blue (darkest)
          
          // Map luminance to position on the wheel
          float t = fract(luminance * cycleRepetitions + inputPhase);
          
          vec3 colorResult;
          float localT;
          
          if (t < 0.25) {
              localT = t / 0.25;
              colorResult = mix(color1, color2, smoothstep(0.0, 1.0, localT));
          } else if (t < 0.50) {
              localT = (t - 0.25) / 0.25;
              colorResult = mix(color2, color3, smoothstep(0.0, 1.0, localT));
          } else if (t < 0.75) {
              localT = (t - 0.50) / 0.25;
              colorResult = mix(color3, color4, smoothstep(0.0, 1.0, localT));
          } else {
              localT = (t - 0.75) / 0.25;
              colorResult = mix(color4, color1, smoothstep(0.0, 1.0, localT));
          }
          
          return colorResult;
      }
      
      // Create striped displacement map for glass refraction effect
      vec2 createStripedDisplacement(vec2 uv, float numSegments, float angle) {
          // Apply slant by offsetting x based on y position
          float slantedX = uv.x - uv.y * tan(angle);
          
          float segmentWidth = 1.0 / numSegments;
          float localUVx = fract(slantedX / segmentWidth); // 0-1 within each segment
          
          // Create the displacement map gradient
          float displacement = 1.0 - localUVx;
          displacement = pow(displacement, 0.5); // Curve the falloff
          
          // Convert to signed displacement (-1 to 1 range, centered)
          float signedDisplacement = (displacement - 0.5) * 2.0;
          
          return vec2(signedDisplacement, localUVx);
      }
      
      // Cover-style UV mapping (like CSS background-size: cover) with zoom
      vec2 coverUV(vec2 uv, vec2 screenSize, vec2 imageSize, float zoom) {
          float screenAspect = screenSize.x / screenSize.y;
          float imageAspect = imageSize.x / imageSize.y;
          
          vec2 scale = vec2(1.0);
          if (screenAspect > imageAspect) {
              // Screen is wider than image - fit width, crop height
              scale.y = imageAspect / screenAspect;
          } else {
              // Screen is taller than image - fit height, crop width
              scale.x = screenAspect / imageAspect;
          }
          
          // Apply zoom (zoom in by scaling down the UV coordinates)
          scale *= zoom;
          
          // Center the image
          vec2 offset = (1.0 - scale) * 0.5;
          return uv * scale + offset;
      }
      
      // Gaussian blur with displacement - all in one pass
      const float MAX_BLUR_RADIUS = 2.0;
      vec4 applyBlurWithDisplacement(
          sampler2D tex, 
          vec2 uv,
          float signedDisplacement, vec2 maxDisplacement,
          vec2 resolution, vec2 imageSize, float radius, float sigma, float zoom
      ) {
          vec4 color = vec4(0.0);
          float totalWeight = 0.0;
          
          // Calculate displacement offset once
          vec2 displaceOffset = vec2(
              signedDisplacement * maxDisplacement.x / resolution.x,
              signedDisplacement * maxDisplacement.y / resolution.y
          );
          
          // Apply displacement to UV
          vec2 displacedUV = uv + displaceOffset;
          
          for (float x = -MAX_BLUR_RADIUS; x <= MAX_BLUR_RADIUS; x++) {
              for (float y = -MAX_BLUR_RADIUS; y <= MAX_BLUR_RADIUS; y++) {
                  // Skip samples outside the requested radius
                  if (abs(x) > radius || abs(y) > radius) continue;
                  
                  vec2 offset = vec2(x, y) / resolution;
                  float weight = exp(-(x * x + y * y) / (2.0 * sigma * sigma));
                  
                  // Sample texture with displacement and blur offset
                  color += texture2D(tex, coverUV(displacedUV + offset, resolution, imageSize, zoom)) * weight;
                  
                  totalWeight += weight;
              }
          }
          
          return color / totalWeight;
      }
      
      void main() {
          const float u_numSegments = 40.0;
          const float angle = 0.13; // ~15 degrees in radians
          const float blurRadius = 9.0;
          const float sigma = 4.0;
          const float zoom = 0.35; // Zoom factor (lower = more zoomed in)
          
          // Video dimensions (adjust to match your video)
          const vec2 imageSize = vec2(4500.0, 3000.0);
          
          // Displacement parameters (in pixels, scaled by DPR)
          vec2 maxDisplacement = vec2(22.0, 29.0) * uDpr;
          
          vec2 uv = vUv;
          
          // Create striped displacement map
          vec2 displacementData = createStripedDisplacement(uv, u_numSegments, angle);
          float signedDisplacement = displacementData.x;
          float localUVx = displacementData.y;
          
          // Apply displacement and blur
          vec4 lumaTexture = applyBlurWithDisplacement(
              iChannel0, 
              uv,
              signedDisplacement, maxDisplacement,
              iResolution, imageSize, blurRadius, sigma, zoom
          );
          
          // Extract luminance from the video
          float luma = dot(lumaTexture.rgb, vec3(0.299, 0.587, 0.114));
          
          // Apply colorama color mapping
          float inputPhase = 1.85;
          float cycleRepetitions = 1.0;
          vec3 color = applyColoramaFromLuma(luma, inputPhase, cycleRepetitions);
          
          // Add subtle lighting effects on the glass ridges
          float highlight = smoothstep(0.0, 0.15, localUVx) * 0.05 * luma;
          color += highlight;
          
          // Add subtle film grain
          color = applyFilmGrain(color, vUv, iResolution, uDpr, uTime);
          
          gl_FragColor = vec4(vec3(color), 1.0);
      }

  `,
      uniforms: {
        uTime: { value: 0 },
        iResolution: {
          value: [rect.width * pixelRatio, rect.height * pixelRatio],
        },
        uDpr: { value: pixelRatio },
        iChannel0: { value: texture },
      },
    });
    programRef.current = program;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      program.uniforms.iResolution.value = [
        rect.width * pixelRatio,
        rect.height * pixelRatio,
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
      
      try {
        // Update video texture every frame
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          texture.image = video;
          texture.needsUpdate = true;
        }
        
        if (!paused) {
          program.uniforms.uTime.value = t * 0.001;
        }
        
        renderer.render({ scene: meshRef.current });
      } catch (e) {
        console.error("Render error:", e);
      }
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      
      // Clean up video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current = null;
      }
      
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === "function") {
          obj[key].call(obj);
        }
      };
      callIfFn(textureRef.current, "remove");
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      textureRef.current = null;
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [dpr, paused, videoSrc]);

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
