# Carousel

`src/components/carousel/Carousel.svelte`. The track is a
scroll-snap row; nothing is transformed by hand, so touch, wheel and keyboard
scrolling work as the platform does them.

| Prop | Notes |
| --- | --- |
| `items`, `itemKey`, `children(item, i)` | One full-width slide per item; slides off show are `inert` |
| `activeSlide` | Bindable, or host-driven (scrolls there), default `0`; `onChange(slideIndex)` |
| `autoPlay` | A slide every 6s, wrapping; off by default. Held while the pointer or focus is inside; off under reduced motion |
| `showIndicators` | The dots under the slides (default `true`), each going to its slide; with fewer than two slides (or none, while loading) neither dots nor previous/next buttons show |
| `showNavigationButtons` | The previous and next buttons (default `true`); off hides them at every width (Blade hides them on phones only) |
| `navigationButtonPosition` | `bottom` (default, around the dots), `side` or `side-overlap` (half past the edge); phones always use `bottom` |
| `navigationButtonVariant` | `filled` (default, white and raised) or `stroked` (a white wash) |
| `previousButtonLabel`, `nextButtonLabel` | Localized; default `Previous Slide`, `Next Slide` |
| `slideLabel(position, count)` | Localized; names each slide. Default `${position} of ${count}` |
| `indicatorLabel(position)`, `indicatorsAccessibilityLabel` | Localized; name each dot (default `Slide ${position}`) and the row of dots (default `Slides`) |
| `accessibilityLabel` | Names the carousel (`aria-roledescription="carousel"`) |

The dots are a `tablist` and each slide a `tabpanel` it controls, as React's.
Laid out as Blade's: slides 12px apart (16px from `d:` up), the controls
24px below them, 12px around the dots. On phones the dots are Blade's round
6px dots, the current one ringed while auto-play runs; from `d:` up they are
6px dots 4px apart, the current one an 18px pill.
