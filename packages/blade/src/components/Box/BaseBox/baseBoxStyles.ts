/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CSSObject } from 'styled-components';
import type {
  BaseBoxProps,
  MakeValueResponsive,
  SpacingValueType,
  ArrayOfMaxLength4,
} from './types';
import { getResponsiveValue } from './getResponsiveValue';
import getIn from '~utils/lodashButBetter/get';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import type { Breakpoints } from '~tokens/global';
import { breakpoints } from '~tokens/global';
import { isReactNative, getMediaQuery } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { makeSpace } from '~utils/makeSpace';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { DotNotationSpacingStringToken } from '~utils/types';

const isSpacingToken = (value: string): value is DotNotationSpacingStringToken => {
  return typeof value === 'string' && value.startsWith('spacing.');
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

  const responsiveSpacingValue = getResponsiveValue(
    spacingValue as MakeValueResponsive<SpacingValueType | SpacingValueType[]>,
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

  if (isSpacingToken(responsiveSpacingValue)) {
    const spacingReturnValue = getIn(theme, responsiveSpacingValue);
    return isEmpty(spacingReturnValue) ? makeSpace(spacingReturnValue!) : undefined;
  }

  // pixel or with unit values
  return responsiveSpacingValue;
};

const getColorValue = (
  color: BaseBoxProps['backgroundColor'] | BaseBoxProps['borderColor'],
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string => {
  const responsiveBackgroundValue = getResponsiveValue(color, breakpoint);
  // @ts-expect-error: We always return any from getResponsiveValue so value can't be inferred here
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
    : // @ts-ignore: intentionally set to any since figuring out types of responsive props is complex
      makeBorderSize(getIn(theme, `border.radius.${responsiveBorderRadiusValue}`));
};

const getBorderWidthValue = (
  borderWidth: BaseBoxProps['borderWidth'],
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string | undefined => {
  const responsiveBorderWidthValue = getResponsiveValue(borderWidth, breakpoint);
  return isEmpty(responsiveBorderWidthValue)
    ? undefined
    : // @ts-ignore: intentionally set to any since figuring out types of responsive props is complex
      makeBorderSize(getIn(theme, `border.width.${responsiveBorderWidthValue}`));
};

export const getElevationValue = (
  elevation: BaseBoxProps['elevation'],
  theme: Theme,
  breakpoint?: keyof Breakpoints,
): string | undefined => {
  const responsiveElevationValue = getResponsiveValue(elevation, breakpoint);
  return isEmpty(responsiveElevationValue)
    ? undefined
    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      // @ts-ignore: intentionally set to any since figuring out types of responsive props is complex
      getIn(theme, `elevation.${responsiveElevationValue!}`);
};

type GetBorderStyleValueReturnType =
  | CSSObject['borderStyle']
  | CSSObject['borderTopStyle']
  | CSSObject['borderBottomStyle']
  | CSSObject['borderLeftStyle']
  | CSSObject['borderRightStyle'];
const getBorderStyleValue = (
  borderStyle: BaseBoxProps['borderStyle'],
  breakpoint?: keyof Breakpoints,
  hasBorder?: boolean,
  // Using any as return type because borderStyle's type is incompatible with borderBottomStyle. There are ways to fix it but anyway since its internal function. Taking an easy way out
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): GetBorderStyleValueReturnType => {
  if (borderStyle) {
    return getResponsiveValue(borderStyle, breakpoint);
  }

  if (hasBorder) {
    return 'solid';
  }

  return undefined;
};

const getAllProps = (
  props: BaseBoxProps & { theme: Theme },
  breakpoint?: keyof Breakpoints,
): CSSObject => {
  const hasBorder = props.borderWidth || props.borderColor;
  const hasBorderRight = props.borderRight || props.borderRightColor || props.borderRightWidth;
  const hasBorderLeft = props.borderLeft || props.borderLeftColor || props.borderLeftWidth;
  const hasBorderTop = props.borderTop || props.borderTopColor || props.borderTopWidth;
  const hasBorderBottom = props.borderBottom || props.borderBottomColor || props.borderBottomWidth;

  return {
    display: getResponsiveValue(props.display, breakpoint),
    overflow: getResponsiveValue(props.overflow, breakpoint),
    overflowX: getResponsiveValue(props.overflowX, breakpoint),
    overflowY: getResponsiveValue(props.overflowY, breakpoint),
    textAlign: getResponsiveValue(props.textAlign, breakpoint),
    whiteSpace: getResponsiveValue(props.whiteSpace, breakpoint),

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
    placeSelf: getResponsiveValue(props.placeSelf, breakpoint),
    placeItems: getResponsiveValue(props.placeItems, breakpoint),
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
    backgroundColor: getColorValue(props.backgroundColor, props.theme, breakpoint),
    backgroundImage: getResponsiveValue(props.backgroundImage, breakpoint),
    backgroundSize: getResponsiveValue(props.backgroundSize, breakpoint),
    backgroundPosition: getResponsiveValue(props.backgroundPosition, breakpoint),
    backgroundOrigin: getResponsiveValue(props.backgroundOrigin, breakpoint),
    backgroundRepeat: getResponsiveValue(props.backgroundRepeat, breakpoint),
    borderRadius: getBorderRadiusValue(props.borderRadius, props.theme, breakpoint),
    lineHeight: getSpacingValue(props.lineHeight, props.theme, breakpoint),
    border: getResponsiveValue(props.border, breakpoint),
    borderTop: getResponsiveValue(props.borderTop, breakpoint),
    borderRight: getResponsiveValue(props.borderRight, breakpoint),
    borderBottom: getResponsiveValue(props.borderBottom, breakpoint),
    borderLeft: getResponsiveValue(props.borderLeft, breakpoint),
    borderWidth: getBorderWidthValue(props.borderWidth, props.theme, breakpoint),
    borderColor: getColorValue(props.borderColor, props.theme, breakpoint),
    borderTopWidth: getBorderWidthValue(props.borderTopWidth, props.theme, breakpoint),
    borderTopColor: getColorValue(props.borderTopColor, props.theme, breakpoint),
    borderRightWidth: getBorderWidthValue(props.borderRightWidth, props.theme, breakpoint),
    borderRightColor: getColorValue(props.borderRightColor, props.theme, breakpoint),
    borderBottomWidth: getBorderWidthValue(props.borderBottomWidth, props.theme, breakpoint),
    borderBottomColor: getColorValue(props.borderBottomColor, props.theme, breakpoint),
    borderLeftWidth: getBorderWidthValue(props.borderLeftWidth, props.theme, breakpoint),
    borderLeftColor: getColorValue(props.borderLeftColor, props.theme, breakpoint),
    borderTopLeftRadius: getBorderRadiusValue(props.borderTopLeftRadius, props.theme, breakpoint),
    borderTopRightRadius: getBorderRadiusValue(props.borderTopRightRadius, props.theme, breakpoint),
    borderBottomRightRadius: getBorderRadiusValue(
      props.borderBottomRightRadius,
      props.theme,
      breakpoint,
    ),
    borderBottomLeftRadius: getBorderRadiusValue(
      props.borderBottomLeftRadius,
      props.theme,
      breakpoint,
    ),
    borderStyle: getBorderStyleValue(
      props.borderStyle,
      breakpoint,
      Boolean(hasBorder),
    ) as CSSObject['borderStyle'],
    cursor: getResponsiveValue(props.cursor, breakpoint),
    // Since we only allow 'solid', we can use the same value for all borders if hasBorder is true
    // If hasBorder is false, we need to check each border individually
    ...(!hasBorder && {
      borderTopStyle: getBorderStyleValue(
        props.borderTopStyle,
        breakpoint,
        Boolean(hasBorderTop),
      ) as CSSObject['borderTopStyle'],
      borderBottomStyle: getBorderStyleValue(
        props.borderBottomStyle,
        breakpoint,
        Boolean(hasBorderBottom),
      ) as CSSObject['borderBottomStyle'],
      borderLeftStyle: getBorderStyleValue(
        props.borderLeftStyle,
        breakpoint,
        Boolean(hasBorderLeft),
      ) as CSSObject['borderLeftStyle'],
      borderRightStyle: getBorderStyleValue(
        props.borderRightStyle,
        breakpoint,
        Boolean(hasBorderRight),
      ) as CSSObject['borderRightStyle'],
    }),
    touchAction: getResponsiveValue(props.touchAction, breakpoint),
    userSelect: getResponsiveValue(props.userSelect, breakpoint),
    pointerEvents: getResponsiveValue(props.pointerEvents),
    opacity: getResponsiveValue(props.opacity, breakpoint),
    visibility: getResponsiveValue(props.visibility, breakpoint),
    ...(!isReactNative() && {
      boxShadow: getElevationValue(props.elevation, props.theme, breakpoint),
    }),

    // Polygon support
    transform: getResponsiveValue(props.transform as string, breakpoint),
    transformOrigin: getResponsiveValue(props.transformOrigin, breakpoint),
    clipPath: getResponsiveValue(props.clipPath, breakpoint),
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
  getSpacingValue,
  getColorValue,
  getBorderRadiusValue,
  shouldAddBreakpoint,
  getAllMediaQueries,
  getAllProps,
};
