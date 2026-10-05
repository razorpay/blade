/** The parts of a Collapsible. */
export interface CollapsibleClasses {
  /** Trigger and body in a column, reversed when the body opens above. */
  root: Record<'bottom' | 'top', string>;
  /** Holds the trigger; the attachment stamps its aria state. */
  trigger: string;
  /** The body's gap from the trigger, inside the sliding panel. */
  body: Record<'bottom' | 'top', string>;
}

// Blade's Collapsible (Collapsible.tsx, styles.web.ts, commonStyles.ts): a
// column, reversed for `top`, at least 200px wide and at most the viewport
// less 40px (from `s`), 640px (from `m`) or 1136px (from `l`); the body 12px
// from the trigger, inside the panel so the slide measures it.
export function resolveCollapsible(): CollapsibleClasses {
  const column =
    'flex items-start min-w-[200px] s:max-w-[calc(100vw_-_40px)] m:max-w-[640px] l:max-w-[1136px]';
  return {
    root: {
      bottom: `${column} flex-col`,
      top: `${column} flex-col-reverse`,
    },
    trigger: 'contents',
    body: { bottom: 'mt-3', top: 'mb-3' },
  };
}

/**
 * The chevron's turn: Blade flips it (-180°) while expanded. It sits after a
 * label as a Link's trailing icon does (`LINK_ICON_SLOT.trailing`).
 */
export function resolveCollapsibleChevron(isExpanded: boolean): string {
  const turn =
    'ms-1 inline-flex [vertical-align:-0.125em] [transform-origin:center] transition-transform duration-moderate ease-standard motion-reduce:transition-none';
  return `${turn} ${isExpanded ? '-rotate-180' : 'rotate-0'}`;
}
