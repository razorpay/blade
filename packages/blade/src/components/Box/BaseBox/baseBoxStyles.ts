import type { CSSObject } from 'styled-components';
import type {
  BaseBoxProps,
  MakeValueResponsive,
  SpacingValueType,
  ArrayOfMaxLength4,
} from './types';
import type { Breakpoints } from '~tokens/global/breakpoints';
import breakpoints from '~tokens/global/breakpoints';
import { getMediaQuery } from '~src/utils/getMediaQuery';
import { isReactNative, isEmpty, getIn, makeSpace, makeBorderSize } from '~utils';
import type { Theme } from '~components/BladeProvider';

/**
 * A helper function that returns the exact value for that breakpoint on passing the prop and breakpoint
 *
 * ## Usage
 *
 * ### Get base value of prop
 *
 * ```ts
 * getResponsiveValue(props.yourProp, 'base');
 * // yourProp="hi" -> "hi"
 * // yourProp={{ base: 'hello', m: 'hi' }} -> "hello"
 * // yourProp={{ m: 'hi' }} -> undefined
 * ```
 *
 * ### Get value of particular breakpoint
 *
 *
 * ```ts
 * getResponsiveValue(props.yourProp, 'm');
 * // yourProp="hi" -> undefined
 * // yourProp={{ base: 'hello', m: 'hi' }} -> "hi"
 * // yourProp={{ m: 'hi' }} -> "hi"
 * ```
 */
const getResponsiveValue = <T extends string | number | string[]>(
  value: MakeValueResponsive<T> | undefined,
  breakpoint: keyof Breakpoints = 'base',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
    /**
     * Flat values like string or number should only be added in `base` styles.
     *
     * E.g. if you pass `display="block"`, it should only put that style in base style and not in media queries
     * ```js
     * // Output should be just this-
     * display: block;
     *
     * // And not this-
     * display: block;
     * media (min-width: s) {
     *   display: block;
     * }
     *
     * media (min-width: m) {
     *   display: block
     * }
     * //  and more ...
     * ```
     */
    if (breakpoint === 'base') {
      return value;
    }

    return undefined;
  }

  if (isEmpty(value)) {
    return undefined;
  }

  if (isReactNative()) {
    // In React Native, we map the value `s` token on priority (since the breakpoint maps to mobiles in useBreakpoint hook).
    // We further look into smaller sizes, then we check base size.
    // Then we return the first non-undefined value in this priority
    const priorityArray = [value.s, value.xs, value.base];
    return priorityArray.find((val) => val !== undefined);
  }

  return value[breakpoint];
};

const getSpacingValue = (
  spacingValue:
    | MakeValueResponsive<SpacingValueType | ArrayOfMaxLength4<SpacingValueType>>
    | undefined,
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string | undefined => {
  if (isEmpty(spacingValue)) {
    return undefined;
  }

  const responsiveSpacingValue: SpacingValueType | SpacingValueType[] = getResponsiveValue(
    spacingValue as MakeValueResponsive<string | string[]>,
    breakpoint,
  );

  if (isEmpty(responsiveSpacingValue)) {
    return undefined;
  }

  if (responsiveSpacingValue === 'auto') {
    return responsiveSpacingValue;
  }

  if (Array.isArray(responsiveSpacingValue)) {
    return responsiveSpacingValue.map((value) => getSpacingValue(value, theme)).join(' ');
  }

  if (typeof responsiveSpacingValue === 'string' && responsiveSpacingValue.startsWith('spacing.')) {
    const spacingReturnValue = getIn(theme, responsiveSpacingValue);
    return isEmpty(spacingReturnValue) ? makeSpace(spacingReturnValue) : undefined;
  }

  // pixel or with unit values
  return responsiveSpacingValue;
};

const getBackgroundValue = (
  backgroundColor: BaseBoxProps['backgroundColor'],
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string => {
  const responsiveBackgroundValue = getResponsiveValue(backgroundColor, breakpoint);
  const tokenValue = getIn(theme, `colors.${responsiveBackgroundValue}`);
  return tokenValue ?? responsiveBackgroundValue;
};

const getBorderRadiusValue = (
  borderRadius: BaseBoxProps['borderRadius'],
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string | undefined => {
  const responsiveBorderRadiusValue = getResponsiveValue(borderRadius, breakpoint);
  return isEmpty(responsiveBorderRadiusValue)
    ? undefined
    : makeBorderSize(getIn(theme, `border.radius.${responsiveBorderRadiusValue}`));
};

const getAllProps = (
  props: BaseBoxProps & { theme: Theme },
  breakpoint?: keyof Breakpoints,
): CSSObject => {
  return {
    display: getResponsiveValue(props.display, breakpoint),
    overflow: getResponsiveValue(props.overflow, breakpoint),
    overflowX: getResponsiveValue(props.overflowX, breakpoint),
    overflowY: getResponsiveValue(props.overflowY, breakpoint),

    // Flex
    flex: getResponsiveValue(props.flex, breakpoint),
    flexWrap: getResponsiveValue(props.flexWrap, breakpoint),
    flexDirection: getResponsiveValue(props.flexDirection, breakpoint),
    flexGrow: getResponsiveValue(props.flexGrow, breakpoint),
    flexShrink: getResponsiveValue(props.flexShrink, breakpoint),
    flexBasis: getResponsiveValue(props.flexBasis, breakpoint),
    alignItems: getResponsiveValue(props.alignItems, breakpoint),
    alignContent: getResponsiveValue(props.alignContent, breakpoint),
    alignSelf: getResponsiveValue(props.alignSelf, breakpoint),
    justifyItems: getResponsiveValue(props.justifyItems, breakpoint),
    justifyContent: getResponsiveValue(props.justifyContent, breakpoint),
    justifySelf: getResponsiveValue(props.justifySelf, breakpoint),
    order: getResponsiveValue(props.order, breakpoint),
    position: getResponsiveValue(props.position, breakpoint),
    zIndex: getResponsiveValue(props.zIndex, breakpoint),

    // Grid
    grid: getResponsiveValue(props.grid, breakpoint),
    gridColumn: getResponsiveValue(props.gridColumn, breakpoint),
    gridRow: getResponsiveValue(props.gridRow, breakpoint),
    gridRowStart: getResponsiveValue(props.gridRowStart, breakpoint),
    gridRowEnd: getResponsiveValue(props.gridRowEnd, breakpoint),
    gridArea: getResponsiveValue(props.gridArea, breakpoint),
    gridAutoFlow: getResponsiveValue(props.gridAutoFlow, breakpoint),
    gridAutoRows: getResponsiveValue(props.gridAutoRows, breakpoint),
    gridAutoColumns: getResponsiveValue(props.gridAutoColumns, breakpoint),
    gridTemplate: getResponsiveValue(props.gridTemplate, breakpoint),
    gridTemplateAreas: getResponsiveValue(props.gridTemplateAreas, breakpoint),
    gridTemplateColumns: getResponsiveValue(props.gridTemplateColumns, breakpoint),
    gridTemplateRows: getResponsiveValue(props.gridTemplateRows, breakpoint),

    // Spacing Props
    padding: getSpacingValue(props.padding, props.theme, breakpoint),
    paddingTop: getSpacingValue(props.paddingTop ?? props.paddingY, props.theme, breakpoint),
    paddingBottom: getSpacingValue(props.paddingBottom ?? props.paddingY, props.theme, breakpoint),
    paddingRight: getSpacingValue(props.paddingRight ?? props.paddingX, props.theme, breakpoint),
    paddingLeft: getSpacingValue(props.paddingLeft ?? props.paddingX, props.theme, breakpoint),
    margin: getSpacingValue(props.margin, props.theme, breakpoint),
    marginBottom: getSpacingValue(props.marginBottom ?? props.marginY, props.theme, breakpoint),
    marginTop: getSpacingValue(props.marginTop ?? props.marginY, props.theme, breakpoint),
    marginRight: getSpacingValue(props.marginRight ?? props.marginX, props.theme, breakpoint),
    marginLeft: getSpacingValue(props.marginLeft ?? props.marginX, props.theme, breakpoint),
    height: getSpacingValue(props.height, props.theme, breakpoint),
    minHeight: getSpacingValue(props.minHeight, props.theme, breakpoint),
    maxHeight: getSpacingValue(props.maxHeight, props.theme, breakpoint),
    width: getSpacingValue(props.width, props.theme, breakpoint),
    minWidth: getSpacingValue(props.minWidth, props.theme, breakpoint),
    maxWidth: getSpacingValue(props.maxWidth, props.theme, breakpoint),
    gap: getSpacingValue(props.gap, props.theme, breakpoint),
    rowGap: getSpacingValue(props.rowGap, props.theme, breakpoint),
    columnGap: getSpacingValue(props.columnGap, props.theme, breakpoint),
    top: getSpacingValue(props.top, props.theme, breakpoint),
    right: getSpacingValue(props.right, props.theme, breakpoint),
    bottom: getSpacingValue(props.bottom, props.theme, breakpoint),
    left: getSpacingValue(props.left, props.theme, breakpoint),

    // Visual props
    backgroundColor: getBackgroundValue(props.backgroundColor, props.theme, breakpoint),
    borderRadius: getBorderRadiusValue(props.borderRadius, props.theme, breakpoint),
    transform: getResponsiveValue(props.transform, breakpoint),
    lineHeight: getSpacingValue(props.lineHeight, props.theme, breakpoint),
    border: getResponsiveValue(props.border, breakpoint),
    borderTop: getResponsiveValue(props.borderTop, breakpoint),
    borderRight: getResponsiveValue(props.borderRight, breakpoint),
    borderBottom: getResponsiveValue(props.borderBottom, breakpoint),
    borderLeft: getResponsiveValue(props.borderLeft, breakpoint),
    touchAction: props.touchAction,
    userSelect: props.userSelect,
    opacity: props.opacity,
  };
};

/** We only add breakpoint if at least one of the value is defined */
const shouldAddBreakpoint = (cssProps: CSSObject): boolean => {
  const firstDefinedValue = Object.values(cssProps).find(
    (cssValue) => cssValue !== undefined && cssValue !== null,
  );

  return firstDefinedValue !== undefined;
};

const getAllMediaQueries = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  if (isReactNative()) {
    return {};
  }

  const { base, ...breakpointsWithoutBase } = breakpoints;

  return Object.fromEntries(
    Object.entries(breakpointsWithoutBase).map(([breakpointKey, breakpointValue]) => {
      const cssPropsForCurrentBreakpoint = getAllProps(props, breakpointKey as keyof Breakpoints);
      if (!shouldAddBreakpoint(cssPropsForCurrentBreakpoint)) {
        return [];
      }

      const mediaQuery = `@media ${getMediaQuery({ min: breakpointValue })}`;
      return [mediaQuery, cssPropsForCurrentBreakpoint];
    }),
  );
};

const getBaseBoxStyles = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  return {
    ...getAllProps(props),
    ...getAllMediaQueries(props),
  };
};

export {
  getBaseBoxStyles,
  getResponsiveValue,
  getSpacingValue,
  getBackgroundValue,
  getBorderRadiusValue,
  shouldAddBreakpoint,
  getAllMediaQueries,
  getAllProps,
};
