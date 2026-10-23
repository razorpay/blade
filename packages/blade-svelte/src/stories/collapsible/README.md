# Collapsible

`Collapsible` (`components/collapsible/`) is Blade's: a trigger that shows and
hides a body. React's intermediate parts are one component here (rule 2):
the trigger is the children, as in React, and the body (React's
`CollapsibleBody`) is the `content` snippet. The wrapper around the trigger
toggles on a press, so the trigger wires nothing; `isExpanded` is there to
read through `{#snippet children({ isExpanded })}`.

```svelte
<Collapsible bind:isExpanded>
  <Link variant="button">
    View Price Breakdown<CollapsibleChevron />
  </Link>
  {#snippet content()}
    <PriceBreakdown />
  {/snippet}
</Collapsible>
```

Props: `isExpanded` (bindable), `onExpandChange` (`{ isExpanded }`), `direction` (`bottom`,
`top`), `children` (the trigger), `content` (the body), `testID`, `class`. The trigger's first
focusable element gets `aria-expanded` and, while the body shows,
`aria-controls`. A trigger whose own click handler calls `preventDefault()`
leaves the body as it is. `CollapsibleChevron` is Blade's turning chevron,
for the CollapsibleLink look.

The body sits right against the trigger, as Blade DSL's Collapsible in Figma
draws it (React adds 12px): spacing inside the body is the body's own.

Collapsible is a pure disclosure: it draws nothing, so a Button trigger keeps
its own width and the body takes the column's. React's body width bounds are
the caller's `class`.
