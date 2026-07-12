/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-shadow */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { RzpGlassMount } from './RzpGlassMount';
import { RazorSenseAuthored } from './RazorSenseAuthored';
import { RazorSenseMood } from './RazorSenseMood';
import type { RazorSenseEmotionalMode, RazorSenseMode, RazorSenseOperationalMode } from './modes';
import { isRazorSenseEmotionalMode } from './modes';
import type { RzpGlassPreset } from './presets';
import type { LegacyRzpGlassProps, RzpGlassProps, SemanticRazorSenseProps } from './types';
import { DEFAULT_CDN_PATH, getDefaultAssets, getPresetAssets, resolveConfig } from './utils';
import { useMergeRefs } from '~utils/useMergeRefs';
import { logger } from '~utils/logger';

// Duration of the component's built-in fade-in transition.
// The video is kept paused during this window so one-shot animations
// (e.g. circleSlideUp) don't "waste" frames while the canvas is invisible.
const FADE_IN_MS = 200;
let hasWarnedAboutModeAndPreset = false;

const AUTHORED_PRESET_MODES: Partial<Record<RzpGlassPreset, RazorSenseOperationalMode>> = {
  default: 'neutral',
  zoomed: 'thinking',
  bottomWave: 'typing',
};

const SHARED_AUTHORED_PROP_KEYS = new Set<string>([
  'width',
  'height',
  'className',
  'style',
  'onLoad',
  'onError',
  'assetsPath',
  'mode',
  'preset',
  'modeTransitionDuration',
  'paused',
  'playbackRate',
  'startTime',
  'endTime',
]);

const getImplicitAuthoredMode = (
  props: LegacyRzpGlassProps,
): RazorSenseOperationalMode | undefined => {
  const preset = props.preset ?? 'default';
  const mode = AUTHORED_PRESET_MODES[preset];
  if (!mode) return undefined;

  const hasLegacyCustomization = Object.entries(props).some(
    ([key, value]) => value !== undefined && !SHARED_AUTHORED_PROP_KEYS.has(key),
  );

  return hasLegacyCustomization ? undefined : mode;
};

const LegacyRzpGlass = forwardRef<HTMLDivElement, LegacyRzpGlassProps>(function LegacyRzpGlass(
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
    assetsPath: assetsPathProp,
    videoSrc: videoSrcProp,
    gradientMapCanvas,
    gradientMapSrc: gradientMapSrcProp,
    gradientMap2Src: gradientMap2SrcProp,
    centerGradientMapSrc: centerGradientMapSrcProp,
    imageSrc: imageSrcProp,
    ...configProps
  } = props;

  // Get default assets based on assetsPath
  const assetsPath: string = assetsPathProp ?? DEFAULT_CDN_PATH;
  const defaultAssets = getDefaultAssets(assetsPath);

  // Resolve assets: prop overrides preset, preset overrides default
  const presetAssets = getPresetAssets(props.preset, assetsPath);
  const imageSrc = imageSrcProp ?? presetAssets.imageSrc;
  const videoSrc = imageSrc
    ? undefined
    : videoSrcProp ?? presetAssets.videoSrc ?? defaultAssets.videoSrc;
  const gradientMapSrc =
    gradientMapSrcProp ?? presetAssets.gradientMapSrc ?? defaultAssets.gradientMapSrc;
  const gradientMap2Src =
    gradientMap2SrcProp ?? presetAssets.gradientMap2Src ?? defaultAssets.gradientMap2Src;
  const centerGradientMapSrc =
    centerGradientMapSrcProp ??
    presetAssets.centerGradientMapSrc ??
    defaultAssets.centerGradientMapSrc;

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
  }, [
    assetsPath,
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

type SemanticRendererFamily = 'authored' | 'emotional';

const getSemanticRendererFamily = (mode: RazorSenseMode): SemanticRendererFamily =>
  isRazorSenseEmotionalMode(mode) ? 'emotional' : 'authored';

const SemanticRazorSense = forwardRef<HTMLDivElement, SemanticRazorSenseProps>(
  function SemanticRazorSense(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath,
      modeTransitionDuration,
      paused = false,
      playbackRate = 1,
      startTime = 0,
      endTime,
      interactive = true,
      onLoad,
      onError,
    } = props;
    const requestedFamily = getSemanticRendererFamily(mode);
    const requestedFamilyRef = useRef(requestedFamily);
    requestedFamilyRef.current = requestedFamily;
    const lastAuthoredModeRef = useRef<RazorSenseOperationalMode>('neutral');
    const lastEmotionalModeRef = useRef<RazorSenseEmotionalMode>('calm');
    if (isRazorSenseEmotionalMode(mode)) lastEmotionalModeRef.current = mode;
    else lastAuthoredModeRef.current = mode;

    const initialMountedFamilies = {
      authored: requestedFamily === 'authored',
      emotional: requestedFamily === 'emotional',
    };
    const mountedFamiliesRef = useRef(initialMountedFamilies);
    const [mountedFamilies, setMountedFamilies] = useState(initialMountedFamilies);
    const initialReadyFamilies = {
      authored: false,
      emotional: false,
    };
    const readyFamiliesRef = useRef(initialReadyFamilies);
    const [readyFamilies, setReadyFamilies] = useState(initialReadyFamilies);
    const [visibleFamily, setVisibleFamily] = useState(requestedFamily);
    const resolvedTransitionDuration =
      modeTransitionDuration ?? (requestedFamily === 'emotional' ? 1 : 0.4);

    const markFamilyReady = (family: SemanticRendererFamily): void => {
      if (readyFamiliesRef.current[family]) return;
      readyFamiliesRef.current = { ...readyFamiliesRef.current, [family]: true };
      setReadyFamilies(readyFamiliesRef.current);
      if (requestedFamilyRef.current === family) onLoad?.();
    };

    useEffect(() => {
      if (mountedFamiliesRef.current[requestedFamily]) return;

      mountedFamiliesRef.current = {
        ...mountedFamiliesRef.current,
        [requestedFamily]: true,
      };
      readyFamiliesRef.current = {
        ...readyFamiliesRef.current,
        [requestedFamily]: false,
      };
      setMountedFamilies(mountedFamiliesRef.current);
      setReadyFamilies(readyFamiliesRef.current);
    }, [requestedFamily]);

    useEffect(() => {
      if (requestedFamily === visibleFamily || !readyFamilies[requestedFamily]) return undefined;
      const frameId = requestAnimationFrame(() => setVisibleFamily(requestedFamily));
      return () => cancelAnimationFrame(frameId);
    }, [readyFamilies, requestedFamily, visibleFamily]);

    useEffect(() => {
      const outgoingFamily: SemanticRendererFamily =
        visibleFamily === 'authored' ? 'emotional' : 'authored';
      if (!mountedFamiliesRef.current[outgoingFamily]) return undefined;

      const timeoutId = window.setTimeout(() => {
        if (requestedFamilyRef.current !== visibleFamily) return;
        mountedFamiliesRef.current = {
          ...mountedFamiliesRef.current,
          [outgoingFamily]: false,
        };
        setMountedFamilies(mountedFamiliesRef.current);
      }, resolvedTransitionDuration * 1000 + 80);

      return () => window.clearTimeout(timeoutId);
    }, [resolvedTransitionDuration, visibleFamily]);

    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const sharedRendererProps = {
      assetsPath,
      modeTransitionDuration,
      playbackRate,
      startTime,
      endTime,
      interactive,
      width: '100%',
      height: '100%',
    };

    return (
      <div
        ref={forwardedRef}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        {mountedFamilies.authored ? (
          <div
            aria-hidden={visibleFamily !== 'authored'}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: visibleFamily === 'authored' ? 1 : 0,
              transition: `${resolvedTransitionDuration * 1000}ms linear opacity`,
              pointerEvents: visibleFamily === 'authored' ? 'auto' : 'none',
            }}
          >
            <RazorSenseAuthored
              {...sharedRendererProps}
              mode={lastAuthoredModeRef.current}
              paused={paused || visibleFamily !== 'authored'}
              onLoad={() => markFamilyReady('authored')}
              onError={(error) => {
                markFamilyReady('authored');
                onError?.(error);
              }}
            />
          </div>
        ) : null}
        {mountedFamilies.emotional ? (
          <div
            aria-hidden={visibleFamily !== 'emotional'}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: visibleFamily === 'emotional' ? 1 : 0,
              transition: `${resolvedTransitionDuration * 1000}ms linear opacity`,
              pointerEvents: visibleFamily === 'emotional' ? 'auto' : 'none',
            }}
          >
            <RazorSenseMood
              {...sharedRendererProps}
              mode={lastEmotionalModeRef.current}
              paused={paused || visibleFamily !== 'emotional'}
              onLoad={() => markFamilyReady('emotional')}
              onError={(error) => {
                markFamilyReady('emotional');
                onError?.(error);
              }}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

const RzpGlass = forwardRef<HTMLDivElement, RzpGlassProps>(function RzpGlass(props, forwardedRef) {
  if (__DEV__ && props.mode && props.preset && !hasWarnedAboutModeAndPreset) {
    hasWarnedAboutModeAndPreset = true;
    logger({
      type: 'warn',
      moduleName: 'RazorSense',
      message: '`mode` and `preset` describe different rendering APIs. `mode` takes precedence.',
    });
  }

  if (props.mode) {
    return <SemanticRazorSense {...props} ref={forwardedRef} />;
  }

  const legacyProps = props;
  const implicitAuthoredMode = getImplicitAuthoredMode(legacyProps);
  if (implicitAuthoredMode) {
    return (
      <RazorSenseAuthored
        mode={implicitAuthoredMode}
        width={legacyProps.width}
        height={legacyProps.height}
        className={legacyProps.className}
        style={legacyProps.style}
        assetsPath={legacyProps.assetsPath}
        paused={legacyProps.paused}
        playbackRate={legacyProps.playbackRate}
        startTime={legacyProps.startTime}
        endTime={legacyProps.endTime}
        onLoad={legacyProps.onLoad}
        onError={legacyProps.onError}
        ref={forwardedRef}
      />
    );
  }

  return <LegacyRzpGlass {...legacyProps} ref={forwardedRef} />;
});

export { RzpGlass };
