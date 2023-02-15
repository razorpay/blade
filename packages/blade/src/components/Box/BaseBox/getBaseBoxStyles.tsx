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
    return value;
  }

  if (isEmpty(value)) {
    return undefined;
  }

  if (isReactNative()) {
    // In React Native, we map the value `m` token on priority (since it maps to mobiles in desktop).
    // We further look into smaller sizes, then we check base size, then we check large and extra large sizes.
    // Then we return the first non-undefined value in this priority
    const priorityArray = [value.m, value.s, value.xs, value.base, value.l, value.xl];
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
  if (!spacingValue) {
    return undefined;
  }

  const responsiveSpacingValue: SpacingValueType | SpacingValueType[] = getResponsiveValue(
    spacingValue as SpacingValueType[] | SpacingValueType,
    size,
  );

  if (!responsiveSpacingValue) {
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
    return spacingReturnValue ? makeSpace(spacingReturnValue) : undefined;
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
  if (responsiveBackgroundValue?.includes('.')) {
    const val = getIn(theme, `colors.${responsiveBackgroundValue}`);
    console.log({ val });
    return val;
  }

  return responsiveBackgroundValue;
};

const getAllProps = (
  props: BaseBoxProps & { theme: Theme },
  size?: keyof Breakpoints,
  // Ideally return type is `CSSObject`. But I am keeping the keys of object requrired as BasBoxProps keys so we don't miss out on any key
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
    borderRadius: props.borderRadius
      ? makeSize(
          getIn(props.theme, `border.radius.${getResponsiveValue(props.borderRadius, size)}`),
        )
      : undefined,
    transform: getResponsiveValue(props.transform, size),
  };
};

const getAllMediaQueries = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  if (isReactNative()) {
    return {};
  }

  const { base, ...breakpointsWithoutBase } = breakpoints;

  return Object.fromEntries(
    Object.entries(breakpointsWithoutBase).map(([breakpointKey, breakpointValue]) => {
      const mediaQuery = `@media ${getMediaQuery({ min: breakpointValue })}`;
      return [
        mediaQuery,
        {
          ...getAllProps(props, breakpointKey as keyof Breakpoints),
        },
      ];
    }),
  );
};

const getBaseBoxStyles = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  return {
    ...getAllProps(props),
    ...getAllMediaQueries(props),
  };
};

const getDependencyProps = (props: BaseBoxProps & { theme: Theme }): string | BaseBoxProps => {
  // These are the props that change nothing in the getBaseBoxStyles calculations
  const { theme, children, className, id, ...rest } = props;
  let dependencyPropString: string | BaseBoxProps = '';
  try {
    dependencyPropString = JSON.stringify(rest);
  } catch (err: unknown) {
    console.warn(
      '[BaseBox]: stringification of props failed in BaseBox so falling back to re-calculations on all changes\n\n If you see this warning, please create issue on https://github.com/razorpay/blade as this could degrade runtime styling performance',
      err,
    );

    dependencyPropString = rest;
  }

  return dependencyPropString;
};

export { getDependencyProps, getBaseBoxStyles, getResponsiveValue, getSpacingValue };
