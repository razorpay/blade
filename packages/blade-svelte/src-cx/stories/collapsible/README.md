# Collapsible

`Collapsible` (`components/collapsible/`) is Blade's: a trigger that shows and
hides a body. React's intermediate parts are one component here (rule 2):
the trigger is a snippet, the body is the children. The wrapper around the
trigger toggles on a press, so the trigger wires nothing; `isExpanded` is
there to read.

```svelte
<Collapsible bind:isExpanded>
  {#snippet trigger({ isExpanded })}
    <Link variant="button">
      View Price Breakdown<CollapsibleChevron />
    </Link>
  {/snippet}
  <PriceBreakdown />
</Collapsible>
```

Props: `isExpanded` (bindable), `onExpandChange` (`{ isExpanded }`), `direction` (`bottom`,
`top`), `trigger`, `children`, `testID`, `class`. The trigger's first
focusable element gets `aria-expanded` and, while the body shows,
`aria-controls`. `CollapsibleChevron` is Blade's turning chevron, for the
CollapsibleLink look.
