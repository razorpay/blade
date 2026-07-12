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
import type { RazorSenseResolvedPlaybackPlan } from './razorSensePrograms';
import type {
  LegacyRzpGlassProps,
  RzpGlassConfig,
  RzpGlassProps,
  SemanticRazorSenseProps,
} from './types';
import { DEFAULT_CDN_PATH, getDefaultAssets, getPresetAssets, resolveConfig } from './utils';
import { useRazorSenseLifecycle } from './useRazorSenseLifecycle';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { logger } from '~utils/logger';

// Duration of the component's built-in fade-in transition.
// The video is kept paused during this window so one-shot animations
// (e.g. circleSlideUp) don't "waste" frames while the canvas is invisible.
const FADE_IN_MS = 200;
let hasWarnedAboutSemanticLegacyCollision = false;

const AUTHORED_PRESET_MODES: Partial<Record<RzpGlassPreset, RazorSenseOperationalMode>> = {
  default: 'neutral',
  zoomed: 'thinking',
  bottomWave: 'typing',
};

const CANONICAL_SEMANTIC_PROP_KEYS = [
  'mode',
  'isPaused',
  'isInteractive',
  'accessibilityLabel',
  'modeTransitionDuration',
] as const;

const RZP_GLASS_LEGACY_ONLY_PROP_KEYS = [
  'inputMin',
  'inputMax',
  'modifyGamma',
  'posterizeLevels',
  'cycleRepetitions',
  'phaseShift',
  'cycleSpeed',
  'wrapMode',
  'reverse',
  'blendWithOriginal',
  'gradientMapBlend',
  'gradientMapBlendDuration',
  'numSegments',
  'slitAngle',
  'displacementX',
  'displacementY',
  'enableCenterElement',
  'centerAnimDuration',
  'ccBlackPoint',
  'ccWhitePoint',
  'ccMidtoneGamma',
  'ccGamma',
  'ccContrast',
  'aspectRatio',
  'zoom',
  'panX',
  'panY',
  'edgeFeather',
  'backgroundColor',
  'enableDisplacement',
  'enableColorama',
  'enableBloom',
  'enableLightSweep',
  'lightIntensity',
  'lightStartFrame',
  'animateLightIndependently',
  'animateCycleReps',
  'cycleRepetitionsStart',
  'cycleRepetitionsEnd',
  'cycleRepetitionsStartFrame',
  'cycleRepetitionsDuration',
  'videoSrc',
  'imageSrc',
  'gradientMapSrc',
  'gradientMap2Src',
  'centerGradientMapSrc',
  'gradientMapCanvas',
] as const;

const LEGACY_PRESETS = new Set<RzpGlassPreset>(['rippleWave', 'circleSlideUp', 'legacy']);

type RuntimeRazorSenseProps = RzpGlassProps & Record<string, unknown>;

const hasDefinedProp = (props: RuntimeRazorSenseProps, key: string): boolean =>
  props[key] !== undefined;

const hasCanonicalSemanticSignal = (props: RuntimeRazorSenseProps): boolean =>
  CANONICAL_SEMANTIC_PROP_KEYS.some((key) => hasDefinedProp(props, key));

const getDefinedLegacyOnlyKeys = (props: RuntimeRazorSenseProps): string[] => {
  const keys = RZP_GLASS_LEGACY_ONLY_PROP_KEYS.filter((key) => hasDefinedProp(props, key));
  const preset = props.preset as RzpGlassPreset | undefined;
  return preset && LEGACY_PRESETS.has(preset) ? ['preset', ...keys] : keys;
};

type LegacyRzpGlassInternalProps = LegacyRzpGlassProps & {
  /** @internal Prioritizes an incoming renderer without increasing global caps. */
  runtimePriority?: number;
  /** @internal A new identity replays the same preset without remounting WebGL. */
  occurrenceId?: number;
  /** @internal Enables declarative source-boundary playback. */
  playback?: RazorSenseResolvedPlaybackPlan;
  /** @internal Fired after the exact occurrence start frame has been drawn. */
  onPresentationReady?: () => void;
  /** @internal Fired at every completed source iteration. */
  onIteration?: (iteration: number) => void;
  /** @internal Fired once after the finite terminal frame has been drawn. */
  onTerminal?: (iterationCount: number) => void;
};

type LegacyInternalProps = LegacyRzpGlassInternalProps;

const LegacyRzpGlass = forwardRef<HTMLDivElement, LegacyInternalProps>(function LegacyRzpGlass(
  props,
  forwardedRef,
) {
  const {
    width = '100%',
    height = '100%',
    className,
    style,
    testID,
    onLoad,
    onError,
    assetsPath: assetsPathProp,
    videoSrc: videoSrcProp,
    gradientMapCanvas,
    gradientMapSrc: gradientMapSrcProp,
    gradientMap2Src: gradientMap2SrcProp,
    centerGradientMapSrc: centerGradientMapSrcProp,
    imageSrc: imageSrcProp,
    occurrenceId,
    playback,
    onPresentationReady,
    onIteration,
    onTerminal,
    runtimePriority,
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
  const fadeTimerRef = useRef<number>();
  const isFadeCompleteRef = useRef(false);
  const hadManagedPlaybackRef = useRef(false);
  const onErrorRef = useRef(onError);
  const resolvedConfig: Partial<RzpGlassConfig> = resolveConfig(configProps, assetsPath);
  const resolvedIsPaused = resolvedConfig.paused ?? false;
  const lifecycle = useRazorSenseLifecycle(divRef, {
    family: 'legacy',
    isPaused: resolvedIsPaused,
    isInteractive: false,
    priority: runtimePriority,
  });
  const shouldMountRenderer = lifecycle.state === 'active' && lifecycle.isAdmitted;
  const effectivePaused = resolvedIsPaused || lifecycle.state !== 'active' || !lifecycle.isAdmitted;
  const effectivePausedRef = useRef(effectivePaused);
  const userWantsPausedRef = useRef(resolvedIsPaused);
  effectivePausedRef.current = effectivePaused;
  userWantsPausedRef.current = resolvedIsPaused;
  onErrorRef.current = onError;

  // Initialize on mount
  useEffect(() => {
    if (!shouldMountRenderer) return undefined;
    let isCurrent = true;
    let mountedCanvas: HTMLCanvasElement | undefined;
    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      onErrorRef.current?.(new Error('RazorSense: Legacy WebGL context was lost.'));
    };
    const init = async () => {
      if (!divRef.current || mountRef.current) return;

      try {
        setError(null);
        isFadeCompleteRef.current = false;
        const config = {
          ...resolveConfig(configProps, assetsPath),
          paused: effectivePaused,
        };

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
        mountedCanvas = mountRef.current.canvasElement;
        mountedCanvas.addEventListener('webglcontextlost', handleContextLost);

        if (playback) {
          hadManagedPlaybackRef.current = true;
          mountRef.current.setPlaybackOccurrence({
            occurrenceId: occurrenceId ?? 0,
            playback,
            onPresentationReady,
            onIteration,
            onTerminal,
          });
        }

        await mountRef.current.loadAssets();
        if (!isCurrent || !mountRef.current) return;

        // Pause the video during the CSS fade-in so one-shot animations
        // don't burn frames while the component is still transparent.
        // Only do this when the consumer hasn't explicitly set paused: true.
        if (!userWantsPausedRef.current) {
          mountRef.current.pause();
        }

        setIsInitialized(true); // kicks off the CSS opacity 0 → 1 transition

        // After the fade-in completes, resume video and notify the consumer.
        fadeTimerRef.current = window.setTimeout(() => {
          fadeTimerRef.current = undefined;
          isFadeCompleteRef.current = true;
          if (!mountRef.current) return;
          if (!effectivePausedRef.current) {
            mountRef.current.play();
          }
          onLoad?.();
        }, FADE_IN_MS);
      } catch (err) {
        if (!isCurrent) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorRef.current?.(error);
      }
    };

    void init();

    return () => {
      isCurrent = false;
      if (fadeTimerRef.current !== undefined) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = undefined;
      }
      isFadeCompleteRef.current = false;
      mountedCanvas?.removeEventListener('webglcontextlost', handleContextLost);
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
    shouldMountRenderer,
  ]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (!playback) {
      if (hadManagedPlaybackRef.current) {
        hadManagedPlaybackRef.current = false;
        mount.setPlaybackOccurrence(undefined);
      }
      return;
    }

    hadManagedPlaybackRef.current = true;
    mount.setPlaybackOccurrence({
      occurrenceId: occurrenceId ?? 0,
      playback,
      onPresentationReady,
      onIteration,
      onTerminal,
    });
  }, [occurrenceId, onIteration, onPresentationReady, onTerminal, playback]);

  // Update uniforms when config props change
  useEffect(() => {
    if (isInitialized && mountRef.current) {
      const config = {
        ...resolveConfig(configProps, assetsPath),
        paused: effectivePaused || !isFadeCompleteRef.current,
      };
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
    effectivePaused,
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
      <BaseBox
        ref={mergedRef as never}
        className={className}
        style={
          {
            width: widthStyle,
            height: heightStyle,
            ...style,
          } as never
        }
        {...getStyledProps(props)}
        {...metaAttribute({ name: MetaConstants.RazorSense, testID })}
        {...makeAnalyticsAttribute(props)}
      />
    );
  }

  return (
    <BaseBox
      ref={mergedRef as never}
      position="relative"
      overflow="hidden"
      backgroundColor="transparent"
      className={className}
      style={
        {
          width: widthStyle,
          height: heightStyle,
          transition: `${FADE_IN_MS}ms opacity`,
          opacity: isInitialized ? 1 : 0,
          ...style,
        } as never
      }
      {...getStyledProps(props)}
      data-razor-sense-runtime-state={lifecycle.state}
      data-razor-sense-runtime-admitted={lifecycle.isAdmitted ? 'true' : 'false'}
      {...metaAttribute({ name: MetaConstants.RazorSense, testID })}
      {...makeAnalyticsAttribute(props)}
    />
  );
});

type SemanticRendererFamily = 'authored' | 'emotional';

type SemanticRazorSenseInternalProps = SemanticRazorSenseProps & {
  /** @internal Prioritizes an incoming renderer without increasing global caps. */
  runtimePriority?: number;
  /** @internal A new identity replays the same semantic target without remounting its renderer. */
  occurrenceId?: number;
  /** @internal Enables declarative source-boundary playback. */
  playback?: RazorSenseResolvedPlaybackPlan;
  /** @internal Reports an exact prepared frame for every requested mode occurrence. */
  onPresentationReady?: (mode: RazorSenseMode) => void;
  /** @internal Fired at every completed source iteration. */
  onIteration?: (iteration: number) => void;
  /** @internal Fired once after the finite terminal frame has been drawn. */
  onTerminal?: (iterationCount: number) => void;
};

const getSemanticRendererFamily = (mode: RazorSenseMode): SemanticRendererFamily =>
  isRazorSenseEmotionalMode(mode) ? 'emotional' : 'authored';

const SemanticRazorSense = forwardRef<HTMLDivElement, SemanticRazorSenseInternalProps>(
  function SemanticRazorSense(props, forwardedRef) {
    const {
      mode = 'neutral',
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath,
      modeTransitionDuration,
      isPaused,
      paused,
      playbackRate = 1,
      startTime = 0,
      endTime,
      isInteractive,
      interactive,
      accessibilityLabel,
      testID,
      onLoad,
      onError,
      occurrenceId,
      playback,
      onPresentationReady,
      onIteration,
      onTerminal,
      runtimePriority,
    } = props;
    const { colorScheme } = useTheme();
    const resolvedIsPaused = isPaused ?? paused ?? false;
    const resolvedIsInteractive = isInteractive ?? interactive ?? true;
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
    // Admission follows the requested renderer immediately. Keeping an outgoing
    // emotional family accounted until its fade completed could deny the authored
    // renderer the admission it needed to ever present its first frame.
    const runtimeFamily: SemanticRendererFamily = requestedFamily;
    const hostRef = useRef<HTMLDivElement>(null);
    const lifecycle = useRazorSenseLifecycle(hostRef, {
      family: runtimeFamily,
      isPaused: resolvedIsPaused,
      isInteractive: resolvedIsInteractive,
      priority: runtimePriority,
      retainsWebGL: requestedFamily === 'authored' && mountedFamilies.emotional,
    });
    const mergedRef = useMergeRefs(forwardedRef, hostRef);
    const initialReadyFamilies = {
      authored: false,
      emotional: false,
    };
    const readyFamiliesRef = useRef(initialReadyFamilies);
    const [readyFamilies, setReadyFamilies] = useState(initialReadyFamilies);
    const [visibleFamily, setVisibleFamily] = useState(requestedFamily);
    const familyCleanupGenerationRef = useRef(0);
    const resolvedTransitionDuration =
      modeTransitionDuration ?? (requestedFamily === 'emotional' ? 1 : 0.4);

    const markFamilySettled = (family: SemanticRendererFamily): boolean => {
      if (readyFamiliesRef.current[family]) return false;
      readyFamiliesRef.current = { ...readyFamiliesRef.current, [family]: true };
      setReadyFamilies(readyFamiliesRef.current);
      return true;
    };

    const handleFamilyLoad = (family: SemanticRendererFamily): void => {
      const didSettle = markFamilySettled(family);
      if (didSettle && requestedFamilyRef.current === family) onLoad?.();
    };

    const handlePresentationReady = (readyMode: RazorSenseMode): void => {
      if (readyMode !== mode) return;
      onPresentationReady?.(readyMode);
    };

    const handleIteration = (family: SemanticRendererFamily, iteration: number): void => {
      if (requestedFamilyRef.current !== family) return;
      onIteration?.(iteration);
    };

    const handleTerminal = (family: SemanticRendererFamily, iterationCount: number): void => {
      if (requestedFamilyRef.current !== family) return;
      onTerminal?.(iterationCount);
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
      const cleanupGeneration = ++familyCleanupGenerationRef.current;
      if (requestedFamily !== visibleFamily) return undefined;
      const hasNonVisibleMountedFamily = (['authored', 'emotional'] as const).some(
        (family) => family !== visibleFamily && mountedFamilies[family],
      );
      if (!hasNonVisibleMountedFamily) return undefined;

      const timeoutId = window.setTimeout(() => {
        if (
          cleanupGeneration !== familyCleanupGenerationRef.current ||
          requestedFamilyRef.current !== visibleFamily
        ) {
          return;
        }

        let didChange = false;
        const nextMountedFamilies = { ...mountedFamiliesRef.current };
        (['authored', 'emotional'] as const).forEach((family) => {
          if (family === visibleFamily || family === requestedFamilyRef.current) return;
          if (!nextMountedFamilies[family]) return;
          nextMountedFamilies[family] = false;
          didChange = true;
        });
        if (!didChange) return;
        mountedFamiliesRef.current = nextMountedFamilies;
        setMountedFamilies(nextMountedFamilies);
      }, resolvedTransitionDuration * 1000 + 80);

      return () => window.clearTimeout(timeoutId);
    }, [mountedFamilies, requestedFamily, resolvedTransitionDuration, visibleFamily]);

    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const sharedRendererProps = {
      assetsPath,
      modeTransitionDuration,
      playbackRate,
      startTime,
      endTime,
      interactive: resolvedIsInteractive,
      width: '100%',
      height: '100%',
    };
    const hasAccessibilityLabel = Boolean(accessibilityLabel);

    return (
      <BaseBox
        ref={mergedRef as never}
        width={widthStyle as never}
        height={heightStyle as never}
        position="relative"
        overflow="hidden"
        className={className}
        style={style as never}
        role={hasAccessibilityLabel ? 'img' : undefined}
        aria-label={hasAccessibilityLabel ? accessibilityLabel : undefined}
        aria-hidden={hasAccessibilityLabel ? undefined : true}
        data-razor-sense-mode={mode}
        data-razor-sense-color-scheme={colorScheme}
        data-razor-sense-runtime-state={lifecycle.state}
        data-razor-sense-runtime-admitted={lifecycle.isAdmitted ? 'true' : 'false'}
        {...getStyledProps(props)}
        {...metaAttribute({ name: MetaConstants.RazorSense, testID })}
        {...makeAnalyticsAttribute(props)}
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
              occurrenceId={occurrenceId}
              playback={playback}
              paused={resolvedIsPaused}
              runtimeState={lifecycle.state}
              isRuntimeAdmitted={lifecycle.isAdmitted}
              onLoad={() => handleFamilyLoad('authored')}
              onPresentationReady={handlePresentationReady}
              onIteration={(iteration) => handleIteration('authored', iteration)}
              onTerminal={(iterationCount) => handleTerminal('authored', iterationCount)}
              onError={(error) => {
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
              occurrenceId={occurrenceId}
              playback={playback}
              paused={resolvedIsPaused}
              runtimeState={lifecycle.state}
              isRuntimeAdmitted={lifecycle.isAdmitted}
              onLoad={() => handleFamilyLoad('emotional')}
              onPresentationReady={handlePresentationReady}
              onIteration={(iteration) => handleIteration('emotional', iteration)}
              onTerminal={(iterationCount) => handleTerminal('emotional', iterationCount)}
              onError={(error) => {
                onError?.(error);
              }}
            />
          </div>
        ) : null}
      </BaseBox>
    );
  },
);

const RzpGlass = forwardRef<HTMLDivElement, RzpGlassProps>(function RzpGlass(props, forwardedRef) {
  const runtimeProps = props;
  const hasSemanticSignal = hasCanonicalSemanticSignal(runtimeProps);
  const legacyOnlyKeys = getDefinedLegacyOnlyKeys(runtimeProps);
  const preset = runtimeProps.preset;
  const semanticMode = runtimeProps.mode ?? (preset && AUTHORED_PRESET_MODES[preset]) ?? 'neutral';

  if (
    __DEV__ &&
    hasSemanticSignal &&
    legacyOnlyKeys.length > 0 &&
    !hasWarnedAboutSemanticLegacyCollision
  ) {
    hasWarnedAboutSemanticLegacyCollision = true;
    logger({
      type: 'warn',
      moduleName: 'RazorSense',
      message: `Semantic RazorSense props take precedence. Ignored legacy props: ${legacyOnlyKeys.join(
        ', ',
      )}.`,
    });
  }

  if (hasSemanticSignal) {
    return (
      <SemanticRazorSense
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        {...(runtimeProps as SemanticRazorSenseProps)}
        mode={semanticMode}
        ref={forwardedRef}
      />
    );
  }

  if (legacyOnlyKeys.length > 0) {
    return (
      <LegacyRzpGlass
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        {...(runtimeProps as LegacyRzpGlassProps)}
        ref={forwardedRef}
      />
    );
  }

  return (
    <SemanticRazorSense
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      {...(runtimeProps as SemanticRazorSenseProps)}
      mode={semanticMode}
      ref={forwardedRef}
    />
  );
});

export { LegacyRzpGlass, RZP_GLASS_LEGACY_ONLY_PROP_KEYS, RzpGlass, SemanticRazorSense };
export type { LegacyRzpGlassInternalProps, SemanticRazorSenseInternalProps };
