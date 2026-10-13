# StyledPropsBlade Type Definitions

These are the types supported in components that accept styled props.

````ts
type SpacingValueType =
  | `spacing.${keyof Spacing}`
  | `${string}${'px' | '%' | 'vh' | 'vw'}`
  | `calc(${string})`
  | 'auto'
  | `min(${string})`
  | `max(${string})`
  | 'none'
  | 'initial'
  | 'fit-content'
  | 'max-content'
  | 'min-content';

type LayoutProps = MakeObjectResponsive<
  {
    height: SpacingValueType;
    minHeight: SpacingValueType;
    maxHeight: SpacingValueType;
    width: SpacingValueType;
    minWidth: SpacingValueType;
    maxWidth: SpacingValueType;
  } & PickCSSByPlatform<
    'display' | 'overflow' | 'overflowX' | 'overflowY' | 'textAlign' | 'whiteSpace'
  >
>;

type MarginProps = MakeObjectResponsive<{
  /**
   * ### Margin Shorthand
   *
   * #### Usage
   *
   * ```jsx
   * margin="spacing.3"
   * margin="20px"
   * // margin={[top, right, bottom, left]}
   * margin={["spacing.3", "spacing.1", "spacing.0", "10px"]}
   *
   * // responsive
   * margin={{ base: 'spacing.2', m: 'spacing.7' }}
   * ```
   */
  margin: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  /**
   * Margin Horizontal
   */
  marginX: SpacingValueType;
  /**
   * Margin Vertical
   */
  marginY: SpacingValueType;
  marginTop: SpacingValueType;
  marginRight: SpacingValueType;
  marginBottom: SpacingValueType;
  marginLeft: SpacingValueType;
}>;

type FlexboxProps = MakeObjectResponsive<
  {
    gap: SpacingValueType;
    rowGap: SpacingValueType;
    columnGap: SpacingValueType;
    flex: string | number;
  } & PickCSSByPlatform<
    | 'flexWrap'
    | 'flexDirection'
    | 'flexGrow'
    | 'flexShrink'
    | 'flexBasis'
    | 'alignItems'
    | 'alignContent'
    | 'alignSelf'
    | 'justifyItems'
    | 'justifyContent'
    | 'justifySelf'
    | 'placeSelf'
    | 'placeItems'
    | 'order'
  >
>;

type PositionProps = MakeObjectResponsive<
  {
    top: SpacingValueType;
    right: SpacingValueType;
    bottom: SpacingValueType;
    left: SpacingValueType;
  } & PickCSSByPlatform<'position' | 'zIndex'>
>;

type GridProps = MakeObjectResponsive<
  PickCSSByPlatform<
    | 'grid'
    | 'gridColumn'
    | 'gridRow'
    | 'gridRowStart'
    | 'gridRowEnd'
    | 'gridColumnStart'
    | 'gridColumnEnd'
    | 'gridArea'
    | 'gridAutoFlow'
    | 'gridAutoRows'
    | 'gridAutoColumns'
    | 'gridTemplate'
    | 'gridTemplateAreas'
    | 'gridTemplateColumns'
    | 'gridTemplateRows'
  >
>;

type StyledPropsBlade = Partial<
  MarginProps &
    Pick<FlexboxProps, 'alignSelf' | 'justifySelf' | 'placeSelf' | 'order'> &
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
    Pick<CSSProperties, 'display' | 'visibility'>
>;

type Spacing = Readonly<{
  /** 0: 0px */
  0: 0;
  /** 1: 2px */
  1: 2;
  /** 2: 4px */
  2: 4;
  /** 3: 8px */
  3: 8;
  /** 4: 12px */
  4: 12;
  /** 5: 16px */
  5: 16;
  /** 6: 20px */
  6: 20;
  /** 7: 24px */
  7: 24;
  /** 8: 32px */
  8: 32;
  /** 9: 40px */
  9: 40;
  /** 10: 48px */
  10: 48;
  /** 11: 56px */
  11: 56;
}>;
````
