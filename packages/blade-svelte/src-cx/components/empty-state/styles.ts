import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import { INTENTS, INTENT_SUBTLE } from '../shared/intent';

/** The blade taxonomy as data. */
export const EMPTY_STATE_AXES = {
  color: INTENTS,
} as const;

type Axis<K extends keyof typeof EMPTY_STATE_AXES> = AxisValue<
  typeof EMPTY_STATE_AXES,
  K
>;

/** Derived from EMPTY_STATE_AXES: add a value there, never here. */
export interface EmptyStateStyleProps {
  /** Tints the disc behind the media. */
  color?: Axis<'color'>;
}

// Ported from app/v2/modules/common/components/Illustration.svelte (the
// tinted disc) and components/error/GenericError.svelte (the stack).
export function resolveEmptyState(props: EmptyStateStyleProps = {}) {
  const { color = 'neutral' } = props;
  return {
    root: 'flex w-full flex-col items-center gap-2 px-4 py-8 text-center text-surface-gray-normal',
    media: `mb-2 flex w-20 h-20 items-center justify-center overflow-hidden rounded-max border-thin border-solid ${INTENT_SUBTLE[color]}`,
    // Blade's EmptyState: a gray-subtle heading, a gray-muted description.
    title: 'font-heading text-200 leading-200 font-semibold text-surface-gray-subtle',
    message: 'font-text text-100 leading-100 text-surface-gray-muted',
    actions: 'mt-4 flex flex-col items-center gap-2',
  };
}

/**
 * EmptyState is the centred stack a screen shows instead of content: nothing
 * here, or something went wrong. No behaviour; the action is the caller's
 * Button, in `children`.
 */
export interface EmptyStateBehaviourProps {
  title: string;
  message?: string;
  /** An illustration or an icon, above the title. */
  media?: Snippet;
  /** Actions, under the message. */
  children?: Snippet;
  testID?: string;
  class?: string;
}
