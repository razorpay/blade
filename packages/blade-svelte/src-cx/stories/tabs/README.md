# Tabs

`packages/blade/components/tabs/Tabs.svelte` over `createTabs`
(`navigable-list` + single strict selection). Composed, like CardGroup.

```svelte
<Tabs bind:value accessibilityLabel="Payment methods">
  {#snippet tabs()}
    <TabItem value="upi">UPI</TabItem>
    <TabItem value="card" icon={CreditCardIcon}>
      Card
      {#snippet trailing({ isSelected })}
        <Badge size="small" emphasis={isSelected ? 'intense' : 'subtle'}>New</Badge>
      {/snippet}
    </TabItem>
  {/snippet}
  <TabPanel value="upi">…</TabPanel>
  <TabPanel value="card">…</TabPanel>
</Tabs>
```

| Tabs prop | Notes |
| --- | --- |
| `value` | Bindable; defaults to the first enabled tab — a tablist always has one picked |
| `onChange` | The new value, bare (rule 12) |
| `activation` | `automatic` (default): arrows pick as they move. `manual`: Enter or Space picks |
| `isLazy` | Panels mount only while their tab is picked |
| `tabs` | The TabItems (Blade's TabList) |
| `children` | The TabPanels, and anything else under or beside the tabs |
| `accessibilityLabel` | Names the tablist |
| `variant`, `size`, `orientation`, `isFullWidthTabItem` | Style axes |

| TabItem prop | Notes |
| --- | --- |
| `value` | What Tabs' `value` becomes; its TabPanel's `value` |
| `icon` | A glyph (`IconSource`) before the label; alone, it needs `accessibilityLabel` |
| `leading({ isSelected, isDisabled })` | In place of `icon`: an asset (a logo, an avatar) in the icon's box, 16px (20px at large) |
| `children({ isSelected, isDisabled })` | The label |
| `trailing({ isSelected, isDisabled })` | After the label: a Badge or Counter, which may follow the tab's state |
| `isDisabled`, `href`, `onClick` | A disabled tab is skipped by the arrows; `href` makes the tab a link too |

Horizontal tabs sit 24px apart at small and 32px at medium and large, as
Blade DSL's Tabs (Figma) draws them, whatever the viewport.

## Why `icon`, `leading` and `trailing` are props

Figma's _Tabs/ Tab Item is one flat row: the leading item (an icon, or an
asset in a 16px box, 20px at large), the label, and the trailing item (a
Counter or a Badge), each 8px apart, with no spacing on the label itself.
The tab owns that row, so each part is a prop that lands in its place, sized
for the tab, with the gap between them. Content in `children` is the label.

A segmented control is not tabs: that is `SegmentedControl`.
