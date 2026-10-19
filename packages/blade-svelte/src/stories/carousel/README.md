# Carousel

`src/components/carousel/Carousel.svelte`. The track is a
scroll-snap row; nothing is transformed by hand, so touch, wheel and keyboard
scrolling work as the platform does them.

| Prop | Notes |
| --- | --- |
| `items`, `itemKey`, `children(item, i)` | One full-width slide per item; slides off show are `inert` |
| `activeSlide` | Bindable, or host-driven (scrolls there), default `0`; `onChange(slideIndex)` |
| `autoPlay` | A slide every 6s, wrapping; off by default. Held while the pointer or focus is inside; off under reduced motion |
| `showIndicators` | The dots under the slides (default `true`), each going to its slide; none for one slide |
| `slideLabel(position, count)` | Localized; names each slide. Default `${position} of ${count}` |
| `indicatorLabel(position)`, `indicatorsAccessibilityLabel` | Localized; name each dot (default `Slide ${position}`) and the row of dots (default `Slides`) |
| `accessibilityLabel` | Names the carousel (`aria-roledescription="carousel"`) |

The dots are a `tablist` and each slide a `tabpanel` it controls, as React's.
They are Blade DSL's _Carousel Indicators (Figma): 6px dots 4px apart,
the current one an 18px pill.
