import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RayMount } from './RayMount';
import { RAY_BOX } from './rayBox';
import type { RayProps } from './types';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSize } from '~utils/makeSize';
import { useMergeRefs } from '~utils/useMergeRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';

// he's drawn on a canvas: where there's no real one (a server render, jsdom in unit tests) his box renders and nothing animates
const canDraw = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (/jsdom/i.test(window.navigator.userAgent)) return false;
  try {
    return Boolean(document.createElement('canvas').getContext('2d'));
  } catch {
    return false;
  }
};

/**
 * Ray, Razorpay's AI mascot, drawn by Ray Studio's engine.
 *
 * He sits on a surface (usually the chat input), idles, watches what's typed, looks at the pointer and flips a coin when
 * clicked; while an answer is being worked on he plays its states (searching, calling, writing, working), handing over
 * from one to the next mid-move. His box is his rest footprint and never changes size; what he does around it (props,
 * a coin in the air, the hop) draws outside it without affecting layout.
 */
const _Ray = (
  {
    entrance = 'none',
    state = 'idle',
    idle = 'look',
    size = 'medium',
    isVisible = true,
    shouldUnmountWhenHidden = false,
    watchedInputRef,
    isInteractive = true,
    accessibilityLabel,
    testID,
    ...rest
  }: RayProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement | null => {
  const { colorScheme } = useTheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const boxRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<RayMount | null>(null);
  const mergedRef = useMergeRefs(ref, boxRef);
  const options = {
    entrance,
    state,
    idle,
    size,
    isHidden: !isVisible,
    isInteractive,
    colorScheme: scheme,
  } as const;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const inputRefRef = useRef(watchedInputRef);
  inputRefRef.current = watchedInputRef;

  // shouldUnmountWhenHidden: his box is removed once he's hopped off (his director says when) and comes back, laid out at
  // once, as soon as he's asked back
  const [isRemoved, setIsRemoved] = useState(shouldUnmountWhenHidden && !isVisible);
  if (isRemoved && (isVisible || !shouldUnmountWhenHidden)) setIsRemoved(false);
  const shouldUnmountRef = useRef(shouldUnmountWhenHidden);
  shouldUnmountRef.current = shouldUnmountWhenHidden;
  const wasRemovedRef = useRef(isRemoved); // his box was removed (or never laid out): back, he comes up out of the surface
  const hasMountedRef = useRef(false); // a director has started him: the landing dash is once, not again for a new one

  // prefers-reduced-motion is read as his director starts, so when it changes while he's up a new director takes over, still or
  // moving as it now says (the PR review: it was read once and kept for good)
  const [motionChanges, setMotionChanges] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (typeof query.addEventListener !== 'function') return undefined;
    const onChange = (): void => setMotionChanges((n) => n + 1);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // his director and engine load with his first render, a chunk of their own as each film is, so an app that imports Blade's
  // components without rendering him never downloads them (the PR review); his box is laid out meanwhile (RAY_BOX)
  useEffect(() => {
    if (isRemoved || !boxRef.current || !canDraw()) return undefined;
    const isReturning = wasRemovedRef.current;
    let mount: RayMount | null = null;
    let isUnmounted = false;
    import('./RayMount')
      .then((module) => {
        if (isUnmounted || !boxRef.current) return;
        const latest = optionsRef.current; // (the latest props, if they changed while it loaded)
        const entrance = hasMountedRef.current ? 'none' : latest.entrance;
        // back after his box was removed: he starts hopped off and comes up out of the surface
        mount = new module.RayMount(
          boxRef.current,
          isReturning ? { ...latest, entrance: 'none', isHidden: true } : { ...latest, entrance },
        );
        hasMountedRef.current = true;
        wasRemovedRef.current = false;
        mount.setInputRef(inputRefRef.current ?? null);
        mount.onAway = () => {
          if (!shouldUnmountRef.current || !optionsRef.current.isHidden) return;
          wasRemovedRef.current = true;
          setIsRemoved(true);
        };
        if (isReturning) mount.update(optionsRef.current);
        mountRef.current = mount;
      })
      .catch(() => {
        // not loaded (offline, blocked): his box stays, empty
      });
    return () => {
      isUnmounted = true;
      mount?.dispose();
      mountRef.current = null;
    };
  }, [isRemoved, motionChanges]);

  useEffect(() => {
    mountRef.current?.update(optionsRef.current);
  }, [state, idle, size, isVisible, isInteractive, scheme]);

  useEffect(() => {
    mountRef.current?.setInputRef(watchedInputRef ?? null);
  }, [watchedInputRef]);

  useEffect(() => {
    if (!shouldUnmountWhenHidden || isVisible) return;
    if (mountRef.current) {
      // his director says when he's away (onAway); set while he was already away, it hasn't said since: it says again now (the
      // PR review: turned on while he was hidden, his box stayed)
      mountRef.current.update(optionsRef.current);
      return;
    }
    // nothing's drawing him (no canvas, not loaded yet, or it couldn't load): there's no hop to wait for
    wasRemovedRef.current = true;
    setIsRemoved(true);
  }, [isVisible, shouldUnmountWhenHidden]);

  if (isRemoved) return null;

  const box = RAY_BOX[size];

  return (
    <BaseBox
      ref={mergedRef as never}
      position="relative"
      flexShrink={0}
      width={makeSize(box.width)}
      height={makeSize(box.height)}
      {...(accessibilityLabel && isVisible
        ? makeAccessible({ role: 'img', label: accessibilityLabel })
        : makeAccessible({ hidden: true }))}
      {...metaAttribute({ name: MetaConstants.Ray, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
    />
  );
};

const Ray = assignWithoutSideEffects(forwardRef(_Ray), {
  displayName: 'Ray',
  componentId: 'Ray',
});

export { Ray };
