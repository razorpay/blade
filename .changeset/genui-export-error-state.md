---
'@razorpay/blade': minor
---

feat(GenUI): add error state UI for export actions and consumer-registered action slots

Adds error status to export action state machine with red X icon feedback for copy/download failures, error labels, and telemetry dispatch with status: 'error'. Also adds consumer-registered action slots via `componentActions` config on `GenUIProvider`, allowing consumers to register render props per component type that receive the component's data and DOM ref.
