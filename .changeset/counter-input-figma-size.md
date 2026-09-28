---
'@razorpay/blade': patch
'@razorpay/blade-core': patch
---

fix(CounterInput): match Figma container sizes

Every size was rendering 2px taller and wider than the Figma frames because the 1px border was added on top of the Figma size. Containers are now 28/32/36/48px tall and 76/84/92/120px wide (xsmall/small/medium/large), with the buttons still 4px from each edge. On React web, the buttons now also stay pinned to the edges when the value is shorter than the minimum width.
