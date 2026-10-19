# Styling

## Description

How to style with Blade in Svelte: Blade's token classes for the app's own elements, style props for a Blade component's look, and what a Blade component's `class` may do. Blade's classes come from its UnoCSS config, so they exist only as listed here (and Tailwind v3's utilities when the app passes a Tailwind theme to `bladeUnoConfig`).

## A Blade component: props for its look, `class` to place it

A component's look is its style props: `variant`, `size`, `color`, `emphasis` and the like (each component doc lists them). Its `class` goes on its root element and only places it: margin, width and height, its part in a flex or grid parent (`flex-1`, `self-end`, `col-span-2`), position and inset, `z-*`, visibility and `hidden`. Typography components (Text, Heading, Display, Code, Amount) also take text alignment, and Skeleton its corner radius. A class that changes the component's own look (colour, padding, border, radius, font) is a restyle: the `blade/no-restyle` lint rule reports it, and it may silently lose to Blade's own class, since classes join without merging.

```svelte
<script lang="ts">
  import { Button, Text } from '@razorpay/blade-svelte/components';
</script>

<!-- Placed: full width, a margin above. Its look stays its props. -->
<Button class="mt-blade-4 w-full" variant="secondary" size="large">Continue</Button>
<Text class="text-center" color="muted">Secured by Razorpay</Text>
```

To change what a token means for one component, repoint the token's variable on it (`class="[--interactive-background-primary-default:hsl(330_80%_45%)]"`): that is a theme, not a restyle (see `Theming.md`).

## Your own elements: Blade's token classes

Lay out and style your own elements with the token classes, mobile first, with `d:` for desktop.

| Family | Classes | Values |
| --- | --- | --- |
| Spacing | `p-blade-N`, `m-blade-N`, `gap-blade-N`, `w-blade-N`, `h-blade-N`, `inset-blade-N`… (also `px`, `py`, `pt`, `mt`, `mx`…) | N 0–11: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56px. Tailwind's numeric scale also works (`p-4` is 16px); write any other length as a value: `w-[176px]` |
| Surface colours | `bg-surface-{gray,primary,sea,cloud,accent}-{subtle,moderate,intense,…}`, `text-surface-{gray,primary,static-white,static-black,on-sea,on-cloud}-{normal,subtle,muted,disabled}`, `icon-surface-…` (same names), `border-surface-{gray,primary}-{normal,subtle,muted}` | Read from the theme's variables |
| Feedback colours | `bg-feedback-{positive,negative,notice,information,neutral}-{subtle,intense}`, `text-feedback-…`, `icon-feedback-…`, `border-feedback-…` | Intent colours |
| Interactive colours | `bg-interactive-{primary,gray,positive,negative,…}-{default,highlighted,disabled,faded}`, `text-interactive-…`, `icon-interactive-…`, `border-interactive-…`, `outline-interactive-…` | For controls you build yourself |
| Type | `text-25`, `text-50`, `text-75`, `text-100`, `text-200`, `text-300`, `text-400`, `text-500`, `text-600` … `text-1100`; `leading-*` (same steps); `tracking-25`, `tracking-50`, `tracking-100`; `font-normal`, `font-medium`, `font-semibold`, `font-bold`; `font-sans` (Inter), `font-heading` (Tasa), `font-mono` | 10, 11, 12, 14, 16, 18, 20, 24, 32 … 72px. Prefer the Text and Heading components for text |
| Radius | `rounded-2xsmall`, `rounded-xsmall`, `rounded-small`, `rounded-medium`, `rounded-large`, `rounded-xlarge`, `rounded-2xlarge`, `rounded-max` | 2, 4, 8, 12, 16, 20, 24, 9999px |
| Border width | `border-thin`, `border-thick`, `border-thicker` (with `border-solid` and a `border-*` colour) | 1, 1.5, 2px |
| Elevation | `surface-raised` (a card's rim and lift), `shadow-card`, `shadow-dropdown` | |
| Motion | `duration-2xquick`, `duration-xquick`, `duration-quick`, `duration-moderate`, `duration-xmoderate`, `duration-gentle`, `duration-xgentle`, `duration-2xgentle`; `ease-standard`, `ease-entrance`, `ease-exit`, `ease-emphasized` | 80, 160, 200, 280, 360, 480, 640, 960ms |
| Opacity | `opacity-blade-N` (from `blade.css`) | Blade's opacity scale |
| Layout | Tailwind's: `flex`, `grid`, `items-center`, `justify-between`, `flex-col`, `grid-cols-2`, `relative`, `absolute`, `inset-0`, `overflow-hidden`, `truncate`, `sr-only`… | |

```svelte
<script lang="ts">
  import { Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<section class="flex flex-col gap-blade-3 rounded-medium bg-surface-gray-intense p-blade-5 surface-raised d:flex-row d:items-center">
  <Heading size="small">Pay in 3 instalments</Heading>
  <Text size="small" color="muted">No cost EMI on cards above ₹3,000</Text>
</section>
```

## Rules the lint enforces

- **One class per property in a list.** `px-2 px-4` both set the padding: classes join, they do not merge, so the stylesheet's order decides. Pick one. Conditional classes go in a ternary (`class={on ? 'px-4' : 'px-2'}`), or one of them is important (`px-4!`).
- **Write every class in full.** `` class={`bg-${tone}`} `` and `class="bg-{tone}"` produce classes UnoCSS never sees. Map the value to whole classes: `const BG = { positive: 'bg-feedback-positive-subtle', negative: 'bg-feedback-negative-subtle' }`.
- **Blade's token names are exact.** `bg-surface-gray-mutd` is reported; an app's own classes are left alone.
- **Spacing tokens over equal lengths.** `p-[16px]` → `p-blade-5`.
- **A Blade component's `class` places it** (above).
