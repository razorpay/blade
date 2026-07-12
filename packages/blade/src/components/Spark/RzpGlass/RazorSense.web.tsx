/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useEffect, useRef, useState } from 'react';
import { RazorSenseControllerHost } from './RazorSenseControllerHost';
import { createRazorSenseController, disposeRazorSenseController } from './RazorSenseController';
import type { RazorSenseMode } from './modes';
import { getRazorSenseProgram, RAZOR_SENSE_BRANDED_PRESETS } from './razorSensePrograms';
import type {
  RazorSenseBrandedPreset,
  RazorSenseControlledMotionProps,
  RazorSenseController,
  RazorSenseControllerEvent,
  RazorSensePlaybackProps,
  RazorSenseState,
  RazorSenseTarget,
} from './razorSenseMotionTypes';
import { RZP_GLASS_LEGACY_ONLY_PROP_KEYS, RzpGlass } from './RzpGlass';
import type { LegacyRzpGlassProps, SemanticRazorSenseProps } from './types';
import { DEFAULT_CDN_PATH } from './utils';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type RazorSenseSharedProps = StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute & {
    /** Width of the RazorSense surface. @default '100%' */
    width?: string | number;
    /** Height of the RazorSense surface. @default '100%' */
    height?: string | number;
    /** Base URL containing the Blade RazorSense assets. */
    assetsPath?: string;
    /** Class name applied to the outer host. */
    className?: string;
    /** Inline styles applied to the outer host. */
    style?: React.CSSProperties;
    /** Accessible name for a meaningful companion visual. Omit for decorative output. */
    accessibilityLabel?: string;
    /** Enables the calibrated pointer response without exposing shader controls. @default true */
    isInteractive?: boolean;
    /** Called after the first requested renderer has a presentable frame. */
    onLoad?: () => void;
    /** Called when live rendering fails, including recoverable fallback activation. */
    onError?: (error: Error) => void;
  };

type RazorSenseControlledProps = RazorSenseSharedProps &
  RazorSenseControlledMotionProps & {
    controller?: never;
  };

type RazorSenseControllerOwnedProps = RazorSenseSharedProps & {
  /** Event-driven controller that owns target, playback, interruption, and pause state. */
  controller: RazorSenseController;
  state?: never;
  mode?: never;
  preset?: never;
  replayKey?: never;
  playback?: never;
  repeatCount?: never;
  endBehavior?: never;
  transition?: never;
  isPaused?: never;
};

/**
 * Compatibility surface for the semantic API shipped before motion-state
 * orchestration. The runtime keeps these calls on the calibrated renderer so
 * existing timing and crop controls do not silently change.
 */
type RazorSenseSemanticCompatibilityProps = SemanticRazorSenseProps & {
  controller?: never;
  state?: never;
  replayKey?: never;
  playback?: never;
  repeatCount?: never;
  endBehavior?: never;
  transition?: never;
};

type RazorSenseLegacyProps = LegacyRzpGlassProps & {
  controller?: never;
  state?: never;
  replayKey?: never;
  playback?: never;
  repeatCount?: never;
  endBehavior?: never;
  transition?: never;
};

type RazorSenseProps =
  | RazorSenseControlledProps
  | RazorSenseControllerOwnedProps
  | RazorSenseSemanticCompatibilityProps
  | RazorSenseLegacyProps;

const MODE_TO_STATE: Readonly<Record<RazorSenseMode, RazorSenseState>> = {
  neutral: 'idle',
  typing: 'typing',
  thinking: 'thinking',
  calm: 'working',
  loading: 'loading',
  joyful: 'success',
  caution: 'caution',
  regret: 'regret',
};

const EXPLICIT_LEGACY_PRESETS = new Set(['circleSlideUp', 'legacy']);
const COMPATIBILITY_STATE_BY_PRESET = {
  default: 'idle',
  zoomed: 'thinking',
} as const;
const RAW_LEGACY_KEYS = [
  ...RZP_GLASS_LEGACY_ONLY_PROP_KEYS,
  'startTime',
  'endTime',
  'playbackRate',
  'modeTransitionDuration',
] as const;

type RuntimeRazorSenseProps = RazorSenseProps & Record<string, unknown>;

const isLegacyRequest = (
  props: RuntimeRazorSenseProps,
): props is RazorSenseLegacyProps | RazorSenseSemanticCompatibilityProps => {
  const preset = props.preset;
  if (typeof preset === 'string' && EXPLICIT_LEGACY_PRESETS.has(preset)) return true;
  return RAW_LEGACY_KEYS.some((key) => props[key] !== undefined);
};

const isControllerOwnedRequest = (
  props: RazorSenseControlledProps | RazorSenseControllerOwnedProps,
): props is RazorSenseControllerOwnedProps =>
  'controller' in props && props.controller !== undefined;

const isBrandedPreset = (preset: unknown): preset is RazorSenseBrandedPreset =>
  typeof preset === 'string' &&
  RAZOR_SENSE_BRANDED_PRESETS.includes(preset as RazorSenseBrandedPreset);

const resolveTarget = (props: RuntimeRazorSenseProps): RazorSenseTarget => {
  if (typeof props.state === 'string') return { state: props.state as never };
  if (typeof props.mode === 'string') return { state: MODE_TO_STATE[props.mode as RazorSenseMode] };
  if (isBrandedPreset(props.preset)) return { preset: props.preset };
  if (typeof props.preset === 'string' && props.preset in COMPATIBILITY_STATE_BY_PRESET) {
    return {
      state:
        COMPATIBILITY_STATE_BY_PRESET[props.preset as keyof typeof COMPATIBILITY_STATE_BY_PRESET],
    };
  }
  return { state: 'idle' };
};

const getPlaybackProps = (props: RuntimeRazorSenseProps): RazorSensePlaybackProps => {
  if (props.playback === 'repeat') {
    return {
      playback: 'repeat',
      repeatCount: props.repeatCount as number,
      endBehavior: props.endBehavior as 'hold' | 'reset-to-start' | undefined,
    };
  }
  if (props.playback === 'loop') return { playback: 'loop' };
  if (props.playback === 'once') {
    return {
      playback: 'once',
      endBehavior: props.endBehavior as 'hold' | 'reset-to-start' | undefined,
    };
  }
  return { playback: 'automatic' };
};

const getTargetKey = (target: RazorSenseTarget): string =>
  target.state !== undefined ? `state:${target.state}` : `preset:${target.preset}`;

const getRequestValueKey = (value: unknown): string =>
  value === undefined ? 'undefined:' : `${typeof value}:${String(value)}`;

const getTransitionKey = (transition: unknown): string => {
  if (transition === undefined) return 'automatic';
  if (typeof transition === 'string') return transition;
  if (typeof transition === 'object' && transition !== null && 'duration' in transition) {
    return `duration:${String(transition.duration)}`;
  }
  return getRequestValueKey(transition);
};

const getRazorSenseControlledRequestKey = (
  target: RazorSenseTarget,
  props: RuntimeRazorSenseProps,
): string =>
  JSON.stringify([
    getTargetKey(target),
    getRequestValueKey(props.playback ?? 'automatic'),
    getRequestValueKey(props.repeatCount),
    getRequestValueKey(props.endBehavior),
    getTransitionKey(props.transition),
    getRequestValueKey(props.replayKey),
  ]);

const ControlledRazorSense = forwardRef<
  HTMLDivElement,
  RazorSenseControlledProps | RazorSenseControllerOwnedProps
>(function ControlledRazorSense(props, forwardedRef) {
  const runtimeProps: RuntimeRazorSenseProps = props;
  const target = resolveTarget(runtimeProps);
  const isControllerOwned = isControllerOwnedRequest(props);
  const [internalController] = useState(() =>
    createRazorSenseController({
      initialTarget: target,
    }),
  );
  const controller: RazorSenseController = isControllerOwned
    ? props.controller
    : internalController;
  const controlledProps = isControllerOwned ? undefined : props;
  const callbacksRef = useRef(
    controlledProps === undefined
      ? undefined
      : {
          onReady: controlledProps.onReady,
          onTransitionStart: controlledProps.onTransitionStart,
          onTransitionComplete: controlledProps.onTransitionComplete,
          onPlaybackComplete: controlledProps.onPlaybackComplete,
        },
  );
  const lifecycleGenerationRef = useRef(0);
  const previousRequestKeyRef = useRef<string>();

  if (controlledProps) {
    callbacksRef.current = {
      onReady: controlledProps.onReady,
      onTransitionStart: controlledProps.onTransitionStart,
      onTransitionComplete: controlledProps.onTransitionComplete,
      onPlaybackComplete: controlledProps.onPlaybackComplete,
    };
  }

  useIsomorphicLayoutEffect(() => {
    if (isControllerOwned) return undefined;
    return controller.subscribeEvents((event: RazorSenseControllerEvent) => {
      if (event.type === 'ready') callbacksRef.current?.onReady?.(event);
      else if (event.type === 'transition-start') {
        callbacksRef.current?.onTransitionStart?.(event);
      } else if (event.type === 'transition-complete') {
        callbacksRef.current?.onTransitionComplete?.(event);
      } else if (event.type === 'playback-complete') {
        callbacksRef.current?.onPlaybackComplete?.(event);
      }
    });
  }, [controller, isControllerOwned]);

  useIsomorphicLayoutEffect(() => {
    if (isControllerOwned) return;
    const playbackProps = getPlaybackProps(runtimeProps);
    const requestKey = getRazorSenseControlledRequestKey(target, runtimeProps);
    if (previousRequestKeyRef.current === requestKey) return;
    previousRequestKeyRef.current = requestKey;
    // Public target/playback correlation is enforced by RazorSenseProps. This
    // bridge works on the runtime union after that correlation has been erased.
    controller.play(
      target as never,
      {
        ...playbackProps,
        transition: runtimeProps.transition as never,
        interruptionPolicy: 'replace',
      } as never,
    );
  }, [controller, isControllerOwned, runtimeProps, target]);

  useIsomorphicLayoutEffect(() => {
    if (isControllerOwned) return;
    if (runtimeProps.isPaused ?? runtimeProps.paused) controller.pause();
    else controller.resume();
  }, [controller, isControllerOwned, runtimeProps.isPaused, runtimeProps.paused]);

  useEffect(() => {
    const generation = ++lifecycleGenerationRef.current;
    return () => {
      queueMicrotask(() => {
        if (lifecycleGenerationRef.current === generation) {
          disposeRazorSenseController(internalController);
        }
      });
    };
  }, [internalController]);

  const width = props.width ?? '100%';
  const height = props.height ?? '100%';
  const program = getRazorSenseProgram(target);
  const visualMode = 'visualMode' in program ? program.visualMode : undefined;
  const hasAccessibilityLabel = Boolean(props.accessibilityLabel);
  const resolvedIsInteractive =
    props.isInteractive ??
    (typeof runtimeProps.interactive === 'boolean' ? runtimeProps.interactive : true);

  return (
    <BaseBox
      ref={forwardedRef as never}
      width={width as never}
      height={height as never}
      position="relative"
      overflow="hidden"
      className={props.className}
      style={props.style as never}
      role={hasAccessibilityLabel ? 'img' : undefined}
      aria-label={hasAccessibilityLabel ? props.accessibilityLabel : undefined}
      aria-hidden={hasAccessibilityLabel ? undefined : true}
      data-razor-sense-mode={visualMode}
      {...getStyledProps(props)}
      {...metaAttribute({ name: MetaConstants.RazorSense, testID: props.testID })}
      {...makeAnalyticsAttribute(props)}
    >
      <RazorSenseControllerHost
        controller={controller}
        initialTarget={isControllerOwned ? controller.getSnapshot().target : target}
        assetsPath={props.assetsPath ?? DEFAULT_CDN_PATH}
        width="100%"
        height="100%"
        isInteractive={resolvedIsInteractive}
        onLoad={props.onLoad}
        onError={props.onError}
      />
    </BaseBox>
  );
});

/**
 * Renders semantic product intent or a durable branded animation while Blade owns readiness,
 * transitions, interruption, appearance, accessibility, and renderer lifecycle.
 *
 * @example
 * ```tsx
 * <RazorSense state={agentState} playback="loop" accessibilityLabel="Ray is working" />
 * ```
 *
 * @see https://blade.razorpay.com/?path=/docs/components-razorsense--docs
 */
const RazorSense = forwardRef<HTMLDivElement, RazorSenseProps>(function RazorSense(
  props,
  forwardedRef,
) {
  if (isLegacyRequest(props)) {
    return <RzpGlass {...props} ref={forwardedRef} />;
  }
  return <ControlledRazorSense {...props} ref={forwardedRef} />;
});

export { getRazorSenseControlledRequestKey, RazorSense };
export type {
  RazorSenseControllerOwnedProps,
  RazorSenseControlledProps,
  RazorSenseLegacyProps,
  RazorSenseProps,
  RazorSenseSemanticCompatibilityProps,
  RazorSenseSharedProps,
};
