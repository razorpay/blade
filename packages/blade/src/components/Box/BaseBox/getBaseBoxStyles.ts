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
import { isReactNative, isEmpty, getIn, makeSpace, makeSize } from '~utils';
import type { Theme } from '~components/BladeProvider';

const getResponsiveValue = <T extends string | number | string[]>(
  value: MakeValueResponsive<T> | undefined,
  size: keyof Breakpoints = 'base',
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
    if (size === 'base') {
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

  return value[size];
};

const getSpacingValue = (
  spacingValue:
    | MakeValueResponsive<SpacingValueType | ArrayOfMaxLength4<SpacingValueType>>
    | undefined,
  theme: Theme,
  size?: keyof Breakpoints,
): string | undefined => {
  if (isEmpty(spacingValue)) {
    return undefined;
  }

  const responsiveSpacingValue: SpacingValueType | SpacingValueType[] = getResponsiveValue(
    spacingValue as MakeValueResponsive<string | string[]>,
    size,
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
  size?: keyof Breakpoints,
): string => {
  const responsiveBackgroundValue = getResponsiveValue(backgroundColor, size);
  const tokenValue = getIn(theme, `colors.${responsiveBackgroundValue}`);
  return tokenValue ?? responsiveBackgroundValue;
};

const getBorderRadiusValue = (
  borderRadius: BaseBoxProps['borderRadius'],
  theme: Theme,
  size?: keyof Breakpoints,
): string | undefined => {
  const responsiveBorderRadiusValue = getResponsiveValue(borderRadius, size);
  return isEmpty(responsiveBorderRadiusValue)
    ? undefined
    : makeSize(getIn(theme, `border.radius.${responsiveBorderRadiusValue}`));
};

const getAllProps = (
  props: BaseBoxProps & { theme: Theme },
  size?: keyof Breakpoints,
): CSSObject => {
  return {
    display: getResponsiveValue(props.display, size),
    overflow: getResponsiveValue(props.overflow, size),

    // Flex
    flex: getResponsiveValue(props.flex, size),
    flexWrap: getResponsiveValue(props.flexWrap, size),
    flexDirection: getResponsiveValue(props.flexDirection, size),
    flexGrow: getResponsiveValue(props.flexGrow, size),
    flexShrink: getResponsiveValue(props.flexShrink, size),
    flexBasis: getResponsiveValue(props.flexBasis, size),
    alignItems: getResponsiveValue(props.alignItems, size),
    alignContent: getResponsiveValue(props.alignContent, size),
    alignSelf: getResponsiveValue(props.alignSelf, size),
    justifyItems: getResponsiveValue(props.justifyItems, size),
    justifyContent: getResponsiveValue(props.justifyContent, size),
    justifySelf: getResponsiveValue(props.justifySelf, size),
    order: getResponsiveValue(props.order, size),
    position: getResponsiveValue(props.position, size),
    zIndex: getResponsiveValue(props.zIndex, size),

    // Grid
    grid: getResponsiveValue(props.grid, size),
    gridColumn: getResponsiveValue(props.gridColumn, size),
    gridRow: getResponsiveValue(props.gridRow, size),
    gridRowStart: getResponsiveValue(props.gridRowStart, size),
    gridRowEnd: getResponsiveValue(props.gridRowEnd, size),
    gridArea: getResponsiveValue(props.gridArea, size),
    gridAutoFlow: getResponsiveValue(props.gridAutoFlow, size),
    gridAutoRows: getResponsiveValue(props.gridAutoRows, size),
    gridAutoColumns: getResponsiveValue(props.gridAutoColumns, size),
    gridTemplate: getResponsiveValue(props.gridTemplate, size),
    gridTemplateAreas: getResponsiveValue(props.gridTemplateAreas, size),
    gridTemplateColumns: getResponsiveValue(props.gridTemplateColumns, size),
    gridTemplateRows: getResponsiveValue(props.gridTemplateRows, size),

    // Spacing Props
    padding: getSpacingValue(props.padding, props.theme, size),
    paddingTop: getSpacingValue(props.paddingTop ?? props.paddingY, props.theme, size),
    paddingBottom: getSpacingValue(props.paddingBottom ?? props.paddingY, props.theme, size),
    paddingRight: getSpacingValue(props.paddingRight ?? props.paddingX, props.theme, size),
    paddingLeft: getSpacingValue(props.paddingLeft ?? props.paddingX, props.theme, size),
    margin: getSpacingValue(props.margin, props.theme, size),
    marginBottom: getSpacingValue(props.marginBottom, props.theme, size),
    marginTop: getSpacingValue(props.marginTop, props.theme, size),
    marginRight: getSpacingValue(props.marginRight, props.theme, size),
    marginLeft: getSpacingValue(props.marginLeft, props.theme, size),
    height: getSpacingValue(props.height, props.theme, size),
    minHeight: getSpacingValue(props.minHeight, props.theme, size),
    maxHeight: getSpacingValue(props.maxHeight, props.theme, size),
    width: getSpacingValue(props.width, props.theme, size),
    minWidth: getSpacingValue(props.minWidth, props.theme, size),
    maxWidth: getSpacingValue(props.maxWidth, props.theme, size),
    gap: getSpacingValue(props.gap, props.theme, size),
    rowGap: getSpacingValue(props.rowGap, props.theme, size),
    columnGap: getSpacingValue(props.columnGap, props.theme, size),
    top: getSpacingValue(props.top, props.theme, size),
    right: getSpacingValue(props.right, props.theme, size),
    bottom: getSpacingValue(props.bottom, props.theme, size),
    left: getSpacingValue(props.left, props.theme, size),

    // Visual props
    backgroundColor: getBackgroundValue(props.backgroundColor, props.theme, size),
    borderRadius: getBorderRadiusValue(props.borderRadius, props.theme, size),
    transform: getResponsiveValue(props.transform, size),
    lineHeight: getSpacingValue(props.lineHeight, props.theme, size),
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
