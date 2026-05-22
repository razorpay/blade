# SankeyChart — API & Architecture Decisions

**Component:** `SankeyChart`  
**Status:** Draft  
**Authors:** Debabrata Malik (Product Designer, MoneySaver)  
**Last updated:** 2026-05-21

---

## References

- **Design spec:** Section 3.7 — Volume Distribution (Sankey Chart) in the MoneySaver Dashboard spec
- **Related decisions:** [`Charts/_decisions/decisions.md`](../../../Charts/_decisions/decisions.md)

---

## 1. Context & motivation

The Optimizer dashboard (MoneySaver) needs a way to communicate payment volume routing at a glance — how a merchant's total volume splits across Methods (UPI, Card, Wallet, Netbanking), then Providers (Razorpay, PayU, Billdesk), and finally terminal Status (Successful, Failed).

No existing Blade chart type supports this flow topology. A Sankey diagram is the standard representation for this class of problem; it encodes both **distribution** (node height proportional to volume) and **routing** (link width proportional to flow between a source and target).

---

## 2. Rendering approach — recharts native Sankey

All other Blade charts (BarChart, LineChart, AreaChart, DonutChart) are built on **recharts**. Recharts v3.7.0 (already a Blade dependency) ships a native `<Sankey>` component that handles layout calculation, responsive sizing via `<ResponsiveContainer>`, and tooltip positioning. Using it keeps SankeyChart fully consistent with the rest of the Blade charts layer.

### Options evaluated

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **recharts native `<Sankey>`** | Consistent with all other Blade charts; `<ResponsiveContainer>` replaces manual ResizeObserver; Recharts Tooltip handles edge-flip natively; zero new dependencies | Custom `node`/`link` render props required for Blade-token styling | ✅ **Chosen** |
| d3-sankey + React SVG | Full layout control; pure JS | Adds a new dependency (~10 KB); duplicates what recharts already provides; inconsistent with the rest of the charts layer | ❌ Rejected |
| A wrapper around an existing React Sankey lib (e.g. `react-d3-sankey`, `@ant-design/charts`) | Less code | Adds a large opaque dependency; styling and token integration conflicts with Blade's design language | ❌ Rejected |

**Decision:** Use Recharts' built-in `<Sankey>` for layout, `<ResponsiveContainer>` for sizing, and Recharts `<Tooltip>` for hover cards. Blade token application is done entirely inside the custom `node` and `link` render props — no recharts internals are patched.

---

## 3. Component API design

### 3a. Single component vs composition API

BarChart uses a **composition API** (`<ChartBarWrapper>` + `<ChartBar>` + `<ChartXAxis>` …) because recharts itself is compositional and each sub-component maps to a recharts primitive. Since SankeyChart's visual output is a single connected diagram, a composition API would add indirection without benefit.

**Decision:** Single `<SankeyChart data={} />` prop API. This is simpler to use and sufficient for the current use cases.

### 3b. Node & link data shape

```ts
type SankeyDataNode = {
  id: string;
  name: string;
  color?: ChartsCategoricalColorToken; // optional per-node color override
};

type SankeyDataLink = {
  source: string; // node id
  target: string; // node id
  value: number;
};

// Prop
data: { nodes: SankeyDataNode[]; links: SankeyDataLink[] }
```

**Why a flat `nodes` array instead of a nested `levels` array?**  
Recharts' `<Sankey>` accepts a flat node list and infers column layout from the link topology. Using the same shape means zero intermediate transformation for the majority of callers. Column membership is implicit in the graph structure — callers don't need to manage it.

**Why string `id` references in links instead of numeric indices?**  
Numeric indices are brittle — inserting a node in the middle renumbers everything downstream. String IDs are stable. The component builds a `Map<id, index>` internally to transform to Recharts' required numeric format in O(1).

**Why separate `id` and `name` on a node?**  
`id` is the stable reference key used in links; `name` is the human-readable display label. Keeping them separate avoids breakage when display names change (e.g. "Razorpay PG" → "Razorpay") without touching any link definitions.

**Why is `color` optional on the node?**  
Most callers will use the default categorical palette or `nodeColorOverride`. Per-node color is an escape hatch for one-off use cases.

### 3c. Color override props

`nodeColorOverride` and `linkColorOverride` accept typed Blade color token paths (`ChartsCategoricalColorToken`). They are resolved through `getIn(theme.colors, tokenPath)` at render time, matching the pattern used by other Blade chart components.

When set, they override the categorical palette for ALL nodes or links respectively. Per-node `color` takes precedence over the palette but is overridden by `nodeColorOverride`.

### 3d. `labelUnit` prop

The `labelUnit` prop appends a unit string to the humanized node value in the label (e.g. `"txn"` → `"4.4k txn"`). Values are formatted using Indian number conventions (k / L / Cr) with truncation (not rounding) to avoid overstating values.

### 3e. `showLabelChip` prop

When `true` (default), labels render as Blade-styled chip cards (gray intense background, faded border, 8px radius) showing node name + humanized value + percentage. When `false`, the same information is rendered as plain SVG text — cleaner for dense charts or static exports. Both modes use identical wrapping logic (single-line vs two-line based on CHIP_MAX_WIDTH) and identical percentage suppression (omitted when a node is the only one at its depth level).

---

## 4. Context & color mapping

`SankeyChart` provides `CommonChartComponentsContext` (same context used by BarChart, DonutChart, etc.) with a `dataColorMapping` keyed by node `id`. This enables consistent color token resolution across the charts layer and supports future integration with shared legend/tooltip components.

Hover state (`{ type: 'node' | 'link'; index: number } | null`) is managed locally via `useState` in the component — it does not need to live in context since nodes and links are rendered in a single SVG tree.

---

## 5. Responsiveness

`<ResponsiveContainer width="100%" height={height}>` from recharts handles container measurement and passes the resolved width/height into the `<Sankey>` component. This replaces any manual `ResizeObserver` pattern.

For narrow viewports, the SVG is wrapped in a horizontally scrollable `<div>` with `minWidth: MIN_CHART_WIDTH` (560px) so the Sankey layout never collapses below a legible size.

---

## 6. Label placement

Labels are always placed to the **right** of the node bar (`x = nodeX + nodeWidth + CHIP_GAP`), regardless of which column the node is in. This is intentional:

- Uniform placement reduces cognitive load — users always look right of the bar.
- The Recharts `margin.right` is set to `dynamicRightMargin` — computed from the widest label across all nodes using the Canvas API for accurate proportional-font measurement — so labels are never clipped.

---

## 7. Tooltip

The tooltip uses Recharts' built-in `<Tooltip>` with a custom `content` render prop that applies Blade tokens (background, border, typography, elevation). Recharts handles positioning and edge-flip natively — no manual coordinate calculation is needed.

---

## 8. React Native

Not implemented in v1. The web implementation depends on SVG and recharts, which are not available in React Native. `SankeyChart.native.tsx` throws a `throwBladeError` pointing to this decision doc.

---

## 9. Open questions / future work

| # | Question | Status |
|---|---|---|
| 1 | Should nodes support a secondary "failed" segment (grey sub-bar within the blue bar per Optimizer design)? | Deferred to v2 |
| 2 | Should clicking a provider node filter the SR trend chart (per spec)? | Out of scope for the component; handled by the consuming page |
| 3 | Accessibility: should nodes/links be focusable via keyboard? | Deferred — needs `<title>` and `aria-describedby` on SVG elements |
| 4 | Dark mode automatic flip | Works today via Blade `ThemeProvider` — token values flip without any additional code |
