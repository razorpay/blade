import React, { forwardRef, useEffect, useRef } from 'react';
import { RayMount, rayBoxSize } from './RayMount';
import type { RayProps } from './types';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSize } from '~utils/makeSize';
import { useMergeRefs } from '~utils/useMergeRefs';
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
    inputRef,
    isInteractive = true,
    accessibilityLabel,
    testID,
    ...styledProps
  }: RayProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
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

  useEffect(() => {
    if (!boxRef.current || !canDraw()) return undefined;
    const mount = new RayMount(boxRef.current, optionsRef.current);
    mountRef.current = mount;
    return () => {
      mount.dispose();
      mountRef.current = null;
    };
  }, []);

  useEffect(() => {
    mountRef.current?.update(optionsRef.current);
  }, [state, idle, size, isVisible, isInteractive, scheme]);

  useEffect(() => {
    mountRef.current?.setInputRef(inputRef ?? null);
  }, [inputRef]);

  const box = rayBoxSize(size);

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
      {...getStyledProps(styledProps)}
    />
  );
};

const Ray = forwardRef(_Ray);

export { Ray };
