---
'@razorpay/blade': minor
---

feat(native): flesh out DatePicker, BarChart, CommonChartComponents, and Toast native implementations

Builds out the native (React Native) implementations of components that previously shipped only as scaffolds:

- **DatePicker.native.tsx** — full Tier-1 native picker (was a stub). Calendar
  renders inside a `BottomSheet`; supports `single` / `range` selection, presets,
  min/max date, controlled state, locale-aware weekday labels via dayjs,
  customisable header / apply / cancel / clear-button labels, and accessibility
  state on day cells. Unsupported web-only props (`picker`, masked input, form
  validation props) emit a `__DEV__` warning and are otherwise ignored.
- **Charts/BarChart/BarChart.native.tsx** — Tier-1 bar chart implementation.
  Renders horizontal stacked / grouped bars via `react-native-svg`, with axes,
  legend, grid, reference lines, secondary X-axis labels, and an empty-state
  message when `data` is empty. `layout="vertical"` is a tracked follow-up and
  emits a `__DEV__` warning today.
- **Charts/CommonChartComponents/** — native marker components for axes,
  legend, grid, reference line, and tooltip. The tooltip emits a one-shot
  `__DEV__` warning when used on native (native tooltip is a follow-up).
- **Toast** — `Toast.native.tsx`, `ToastContainer.native.tsx`, and
  `useToast.native.tsx` replace the previous web-only Toast stack. `show()`,
  `dismiss()`, promotional toast deduping, auto-dismiss, and the entrance /
  exit animation are all wired up. Cross-platform `ToastProps.action.onClick`
  type is corrected (was `event: ButtonProps['onClick']`, now
  `event: React.MouseEvent<HTMLButtonElement>` — a fix to an existing typo).

Driven by the Razorpay merchant mobile app's Blade v12 migration spike, where
the prior native stubs were insufficient for the home/payments screens.
