import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const FOOTER_BAR_AXES = {
  /** `sticky` keeps the bar at the edge on desktop too. */
  desktop: ['inline', 'sticky'],
} as const;

type Axis<K extends keyof typeof FOOTER_BAR_AXES> = AxisValue<
  typeof FOOTER_BAR_AXES,
  K
>;

/** Derived from FOOTER_BAR_AXES: add a value there, never here. */
export interface FooterBarStyleProps {
  desktop?: Axis<'desktop'>;
}

const DESKTOP: Record<Axis<'desktop'>, string> = {
  inline: 'm:static m:border-t-none m:shadow-none',
  sticky: '',
};

// Ported from app/v2/modules/common/components/FooterCTA.svelte.
export function resolveFooterBar(props: FooterBarStyleProps = {}) {
  const { desktop = 'inline' } = props;
  return {
    root: `sticky bottom-0 z-10 flex w-full shrink-0 flex-col gap-3 border-t-thin border-r-none border-b-none border-l-none border-solid border-surface-gray-muted bg-surface-gray-intense p-4 ${DESKTOP[desktop]}`.trim(),
    summary: 'flex flex-col gap-1',
  };
}

/**
 * FooterBar holds a screen's primary action: stuck to the bottom edge on
 * mobile, in the flow on desktop. `children` is the action; `summary` sits
 * above it.
 */
export interface FooterBarBehaviourProps {
  testID?: string;
  class?: string;
  summary?: Snippet;
  children: Snippet;
}
