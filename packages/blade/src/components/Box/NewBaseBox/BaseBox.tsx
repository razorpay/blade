import React from 'react';
import styled from 'styled-components';
import type { CSSObject } from 'styled-components';
import type { BaseBoxProps, MakeValueResponsive } from './types';
import type { Breakpoints } from '~tokens/global/breakpoints';
import breakpoints from '~tokens/global/breakpoints';
import { getMediaQuery } from '~src/utils/getMediaQuery';
import { isReactNative, isEmpty } from '~utils';

const getValue = <T extends string | number>(
  value: MakeValueResponsive<T> | undefined,
  size?: keyof Breakpoints,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (isEmpty(value)) {
    return undefined;
  }

  if (isReactNative()) {
    // In React Native, we map the value `m` token on priority (since it maps to mobiles in desktop).
    // We further look into smaller sizes, then we check base size, then we check large and extra large sizes.
    // Then we return the first non-undefined value in this priority
    const priorityArray = [value.m, value.s, value.xs, value.base, value.l, value.xl, value.max];
    return priorityArray.find((val) => val !== undefined);
  }

  return value[size ?? 'base'];
};

type AllBaseBoxPropsCSSKeys = keyof Omit<
  BaseBoxProps,
  'className' | 'id' | 'children' | 'paddingX' | 'paddingY' | 'marginX' | 'marginY'
>;

const getAllProps = (
  props: BaseBoxProps,
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

    // Spacing props
    padding: 2,
    // paddingX: getValue(props.paddingX, size),
    // paddingY: getValue(props.paddingY, size),
    paddingTop: getValue(props.paddingTop, size),
    paddingRight: getValue(props.paddingRight, size),
    paddingBottom: getValue(props.paddingBottom, size),
    paddingLeft: getValue(props.paddingLeft, size),
    margin: 2,
    // marginX: getValue(props.marginX, size),
    // marginY: getValue(props.marginY, size),
    marginTop: getValue(props.marginTop, size),
    marginRight: getValue(props.marginRight, size),
    marginBottom: getValue(props.marginBottom, size),
    marginLeft: getValue(props.marginLeft, size),
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

const getAllMediaQueries = (props: BaseBoxProps): CSSObject => {
  return Object.fromEntries(
    Object.entries(breakpoints).map((_val, index, breakpointsArray) => {
      const mediaQuery = `@media ${getMediaQuery(
        breakpointsArray as [keyof Breakpoints, number][],
        index,
      )}`;
      return [
        mediaQuery,
        {
          ...getAllProps(props, breakpointsArray[index][0] as keyof Breakpoints),
        },
      ];
    }),
  );
};

const getCSSObject = (props: BaseBoxProps): CSSObject => {
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
