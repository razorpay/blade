---
'@razorpay/blade': minor
---

feat(Accordion): add new `filled` variant

New variant can be used to build individual filled Accordions like these

<img width="400" alt="image" src="https://github.com/razorpay/blade/assets/30949385/7f3d737f-149a-42b0-be1b-1c86d5a0fd83">

> [!Warning]
>
> Accordion has a new API and the current API will be deprecated and removed in next major version

#### Migration from existing API

We have added `AccordionItemHeader` and `AccordionItemBody` components.

Props like `icon`, `title`, `description` from AccordionItem are deprecated.

- `icon` on AccordionItem can be replicated with `leading` on AccordionItemHeader
- `title` moves from AccordionItem to AccordionItemHeader
- `description` from AccordionItem can be passed to AccordionItemBody as children

##### Diff

```diff
<Accordion>
  <AccordionItem
-    icon={StarIcon}
-    title="This is title"
-    description="Body content of Accordion"
  />
</Accordion>
```

```diff
<Accordion>
  <AccordionItem>
+    <AccordionItemHeader leading={<StarIcon size="large" />} title="This is title" />
+    <AccordionItemBody>Body content of Accordion</AccordionItemBody>
  </AccordionItem>
</Accordion>
```

Checkout full documentation at https://blade.razorpay.com/?path=/docs/components-accordion--docs
