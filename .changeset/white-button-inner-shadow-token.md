---
'@razorpay/blade': patch
---

fix(Button): use `interactive.border.staticBlack.fadedHighlighted` for the white primary button's border shadow

The white `primary` button's second inner shadow — the 0.5px spread one that draws the button's border — was painted with `interactive.border.staticWhite.default`, an opaque white. Figma's `_components/Button/White/Primary/Default` effect style now resolves both of its inner shadows to `interactive.border.staticBlack.fadedHighlighted`, so the token map is brought in line with the design source.

This applies to the `default` and `highlighted` states, which between them cover the button's rest, hover, active, and focus-ring appearance. Web and native both read the same `boxShadow` token map, so the change lands on both platforms. The white `secondary` and `tertiary` variants are untouched and keep `interactive.border.staticWhite.highlighted`.

> **Visual change (no API change):** the border of every white primary button shifts from opaque white to a faded black. `ButtonGroup` renders white buttons too, so its snapshots move with it.
