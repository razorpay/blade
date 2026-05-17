/**
 * Platform selector for SankeyChart.
 *
 * In the Blade monorepo the bundler resolves `.web.tsx` / `.native.tsx`
 * based on the platform target. This file is the platform-agnostic entry
 * point — callers import from `'./SankeyChart'` and the correct platform
 * implementation is selected automatically.
 *
 * Web:    SankeyChart.web.tsx  — d3-sankey layout + React SVG
 * Native: SankeyChart.native.tsx — throwBladeError stub (not yet implemented)
 */
export { SankeyChart } from './SankeyChart.web';
