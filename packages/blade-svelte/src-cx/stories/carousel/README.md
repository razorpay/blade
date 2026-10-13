# Carousel

`packages/blade/components/carousel/Carousel.svelte`. The track is a
scroll-snap row; nothing is transformed by hand, so touch, wheel and keyboard
scrolling work as the platform does them.

| Prop | Notes |
| --- | --- |
| `items`, `itemKey`, `children(item, i)` | One full-width slide per item; slides off show are `inert` |
| `index` | Bindable, or host-driven (scrolls there); `onChange` |
| `autoAdvance` | ms between slides, wrapping; `0` off (default). Held while the pointer or focus is inside; off under reduced motion. Fixed at mount |
| `slideLabel(n, count)` | Localized. Names each slide and each dot — dots exist only with it |
| `accessibilityLabel` | Names the carousel (`aria-roledescription="carousel"`) |

The dots are Blade DSL's _Carousel Indicators (Figma): 6px dots 4px apart,
the current one an 18px pill.
