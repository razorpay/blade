/**
 * SegmentedControl template classes (Tailwind).
 *
 * The item button's focus/hover/disabled/selected states live in the `.blade-segmented-item*`
 * plugin component classes; everything else is atomic here.
 *
 * NOTE — the item-text size/line-height/family classes intentionally reference the legacy
 * `--typography-*` CSS variables that the original `.module.css` used. Those variables are NOT
 * defined in `theme.css`, so these declarations were already no-ops (text size/family came from
 * inheritance / the wrapping BaseText). They are preserved verbatim via arbitrary values so the
 * migration changes no rendering; "fixing" them to real tokens would be a behavioral change.
 */
export const getSegmentedControlTemplateClasses = (): Record<string, string> => ({
  container: 'flex w-full items-center relative bg-interactive-background-gray-faded',
  containerSizeSmall: 'gap-spacing-1 p-spacing-1 rounded-small',
  containerSizeMedium: 'gap-spacing-1 p-spacing-2 rounded-medium',
  containerSizeLarge: 'gap-spacing-1 p-spacing-2 rounded-medium',
  field: 'flex',
  fieldTop: 'flex-col',
  fieldLeft: 'flex-row items-start gap-spacing-4',
  fieldBody: 'flex-1',
  item: 'blade-segmented-item',
  itemSelected: 'blade-segmented-item-selected',
  itemSizeSmall: 'py-spacing-1 px-spacing-3 rounded-xsmall',
  itemSizeMedium: 'py-spacing-2 px-spacing-3 rounded-small',
  itemSizeLarge: 'py-spacing-3 px-spacing-3 rounded-small',
  itemText: 'font-[500] font-[family-name:var(--typography-fonts-family-text)]',
  itemTextSizeSmall:
    'text-[length:var(--typography-fonts-size-100)] leading-[var(--typography-lineheights-m)]',
  itemTextSizeMedium:
    'text-[length:var(--typography-fonts-size-100)] leading-[var(--typography-lineheights-m)]',
  itemTextSizeLarge:
    'text-[length:var(--typography-fonts-size-200)] leading-[var(--typography-lineheights-l)]',
  itemTextNormal: 'text-interactive-text-gray-normal',
  itemTextMuted: 'text-interactive-text-gray-muted',
  itemTextDisabled: 'text-interactive-text-gray-disabled',
  indicator:
    'pointer-events-none absolute left-spacing-0 top-spacing-0 bg-surface-background-gray-intense transition-[transform,width,height] ease-standard',
  indicatorAnimating: 'duration-moderate',
  indicatorInstant: 'duration-0',
  indicatorRadiusSmall: 'rounded-xsmall',
  indicatorRadiusMediumToken: 'rounded-small',
});
