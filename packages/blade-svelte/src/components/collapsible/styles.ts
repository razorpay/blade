/** The parts of a Collapsible. */
export interface CollapsibleClasses {
  /** Trigger and body in a column, reversed when the body opens above. */
  root: Record<'bottom' | 'top', string>;
  /** Holds the trigger at its own width; the attachment stamps its aria state. */
  trigger: string;
}

// Blade's Collapsible as a pure disclosure: a trigger and the body it shows,
// nothing drawn. React's width bounds (at least 200px, at most the viewport
// less 40px, then 640px/1136px) are its CollapsibleBody's look, so they are
// the caller's (`class`). Blade DSL's Collapsible (Figma) puts the body
// right against the trigger (React adds 12px): spacing inside the body is
// the body's own.
export function resolveCollapsible(): CollapsibleClasses {
  return {
    root: {
      bottom: 'flex flex-col',
      top: 'flex flex-col-reverse',
    },
    trigger: 'flex',
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
