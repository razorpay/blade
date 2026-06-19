/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-shadow */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { RzpGlassMount } from './RzpGlassMount';
import type { RzpGlassProps } from './types';
import { DEFAULT_CDN_PATH, getDefaultAssets, getPresetAssets, resolveConfig } from './utils';
import { useMergeRefs } from '~utils/useMergeRefs';

// Duration of the component's built-in fade-in transition.
// The video is kept paused during this window so one-shot animations
// (e.g. circleSlideUp) don't "waste" frames while the canvas is invisible.
const FADE_IN_MS = 200;

const RzpGlass = forwardRef<HTMLDivElement, RzpGlassProps>(function RzpGlass(props, forwardedRef) {
  const {
    width = '100%',
    height = '100%',
    className,
    style,
    onLoad,
    onError,
    assetsPath: assetsPathProp,
    gradientMapCanvas,
    gradientMapSrc: gradientMapSrcProp,
    gradientMap2Src: gradientMap2SrcProp,
    imageSrc: imageSrcProp,
    ...configProps
  } = props;

  // Get default assets based on assetsPath
  const assetsPath: string = assetsPathProp ?? DEFAULT_CDN_PATH;
  const defaultAssets = getDefaultAssets(assetsPath);

  // Resolve assets: prop overrides preset, preset overrides default
  const presetAssets = getPresetAssets(props.preset, assetsPath);
  const imageSrc = imageSrcProp ?? presetAssets.imageSrc;
  const videoSrc = imageSrc ? undefined : presetAssets.videoSrc ?? defaultAssets.videoSrc;
  const gradientMapSrc =
    gradientMapSrcProp ?? presetAssets.gradientMapSrc ?? defaultAssets.gradientMapSrc;
  const gradientMap2Src =
    gradientMap2SrcProp ?? presetAssets.gradientMap2Src ?? defaultAssets.gradientMap2Src;
  const centerGradientMapSrc =
    presetAssets.centerGradientMapSrc ?? defaultAssets.centerGradientMapSrc;

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<RzpGlassMount | null>(null);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      if (!divRef.current || mountRef.current) return;

      try {
        const config = resolveConfig(props, assetsPath);

        mountRef.current = new RzpGlassMount(
          divRef.current,
          {
            videoSrc,
            imageSrc,
            gradientMapSrc,
            gradientMap2Src,
            centerGradientMapSrc,
          },
          config,
        );

        await mountRef.current.loadAssets();

        // Pause the video during the CSS fade-in so one-shot animations
        // don't burn frames while the component is still transparent.
        // Only do this when the consumer hasn't explicitly set paused: true.
        const userWantsPaused = config.paused ?? false;
        if (!userWantsPaused) {
          mountRef.current.pause();
        }

        setIsInitialized(true); // kicks off the CSS opacity 0 → 1 transition

        // After the fade-in completes, resume video and notify the consumer.
        setTimeout(() => {
          if (!mountRef.current) return;
          if (!userWantsPaused) {
            mountRef.current.play();
          }
          onLoad?.();
        }, FADE_IN_MS);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    };

    void init();

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
      setIsInitialized(false);
    };
  }, [assetsPath, videoSrc, imageSrc, gradientMapSrc, gradientMap2Src, centerGradientMapSrc, configProps.preset]);

  // Update uniforms when config props change
  useEffect(() => {
    if (isInitialized && mountRef.current) {
      const config = resolveConfig(props, assetsPath);
      mountRef.current.setUniforms(config);
    }
  }, [
    isInitialized,
    configProps.preset,
    // Colorama
    configProps.inputMin,
    configProps.inputMax,
    configProps.modifyGamma,
    configProps.posterizeLevels,
    configProps.cycleRepetitions,
    configProps.phaseShift,
    configProps.cycleSpeed,
    configProps.wrapMode,
    configProps.reverse,
    configProps.blendWithOriginal,
    // Displacement
    configProps.numSegments,
    configProps.slitAngle,
    configProps.displacementX,
    configProps.displacementY,
    // Center element
    configProps.enableCenterElement,
    configProps.centerAnimDuration,
    // Color correction
    configProps.ccBlackPoint,
    configProps.ccWhitePoint,
    configProps.ccMidtoneGamma,
    configProps.ccGamma,
    configProps.ccContrast,
    // Zoom & Pan
    configProps.zoom,
    configProps.panX,
    configProps.panY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...(configProps.edgeFeather ?? [0, 0, 0, 0]),
    // Effect toggles
    configProps.enableDisplacement,
    configProps.enableColorama,
    configProps.enableBloom,
    configProps.enableLightSweep,
    // Light
    configProps.lightIntensity,
    configProps.lightStartFrame,
    // Playback
    configProps.paused,
    configProps.startTime,
    configProps.endTime,
    configProps.animateLightIndependently,
    // Cycle animation
    configProps.animateCycleReps,
    configProps.cycleRepetitionsStart,
    configProps.cycleRepetitionsEnd,
    configProps.cycleRepetitionsStartFrame,
    configProps.cycleRepetitionsDuration,
    // Gradient map blend
    configProps.gradientMapBlend,
    configProps.gradientMapBlendDuration,
  ]);

  // Update gradient map texture when a canvas is provided
  useEffect(() => {
    if (isInitialized && mountRef.current && gradientMapCanvas) {
      mountRef.current.updateGradientMapTexture(gradientMapCanvas);
    }
  }, [isInitialized, gradientMapCanvas]);

  const mergedRef = useMergeRefs(forwardedRef, divRef);

  // Convert width/height to string if number
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  if (error) {
    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      ref={mergedRef}
      className={className}
      style={{
        width: widthStyle,
        height: heightStyle,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        transition: `${FADE_IN_MS}ms opacity`,
        ...(isInitialized ? { opacity: 1 } : { opacity: 0 }),
        ...style,
      }}
    />
  );
});

export { RzpGlass };
