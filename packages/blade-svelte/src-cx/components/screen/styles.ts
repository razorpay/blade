import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const SCREEN_AXES = {
  padding: ['none', 'medium'],
} as const;

type Axis<K extends keyof typeof SCREEN_AXES> = AxisValue<typeof SCREEN_AXES, K>;

/** Derived from SCREEN_AXES: add a value there, never here. */
export interface ScreenStyleProps {
  padding?: Axis<'padding'>;
}

const PADDING: Record<Axis<'padding'>, string> = {
  none: '',
  medium: 'p-4',
};

export function resolveScreen(
  props: ScreenStyleProps = {},
): { root: string; disabled: string; body: string } {
  const { padding = 'medium' } = props;
  return {
    root: 'flex min-h-0 w-full flex-1 flex-col bg-surface-gray-intense text-surface-gray-normal',
    disabled: 'pointer-events-none grayscale',
    // Ported from app/v2/modules/main-modal/components/Screen.svelte.
    body: `mx-auto min-h-0 w-full flex-1 overflow-y-auto m:max-w-[30rem] ${PADDING[padding]}`.trim(),
  };
}

/**
 * Screen is the page shell inside a NavStack: a centred, width-capped,
 * scrolling column.
 */
export interface ScreenBehaviourProps {
  /** The screen shows but takes no input (a payment is in flight). */
  isDisabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
  children: Snippet;
  /** Pinned under the scrolling content: a BottomBar, say. */
  footer?: Snippet;
}
