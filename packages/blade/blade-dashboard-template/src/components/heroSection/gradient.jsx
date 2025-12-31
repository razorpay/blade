import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import {
  TextureLoader,
  VideoTexture,
  LinearSRGBColorSpace,
  ClampToEdgeWrapping,
  LinearFilter,
} from "three";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  buildShaderMaterial,
  displacement,
  vignette,
  colorGrading,
  colorama,
} from "./shaders";

const BASE_PLAYBACK_RATE = 0.6;
const MAX_REPETITIONS = 1.1655;

function DisplacedBackground({
  phaseShift,
  repetitions,
  displacementZoom,
  isPlaying,
  isEndPause,
  onVideoReady,
  onVideoEnded,
}) {
  const { viewport, size } = useThree();
  const meshRef = useRef();
  const materialRef = useRef();
  const videoRef = useRef();
  const lastProgressRef = useRef(0);
  const pauseAccumulatedProgressRef = useRef(0);
  const lastLoggedSecondRef = useRef(-1);
  const [videoTexture, setVideoTexture] = useState(null);

  // Create video element and video texture
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/dashboard/bg-trimmed-color.mp4";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.playbackRate = BASE_PLAYBACK_RATE;

    const handleEnded = () => {
      if (onVideoEnded) {
        onVideoEnded();
      }
    };

    video.play().catch((e) => {
      console.log("Video autoplay failed:", e);
    });

    const handleTimeUpdate = () => {
      const currentSecond = Math.floor(video.currentTime);
      if (currentSecond === lastLoggedSecondRef.current) return;
      lastLoggedSecondRef.current = currentSecond;
      const minutes = String(Math.floor(currentSecond / 60)).padStart(2, "0");
      const seconds = String(currentSecond % 60).padStart(2, "0");
      console.log(`Video time ${minutes}:${seconds}`);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    handleTimeUpdate();

    const texture = new VideoTexture(video);
    texture.colorSpace = LinearSRGBColorSpace;
    videoRef.current = video;
    setVideoTexture(texture);

    if (onVideoReady) {
      onVideoReady(video);
    }

    return () => {
      video.pause();
      video.src = "";
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      texture.dispose();
    };
  }, [onVideoReady, onVideoEnded]);

  // Handle play/pause based on isPlaying prop
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        pauseAccumulatedProgressRef.current = 0;
        videoRef.current.playbackRate = BASE_PLAYBACK_RATE;
        videoRef.current.play().catch((e) => {
          console.log("Video play failed:", e);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Load displacement and gradient map textures
  const displacementTexture = useLoader(TextureLoader, "/dashboard/displacementMap.png");
  const gradientMapTexture = useLoader(TextureLoader, "/dashboard/gradient-map-main.jpg");

  gradientMapTexture.colorSpace = LinearSRGBColorSpace;
  gradientMapTexture.wrapS = ClampToEdgeWrapping;
  gradientMapTexture.wrapT = ClampToEdgeWrapping;
  gradientMapTexture.minFilter = LinearFilter;
  gradientMapTexture.magFilter = LinearFilter;

  // Build shader material with selected effects
  const shaderMaterial = useMemo(() => {
    if (!videoTexture) return null;

    return buildShaderMaterial({
      baseTexture: videoTexture,
      effects: [
        displacement,
        colorama,
        vignette,
        colorGrading,
      ],
      uniforms: {
        uDisplacement: { value: displacementTexture },
        uHorizontalDisplacement: { value: -22.0 / size.width },
        uVerticalDisplacement: { value: -29.0 / size.height },
        uDisplacementZoom: { value: displacementZoom },
        uGradientMap: { value: gradientMapTexture },
        uColoramaPhaseShift: { value: 0.0 },
        uColoramaRepetitions: { value: 1.0 },
        uVignetteIntensity: { value: 0.4 },
        uVignetteRadius: { value: 0.9 },
        uBrightness: { value: 0.0 },
        uContrast: { value: 1.0 },
        uSaturation: { value: 1.0 },
        uZoom: { value: 1.7 },
        uZoomCenterX: { value: 0.6 },
        uZoomCenterY: { value: 0.76 },
      },
      pipeline: `
        // Apply zoom to focus on top of slits
        vec2 zoomCenter = vec2(uZoomCenterX, uZoomCenterY);
        uv = (uv - zoomCenter) / uZoom + zoomCenter;
        uv = clamp(uv, 0.0, 1.0);
        
        uv = applyDisplacement(uv, uDisplacement, uHorizontalDisplacement, uVerticalDisplacement);
        uv = clamp(uv, 0.0, 1.0);
        vec3 color = texture2D(uTexture, uv).rgb;
        color = applyVignette(color, vUv, uVignetteIntensity, uVignetteRadius);
        color = applyColorGrading(color, uBrightness, uContrast, uSaturation);
        color = applyColorama(
          color,
          uGradientMap,
          uColoramaPhaseShift,
          uColoramaRepetitions
        );
      `,
    });
  }, [
    videoTexture,
    displacementTexture,
    gradientMapTexture,
    size.width,
    size.height,
    displacementZoom,
  ]);

  // Update uniforms on each frame
  useFrame((_, delta) => {
    if (materialRef.current && materialRef.current.uniforms) {
      materialRef.current.uniforms.uColoramaPhaseShift.value = phaseShift;

      if (videoRef.current && videoRef.current.duration > 0) {
        if (isPlaying && !videoRef.current.paused) {
          const progress = videoRef.current.currentTime / videoRef.current.duration;
          lastProgressRef.current = progress;
          pauseAccumulatedProgressRef.current = 0;
          const animatedRepetitions = 0.9 + progress * (1.1 - 0.85);
          materialRef.current.uniforms.uColoramaRepetitions.value = Math.min(
            MAX_REPETITIONS,
            animatedRepetitions
          );
        } else if (isEndPause) {
          const duration = videoRef.current.duration || 1;
          pauseAccumulatedProgressRef.current += delta / duration;
          const animatedRepetitions =
            0.9 +
            (lastProgressRef.current + pauseAccumulatedProgressRef.current) *
              (1.1 - 0.85);
          materialRef.current.uniforms.uColoramaRepetitions.value = Math.min(
            MAX_REPETITIONS,
            animatedRepetitions
          );
        } else {
          materialRef.current.uniforms.uColoramaRepetitions.value = Math.min(
            MAX_REPETITIONS,
            repetitions
          );
        }
      } else {
        materialRef.current.uniforms.uColoramaRepetitions.value = Math.min(
          MAX_REPETITIONS,
          repetitions
        );
      }

      materialRef.current.uniforms.uDisplacementZoom.value = displacementZoom;
    }

    if (videoTexture && videoRef.current && !videoRef.current.paused) {
      videoTexture.needsUpdate = true;
    }
  });

  if (!shaderMaterial) return null;

  materialRef.current = shaderMaterial;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

function GradientBlinds() {
  const [phaseShift, setPhaseShift] = useState(0.0);
  const [repetitions, setRepetitions] = useState(1.0);
  const [displacementZoom, setDisplacementZoom] = useState(1.35);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEndPause, setIsEndPause] = useState(false);
  const videoElementRef = useRef(null);
  const lastUserRepetitionsRef = useRef(1.0);
  const pauseTimeoutRef = useRef(null);

  const handleVideoReady = useCallback((video) => {
    videoElementRef.current = video;
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsEndPause(true);
    setIsPlaying(false);
    const video = videoElementRef.current;
    if (video) {
      video.pause();
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    pauseTimeoutRef.current = setTimeout(() => {
      const v = videoElementRef.current;
      setIsEndPause(false);
      if (v) {
        v.playbackRate = BASE_PLAYBACK_RATE;
        v.currentTime = 0;
        v.play().catch((e) => {
          console.log("Video loop restart failed:", e);
        });
      }
      const clamped = Math.min(MAX_REPETITIONS, lastUserRepetitionsRef.current);
      setRepetitions(clamped);
      setIsPlaying(true);
    }, 500);
  }, []);

  const togglePlayPause = () => {
    setIsEndPause(false);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        gl={{
          outputColorSpace: LinearSRGBColorSpace,
        }}
      >
        <DisplacedBackground
          phaseShift={phaseShift}
          repetitions={repetitions}
          displacementZoom={displacementZoom}
          isPlaying={isPlaying}
          isEndPause={isEndPause}
          onVideoReady={handleVideoReady}
          onVideoEnded={handleVideoEnded}
        />
      </Canvas>

    
    </div>
  );
}

export default GradientBlinds;
