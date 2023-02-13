import React from 'react';
import styled from 'styled-components';
import type { CSSObject } from 'styled-components';
import type {
  BaseBoxProps,
  MakeValueResponsive,
  PaddingProps,
  MarginProps,
  SpacingValueType,
} from './types';
import type { Breakpoints } from '~tokens/global/breakpoints';
import breakpoints from '~tokens/global/breakpoints';
import { getMediaQuery } from '~src/utils/getMediaQuery';
import { isReactNative, isEmpty, getIn, makeSpace } from '~utils';
import type { Theme } from '~components/BladeProvider';

const getValue = <T extends string | number | string[]>(
  value: MakeValueResponsive<T> | undefined,
  size?: keyof Breakpoints,
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

  return value[size ?? 'base'];
};

const getSpacingValue = (
  spacingValue: SpacingValueType | SpacingValueType[] | undefined,
  theme: Theme,
  size?: keyof Breakpoints,
): string | undefined => {
  if (!spacingValue) {
    return undefined;
  }

  const responsiveSpacingValue: SpacingValueType | SpacingValueType[] = getValue(
    spacingValue,
    size,
  );

  if (responsiveSpacingValue === 'auto') {
    return responsiveSpacingValue;
  }

  if (Array.isArray(responsiveSpacingValue)) {
    return responsiveSpacingValue.map((value) => getSpacingValue(value, theme)).join(' ');
  }

  if (responsiveSpacingValue.startsWith('spacing.')) {
    const spacingReturnValue = getIn(theme, responsiveSpacingValue);
    return spacingReturnValue ? makeSpace(spacingReturnValue) : undefined;
  }

  // pixel or with unit values
  return responsiveSpacingValue;
};

// const getSpacingCSSProps = (
//   spacingProps: Partial<PaddingProps & MarginProps>,
//   theme: Theme,
// ): Required<
//   Pick<
//     CSSObject,
//     | 'padding'
//     | 'paddingTop'
//     | 'paddingBottom'
//     | 'paddingLeft'
//     | 'paddingRight'
//     | 'margin'
//     | 'marginTop'
//     | 'marginBottom'
//     | 'marginLeft'
//     | 'marginRight'
//   >
// > => {
//   const spacingReturnValue: CSSObject = {};
//   if (spacingProps.padding) {
//     if (Array.isArray(spacingProps.padding)) {
//       spacingReturnValue.padding = spacingProps.padding
//         .map((paddingValue) => getIn(theme, paddingValue))
//         .join(' ');
//     } else {
//       spacingReturnValue.padding = getIn(theme, spacingProps.padding);
//     }
//   }
//   return {};
// };

type AllBaseBoxPropsCSSKeys = keyof Omit<
  BaseBoxProps,
  'className' | 'id' | 'children' | 'paddingX' | 'paddingY' | 'marginX' | 'marginY'
>;

const getAllProps = (
  props: BaseBoxProps & { theme: Theme },
  size?: keyof Breakpoints,
  // Ideally return type is `CSSObject`. But I am keeping the keys of object requrired as BasBoxProps keys so we don't miss out on any key
): Required<Pick<CSSObject, AllBaseBoxPropsCSSKeys>> => {
  return {
    display: getValue(props.display, size),
    overflow: getValue(props.overflow, size),

    // Flex
    flex: getValue(props.flex, size),
    flexWrap: getValue(props.flexWrap, size),
    flexDirection: getValue(props.flexDirection, size),
    flexGrow: getValue(props.flexGrow, size),
    flexShrink: getValue(props.flexShrink, size),
    flexBasis: getValue(props.flexBasis, size),
    alignItems: getValue(props.alignItems, size),
    alignContent: getValue(props.alignContent, size),
    alignSelf: getValue(props.alignSelf, size),
    justifyItems: getValue(props.justifyItems, size),
    justifyContent: getValue(props.justifyContent, size),
    justifySelf: getValue(props.justifySelf, size),
    order: getValue(props.order, size),
    position: getValue(props.position, size),
    zIndex: getValue(props.zIndex, size),
    // Grid
    grid: getValue(props.grid, size),
    gridColumn: getValue(props.gridColumn, size),
    gridRow: getValue(props.gridRow, size),
    gridRowStart: getValue(props.gridRowStart, size),
    gridRowEnd: getValue(props.gridRowEnd, size),
    gridArea: getValue(props.gridArea, size),
    gridAutoFlow: getValue(props.gridAutoFlow, size),
    gridAutoRows: getValue(props.gridAutoRows, size),
    gridAutoColumns: getValue(props.gridAutoColumns, size),
    gridTemplate: getValue(props.gridTemplate, size),
    gridTemplateAreas: getValue(props.gridTemplateAreas, size),
    gridTemplateColumns: getValue(props.gridTemplateColumns, size),
    gridTemplateRows: getValue(props.gridTemplateRows, size),

    // Visual props
    backgroundColor: getValue(props.backgroundColor, size),
    borderRadius: getValue(props.borderRadius, size),
    background: getValue(props.background, size),
    transform: getValue(props.transform, size),
    padding: getSpacingValue(props.padding, props.theme),
    // ...getSpacingCSSProps(
    //   {
    //     padding: props.padding,
    //     paddingX: props.paddingX,
    //     paddingY: props.paddingY,
    //     paddingTop: props.paddingTop,
    //     paddingBottom: props.paddingBottom,
    //     paddingLeft: props.paddingLeft,
    //     paddingRight: props.paddingRight,
    //   },
    //   props.theme,
    // ),
    // ...getSpacingCSSProps(
    //   {
    //     margin: props.margin,
    //     marginX: props.marginX,
    //     marginY: props.marginY,
    //     marginTop: props.marginTop,
    //     marginBottom: props.marginBottom,
    //     marginLeft: props.marginLeft,
    //     marginRight: props.marginRight,
    //   },
    //   props.theme,
    // ),
    height: getValue(props.height, size),
    minHeight: getValue(props.minHeight, size),
    maxHeight: getValue(props.maxHeight, size),
    width: getValue(props.width, size),
    minWidth: getValue(props.minWidth, size),
    maxWidth: getValue(props.maxWidth, size),
    gap: getValue(props.gap, size),
    rowGap: getValue(props.rowGap, size),
    columnGap: getValue(props.columnGap, size),
    top: getValue(props.top, size),
    right: getValue(props.right, size),
    bottom: getValue(props.bottom, size),
    left: getValue(props.left, size),
  };
};

const getAllMediaQueries = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  return Object.fromEntries(
    Object.entries(breakpoints).map(([breakpointKey, breakpointValue]) => {
      const mediaQuery = `@media ${getMediaQuery(breakpointValue)}`;
      return [
        mediaQuery,
        {
          ...getAllProps(props, breakpointKey as keyof Breakpoints),
        },
      ];
    }),
  );
};

const getCSSObject = (props: BaseBoxProps & { theme: Theme }): CSSObject => {
  console.count('getCSSObject');
  return {
    ...getAllProps(props),
    ...getAllMediaQueries(props),
  };
};

const BaseBox = styled.div<BaseBoxProps>(
  (props): CSSObject => {
    const { theme, ...rest } = props;
    let propsDependencyString: string | BaseBoxProps = '';
    try {
      propsDependencyString = JSON.stringify(rest);
    } catch (err: unknown) {
      console.warn(
        '[BaseBox]: stringification of props failed in BaseBox so falling back to re-calculations on all changes\n\n If you see this warning, please create issue on https://github.com/razorpay/blade as this could degrade runtime styling performance',
        err,
      );

      propsDependencyString = rest;
    }

    // Since we know there won't be deeply nested props in our BoxProps, stringifying props is a lot faster and easy to maintain
    // (Alternative is to pass each and every prop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cssObject = React.useMemo(() => getCSSObject(props), [propsDependencyString]);
    return cssObject;
  },
);

export { BaseBox };
