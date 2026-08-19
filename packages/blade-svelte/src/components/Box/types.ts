import type { Snippet } from 'svelte';

/**
 * A responsive value can either be a bare value, or an object describing the
 * value at each breakpoint following a mobile-first approach.
 */
export type MakeValueResponsive<T> =
  | T
  | {
      base?: T;
      xs?: T;
      s?: T;
      m?: T;
      l?: T;
      xl?: T;
    };

/**
 * Spacing values supported by Box.
 *
 * - `spacing.*` tokens resolve to the design-system spacing scale via utility classes.
 * - Keywords (`auto`, `fit-content`, `min-content`, `max-content`) resolve to utility classes.
 * - Arbitrary values (`px`, `%`, `calc(...)`, etc.) are **not** representable as utility classes
 *   and are treated as a known limitation (no `style` attribute is emitted).
 */
export type SpacingValueType =
  | `spacing.${string}`
  | 'auto'
  | 'none'
  | 'initial'
  | 'fit-content'
  | 'max-content'
  | 'min-content'
  | `${string}px`
  | `${string}%`
  | `${string}vh`
  | `${string}vw`
  | `calc(${string})`
  | `min(${string})`
  | `max(${string})`;

/** Array shorthand for `padding`/`margin` (`[top, right, bottom, left]`). */
export type ArrayOfMaxLength4<T> = [T] | [T, T] | [T, T, T] | [T, T, T, T];

/**
 * `backgroundColor` tokens supported by the public `Box`.
 * Falls back to `string` so raw CSS colors don't error, but only token-based
 * values render (via utility classes).
 */
export type BoxBackgroundColor =
  | `surface.background.${string}`
  | `overlay.${string}`
  | `feedback.background.${string}`
  | 'transparent'
  | (string & Record<never, never>);

/** `borderColor` tokens supported by Box. */
export type BoxBorderColor =
  | `surface.border.${string}`
  | `popup.border.${string}`
  | `interactive.border.${string}`
  | (string & Record<never, never>);

export type BorderRadiusValue =
  | 'none'
  | '2xsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | 'max'
  | 'round';

export type BorderWidthValue = 'none' | 'thinner' | 'thin' | 'thick' | 'thicker';

export type ElevationValue = 'none' | 'lowRaised' | 'midRaised' | 'highRaised';

// Created as an array so it can be reused for runtime validation.
export const validBoxAsValues = [
  'div',
  'section',
  'footer',
  'header',
  'main',
  'aside',
  'nav',
  'span',
  'label',
] as const;

export type BoxAsType = typeof validBoxAsValues[number];

type R<T> = MakeValueResponsive<T>;

/** Web-only event handlers forwarded by Box. */
export type BoxCallbackProps = {
  onMouseOver?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onScroll?: (event: Event) => void;
};

/** Drag & drop props forwarded by Box. */
export type BoxDragAndDropProps = {
  draggable?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
};

type PaddingProps = {
  padding?: R<SpacingValueType> | R<ArrayOfMaxLength4<SpacingValueType>>;
  paddingX?: R<SpacingValueType>;
  paddingY?: R<SpacingValueType>;
  paddingTop?: R<SpacingValueType>;
  paddingRight?: R<SpacingValueType>;
  paddingBottom?: R<SpacingValueType>;
  paddingLeft?: R<SpacingValueType>;
};

type MarginProps = {
  margin?: R<SpacingValueType> | R<ArrayOfMaxLength4<SpacingValueType>>;
  marginX?: R<SpacingValueType>;
  marginY?: R<SpacingValueType>;
  marginTop?: R<SpacingValueType>;
  marginRight?: R<SpacingValueType>;
  marginBottom?: R<SpacingValueType>;
  marginLeft?: R<SpacingValueType>;
};

type LayoutProps = {
  height?: R<SpacingValueType>;
  minHeight?: R<SpacingValueType>;
  maxHeight?: R<SpacingValueType>;
  width?: R<SpacingValueType>;
  minWidth?: R<SpacingValueType>;
  maxWidth?: R<SpacingValueType>;
  display?: R<string>;
  overflow?: R<string>;
  overflowX?: R<string>;
  overflowY?: R<string>;
  textAlign?: R<string>;
  whiteSpace?: R<string>;
};

type FlexboxProps = {
  gap?: R<SpacingValueType>;
  rowGap?: R<SpacingValueType>;
  columnGap?: R<SpacingValueType>;
  flex?: R<string | number>;
  flexWrap?: R<string>;
  flexDirection?: R<string>;
  flexGrow?: R<string | number>;
  flexShrink?: R<string | number>;
  flexBasis?: R<SpacingValueType>;
  alignItems?: R<string>;
  alignContent?: R<string>;
  alignSelf?: R<string>;
  justifyItems?: R<string>;
  justifyContent?: R<string>;
  justifySelf?: R<string>;
  placeSelf?: R<string>;
  placeItems?: R<string>;
  order?: R<number | string>;
};

type PositionProps = {
  position?: R<string>;
  zIndex?: R<number | string>;
  top?: R<SpacingValueType>;
  right?: R<SpacingValueType>;
  bottom?: R<SpacingValueType>;
  left?: R<SpacingValueType>;
};

type GridProps = {
  grid?: R<string>;
  gridColumn?: R<string>;
  gridRow?: R<string>;
  gridRowStart?: R<string>;
  gridRowEnd?: R<string>;
  gridColumnStart?: R<string>;
  gridColumnEnd?: R<string>;
  gridArea?: R<string>;
  gridAutoFlow?: R<string>;
  gridAutoRows?: R<string>;
  gridAutoColumns?: R<string>;
  gridTemplate?: R<string>;
  gridTemplateAreas?: R<string>;
  gridTemplateColumns?: R<string>;
  gridTemplateRows?: R<string>;
};

type CommonBoxVisualProps = {
  borderRadius?: R<BorderRadiusValue>;
  borderWidth?: R<BorderWidthValue>;
  borderColor?: R<BoxBorderColor>;
  borderTopWidth?: R<BorderWidthValue>;
  borderTopColor?: R<BoxBorderColor>;
  borderRightWidth?: R<BorderWidthValue>;
  borderRightColor?: R<BoxBorderColor>;
  borderBottomWidth?: R<BorderWidthValue>;
  borderBottomColor?: R<BoxBorderColor>;
  borderLeftWidth?: R<BorderWidthValue>;
  borderLeftColor?: R<BoxBorderColor>;
  borderTopLeftRadius?: R<BorderRadiusValue>;
  borderTopRightRadius?: R<BorderRadiusValue>;
  borderBottomRightRadius?: R<BorderRadiusValue>;
  borderBottomLeftRadius?: R<BorderRadiusValue>;
  borderStyle?: R<string>;
  borderTopStyle?: R<string>;
  borderBottomStyle?: R<string>;
  borderLeftStyle?: R<string>;
  borderRightStyle?: R<string>;
  backgroundImage?: R<string>;
  backgroundSize?: R<string>;
  backgroundPosition?: R<string>;
  backgroundOrigin?: R<string>;
  backgroundRepeat?: R<string>;
  pointerEvents?: R<string>;
  opacity?: R<number | string>;
  visibility?: R<string>;
  transform?: R<string>;
  transformOrigin?: R<string>;
  clipPath?: R<string>;
  backdropFilter?: R<string>;
  transition?: R<string>;
  /**
   * Sets the elevation (box-shadow) for Box.
   * @default undefined
   */
  elevation?: R<ElevationValue>;
};

type BoxElementProps = {
  /**
   * The HTML tag to render the Box as.
   * @default 'div'
   */
  as?: BoxAsType;
  /** Children rendered inside the Box. */
  children?: Snippet | string;
  tabIndex?: number;
  id?: string;
  /** Test id applied as `data-testid`. */
  testID?: string;
  /** `elementtiming` attribute for performance measurement. */
  elementtiming?: string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string | undefined;
};

/**
 * Props for the public {@link Box} component.
 */
export interface BoxProps
  extends PaddingProps,
    MarginProps,
    LayoutProps,
    FlexboxProps,
    PositionProps,
    GridProps,
    CommonBoxVisualProps,
    BoxCallbackProps,
    BoxDragAndDropProps,
    BoxElementProps {
  /**
   * Background color of the Box.
   * Only `surface.background.*`, `overlay.*`, `feedback.background.*` and `transparent`
   * render (via utility classes).
   */
  backgroundColor?: R<BoxBackgroundColor>;
}

/**
 * Props for the internal {@link BaseBox} layer. Superset of {@link BoxProps} with
 * the more permissive API used by other Blade components.
 */
export interface BaseBoxProps extends Omit<BoxProps, 'backgroundColor'> {
  backgroundColor?: R<BoxBackgroundColor>;
  lineHeight?: R<SpacingValueType>;
  touchAction?: R<string>;
  userSelect?: R<string>;
  cursor?: R<string>;
  border?: R<string>;
  borderTop?: R<string>;
  borderRight?: R<string>;
  borderBottom?: R<string>;
  borderLeft?: R<string>;
  className?: string;
  /** Overrides the `data-blade-component` meta attribute. */
  ['data-blade-component']?: string;
  /** When true, `elevation` is suppressed (used by Card). */
  $isCard?: boolean;
}

/** The subset of Box props consumed by `getStyledProps` on other components. */
export type StyledPropsBlade = Partial<
  MarginProps &
    Pick<FlexboxProps, 'alignSelf' | 'justifySelf' | 'placeSelf' | 'order' | 'flexWrap'> &
    PositionProps &
    Pick<
      GridProps,
      | 'gridColumn'
      | 'gridRow'
      | 'gridRowStart'
      | 'gridRowEnd'
      | 'gridColumnStart'
      | 'gridColumnEnd'
      | 'gridArea'
    > &
    Pick<LayoutProps, 'display'> &
    Pick<CommonBoxVisualProps, 'visibility'>
>;
