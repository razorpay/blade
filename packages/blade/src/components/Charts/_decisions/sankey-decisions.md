# SankeyChart — API & Architecture Decisions

**Component:** `SankeyChart`  
**Status:** Draft  
**Authors:** Debabrata Malik (Product Designer, MoneySaver)  
**Last updated:** 2026-05-17

---

## References

- **Figma:** [Blade DSL — SankeyChart](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=PLACEHOLDER) *(update with final node ID)*
- **Design spec:** Section 3.7 — Volume Distribution (Sankey Chart) in the MoneySaver Dashboard spec
- **Related decisions:** [`Charts/_decisions/decisions.md`](../../../Charts/_decisions/decisions.md)

---

## 1. Context & motivation

The Optimizer dashboard (MoneySaver) needs a way to communicate payment volume routing at a glance — how a merchant's total volume splits across Methods (UPI, Card, Wallet, Netbanking), then Providers (Razorpay, PayU, Billdesk), and finally terminal Status (Successful, Failed).

No existing Blade chart type supports this flow topology. A Sankey diagram is the standard representation for this class of problem; it encodes both **distribution** (node height proportional to volume) and **routing** (link width proportional to flow between a source and target).

---

## 2. Rendering approach — why not recharts?

All other Blade charts (BarChart, LineChart, AreaChart, DonutChart) are built on **recharts**, which wraps D3 internally. However, recharts does not expose a Sankey layout — it was purpose-built for time-series and categorical charts.

### Options evaluated

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **d3-sankey + React SVG** | Industry standard layout algorithm; pure JS (no DOM dep); full control over rendering, theming, and interactivity | More implementation work than a pre-built component | ✅ **Chosen** |
| A wrapper around an existing React Sankey lib (e.g. `react-d3-sankey`, `@ant-design/charts`) | Less code | Adds a large dependency; styling and token integration is opaque; conflicts with Blade's design language | ❌ Rejected |
| recharts with a custom chart type | Consistent with other Blade charts | recharts does not support the Sankey graph topology; would require monkey-patching internals | ❌ Rejected |

**Decision:** Use `d3-sankey` for layout calculation only (produces `x0, y0, x1, y1` coordinates and link `width` values), then render the result using plain React SVG elements. This approach:
- Has zero DOM side-effects during layout (pure functional)
- Gives us full control over Blade token application
- Keeps the dependency footprint minimal (d3-sankey is ~10 KB minified)

---

## 3. Component API design

### 3a. Single component vs composition API

BarChart uses a **composition API** (`<ChartBarWrapper>` + `<ChartBar>` + `<ChartXAxis>` …) because recharts itself is compositional. Since our SVG rendering is self-contained, a composition API would add indirection without benefit.

**Decision:** Single `<SankeyChart nodes={} links={} />` prop API. This is simpler to use and sufficient for the current use cases.

### 3b. Node & link data shape

```ts
// Chosen shape
type SankeyLevelNode = { id: string; name: string; color?: string };
type SankeyLevel     = { id: string; nodes: SankeyLevelNode[] };
type SankeyFlowLink  = { from: string; to: string; value: number; label?: string };
```

**Why a `levels` array instead of a flat `nodes` array?**  
Grouping nodes into levels makes it immediately obvious which nodes belong to the same column (e.g. all methods together, all providers together). This mirrors how designers and product people reason about Sankey diagrams. Callers never need to manage or count array indices.

**Why string `id` references instead of numeric indices in links?**  
Numeric indices are brittle — inserting a node in the middle renumbers everything downstream. String IDs are stable: reordering, inserting, or removing nodes does not require updating any link. Internally, the component builds a `Map<id, index>` to resolve references to d3-sankey's required numeric format in O(1).

**Why separate `id` and `name` on a node?**  
`id` is the stable reference key used in links; `name` is the human-readable display label. Keeping them separate avoids collisions when display names change (e.g. "Razorpay PG" → "Razorpay") without breaking all existing link definitions.

**Why is `color` optional on the node?**  
Most callers will use the palette or `nodeColorOverride`. Per-node color is an escape hatch for one-off use cases (e.g. the budget P&L example).

### 3c. Color override props

`nodeColorOverride` and `linkColorOverride` accept Blade color token paths (e.g. `"interactive.background.primary.default"`). They are resolved through `getIn(theme.colors, tokenPath)` at render time, matching the pattern used by `ChartBar`.

When set, they override the categorical/sequential palette for ALL nodes or links respectively. This is the correct model for the Optimizer use case where all nodes are a single brand blue.

### 3d. `labelUnit` prop

The `labelUnit` prop appends a unit string to the node value in the label chip (e.g. `"txn"` → `"7,300 txn"`, `"₹M"` → `"12.6 ₹M"`). This is intentionally a dumb string concatenation — formatting logic (decimal places, abbreviation) is the caller's responsibility.

---

## 4. Context design

`SankeyChartContext` holds `hoveredNodeId` and `hoveredLinkId` to drive coordinated opacity changes across all nodes and links, mirroring the `LineChartContext` pattern. This avoids prop-drilling through the SVG node/link renderers.

---

## 5. Responsiveness

The chart wraps its SVG in a container `<div>` observed by `ResizeObserver`. On width change, the d3-sankey generator is re-invoked synchronously (it is a pure function; no side effects) and the SVG is redrawn. The d3 layout is kept inside a `useMemo` keyed on `[width, height, nodeWidth, nodePadding, nodes, links]`.

---

## 6. Label placement

Labels are always placed to the **right** of the node bar (`x = x1 + CHIP_GAP`), regardless of which column the node is in. This is intentional:

- Uniform placement reduces cognitive load — users always look right of the bar.
- Left-side labels for the rightmost column (Status) would overlap bands.
- The SVG has `overflow: visible`, so labels that extend beyond the SVG bounding box are still rendered (this is correct browser behaviour).

The right margin of the d3 layout extent (`width - 150px`) is reserved for labels so nodes do not crowd them.

---

## 7. Tooltip

The tooltip is rendered as an absolutely positioned `<div>` inside the component's container. It uses `surface.overlay.background` and `surface.background.cloud.subdued` from Blade's token system.

**Future:** Replace with Blade's `<Tooltip>` component once `@floating-ui/react` positioning is integrated, matching the approach used in `CommonChartComponents`.

---

## 8. React Native

Not implemented in v1. The web implementation depends on SVG, ResizeObserver, and d3-sankey, none of which are available in RN. `SankeyChart.native.tsx` throws a `throwBladeError` pointing to this decision doc.

---

## 9. Open questions / future work

| # | Question | Status |
|---|---|---|
| 1 | Should `SankeyChart` integrate with `CommonChartComponentsContext` for shared tooltip/legend? | Open — not needed for v1 since Sankey doesn't use recharts |
| 2 | Should nodes support a secondary "failed" segment (grey sub-bar within the blue bar per Optimizer design)? | Deferred to v2 |
| 3 | Should clicking a provider node filter the SR trend chart (per spec)? | Out of scope for the component; handled by the consuming page |
| 4 | Accessibility: should nodes/links be focusable via keyboard? | Deferred — needs `<title>` and `aria-describedby` on SVG elements |
| 5 | Dark mode automatic flip | Works today via Blade `ThemeProvider` — token values flip without any additional code |
