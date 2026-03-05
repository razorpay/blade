/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-shadow */
/**
 * RzpGlass React Component
 *
 * A React wrapper for the RzpGlassMount WebGL shader effect.
 * Manages the component lifecycle with useEffect hooks.
 *
 * @example
 * ```tsx
 * // Uses default assets and config
 * <RzpGlass width="400px" height="300px" />
 *
 * // With custom assets
 * <RzpGlass
 *   videoSrc="/custom_video.mp4"
 *   gradientMapSrc="/custom-gradient.jpg"
 *   enableBloom={true}
 * />
 * ```
 */

import { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { RzpGlassMount } from './RzpGlassMount';
import type {
  RzpGlassProps,
  RzpGlassConfig,
  RzpGlassAssets,
  RzpGlassPresetDefinition,
} from './types';
import { getPresets, DEFAULT_CDN_PATH } from './presets';
import type { RzpGlassPreset } from './presets';

const getDefaultAssets = (cdnPath: string = DEFAULT_CDN_PATH): Required<RzpGlassAssets> => ({
  videoSrc: `${cdnPath}/spark-base-video.mp4`,
  imageSrc: `${cdnPath}/bottom-frame.jpg`,
  gradientMapSrc: `${cdnPath}/colorama-gradient-map-green.jpg`,
  gradientMap2Src: `${cdnPath}/colorama-gradient-map-blue.jpg`,
  centerGradientMapSrc: `${cdnPath}/colorama-center-gradient-map.jpg`,
});

/**
 * Hook to merge multiple refs into one
 */
function useMergeRefs<T>(refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return useCallback(
    (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      });
    },
    [refs],
  );
}

/**
 * Extract config from props (exclude non-config props).
 * Strips undefined values so they don't clobber preset defaults.
 */
function extractConfig(props: RzpGlassProps): Partial<RzpGlassConfig> {
  const {
    width: _width,
    height: _height,
    className: _className,
    style: _style,
    onLoad: _onLoad,
    onError: _onError,
    preset: _preset,
    gradientMapSrc: _gradientMapSrc,
    gradientMap2Src: _gradientMap2Src,
    gradientMapCanvas: _gradientMapCanvas,
    imageSrc: _imageSrc,
    cdnPath: _cdnPath,
    ...config
  } = props;

  // Drop keys with undefined values so preset config isn't overridden by unset props
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    Object.entries(config).filter(([, v]) => v !== undefined),
  ) as Partial<RzpGlassConfig>;
}

const ASSET_KEYS = new Set<string>([
  'videoSrc',
  'imageSrc',
  'gradientMapSrc',
  'gradientMap2Src',
  'centerGradientMapSrc',
]);

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
function getPresetDefinition(
  preset: RzpGlassPreset | undefined,
  cdnPath?: string,
): RzpGlassPresetDefinition {
  if (!preset) return {};
  const presets = getPresets(cdnPath);
  if (preset in presets) return { ...presets[preset] };
  return {};
}

function getPresetConfig(
  preset: RzpGlassPreset | undefined,
  cdnPath?: string,
): Partial<RzpGlassConfig> {
  const def = getPresetDefinition(preset, cdnPath) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(def).filter(([k]) => !ASSET_KEYS.has(k)),
  ) as Partial<RzpGlassConfig>;
}

function getPresetAssets(
  preset: RzpGlassPreset | undefined,
  cdnPath?: string,
): Partial<RzpGlassAssets> {
  const def = getPresetDefinition(preset, cdnPath) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(def).filter(([k]) => ASSET_KEYS.has(k)),
  ) as Partial<RzpGlassAssets>;
}

/**
 * Merge preset config with user-provided config.
 * Preset values are used as base; any explicit prop overrides them.
 */
function resolveConfig(props: RzpGlassProps): Partial<RzpGlassConfig> {
  return {
    ...getPresetConfig(props.preset, props.cdnPath),
    ...extractConfig(props),
  };
}

export const RzpGlass = forwardRef<HTMLDivElement, RzpGlassProps>(function RzpGlass(
  props,
  forwardedRef,
) {
  const {
    width = '100%',
    height = '100%',
    className,
    style,
    onLoad,
    onError,
    gradientMapCanvas,
    gradientMapSrc: gradientMapSrcProp,
    gradientMap2Src: gradientMap2SrcProp,
    imageSrc: imageSrcProp,
    cdnPath,
    ...configProps
  } = props;

  // Resolve assets: prop overrides preset, preset overrides default
  const defaultAssets = getDefaultAssets(cdnPath);
  const presetAssets = getPresetAssets(props.preset, cdnPath);
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
        const config = resolveConfig(props);

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
        setIsInitialized(true);
        onLoad?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    };

    init();

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
      setIsInitialized(false);
    };
  }, [
    videoSrc,
    imageSrc,
    gradientMapSrc,
    gradientMap2Src,
    centerGradientMapSrc,
    configProps.preset,
  ]);

  // Update uniforms when config props change
  useEffect(() => {
    if (isInitialized && mountRef.current) {
      const config = resolveConfig(props);
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

  const mergedRef = useMergeRefs([divRef, forwardedRef]);

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
        transition: '2s opacity',
        ...(isInitialized ? { opacity: 1 } : { opacity: 0 }),
        ...style,
      }}
    />
  );
});

export default RzpGlass;
