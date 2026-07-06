---
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): compose Accordion on Collapsible primitive and add CollapsibleText

- `AccordionItem` now wraps its content in `<Collapsible>` so expand/collapse animation, body `id`, and `role="region"` accessibility are owned by `CollapsibleBody` instead of duplicated in the Accordion.
- `AccordionItemHeader` reads the Collapsible context for toggle + `aria-controls`/`aria-expanded` and renders `<CollapsibleChevronIcon>` (chevron rotation now lives in `collapsible.module.css`).
- `AccordionItemBody` delegates animation to `<CollapsibleBody>` and only renders the body content + gray-body styling.
- Add `CollapsibleText` (text + chevron trigger, keyboard accessible) and accept `_dangerouslyDisableValidations` on `Collapsible` for API parity with React.
