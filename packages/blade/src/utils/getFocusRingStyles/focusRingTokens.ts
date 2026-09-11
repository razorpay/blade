/**
 * Figma models the focus ring as a component set with a primary and a neutral variant. The
 * primary ring is the default; the neutral one is used by neutral components, where a blue
 * ring reads as an accent the component does not otherwise have.
 *
 * Shared by web and native so the two platforms cannot drift apart.
 *
 * Kept `as const` so the values stay literal token paths that `getIn` can check, rather than
 * widening to `string`. Indexing this by `FocusRingVariant` still forces every variant to have
 * an entry here.
 */
const focusRingColorTokens = {
  primary: 'surface.border.primary.muted',
  neutral: 'interactive.border.neutral.faded',
} as const;

export { focusRingColorTokens };
