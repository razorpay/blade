---
"@razorpay/blade": minor
---

feat(GenUI): add consumer-registered action slots for Card and Table components

Introduces a `componentActions` registry on `GenUIProvider` that lets consumers register render props for action UI below block-level components (CARD, TABLE). The design system renders the slot and hands the consumer the component's data and a `componentRef`, keeping all action logic (copy, download, export) on the consumer side with no DS dependency.
