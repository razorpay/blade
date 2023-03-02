import React from 'react';
import BaseBox from './BaseBox';
import type { BoxProps, MakeValueResponsive } from './BaseBox/types';
import type { KeysRequired } from '~src/_helpers/types';
import { metaAttribute, MetaConstants } from '~utils';

const isValidBackgroundColorString = (stringBackgroundColorValue: string): void => {
  if (!stringBackgroundColorValue.startsWith('surface.background')) {
    throw new Error(
      `[Blade - Box]: Oops! Currently you can only use \`surface.background.*\` tokens with backgroundColor property but we received \`${stringBackgroundColorValue}\` instead.\n\n Do you have a usecase of using other values? Create an issue on https://github.com/razorpay/blade repo to let us know and we can discuss ✨`,
    );
  }
};

const validateBackgroundColor = (
  responsiveBackgroundColor: MakeValueResponsive<string | undefined>,
): void => {
  if (responsiveBackgroundColor) {
    if (typeof responsiveBackgroundColor === 'string') {
      isValidBackgroundColorString(responsiveBackgroundColor);
      return;
    }

    Object.values(responsiveBackgroundColor).forEach((backgroundColor) => {
      if (typeof responsiveBackgroundColor === 'string') {
        isValidBackgroundColorString(backgroundColor);
      }
    });
  }
};

/**
 * This function is to filter out any unexpected props passed by the user
 */
const getOnlyBoxProps = (props: BoxProps): KeysRequired<BoxProps> => {
  return {
    // Layout
    display: props.display,
    overflow: props.overflow,
    overflowX: props.overflowX,
    overflowY: props.overflowY,
    height: props.height,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,

    // Flex
    flex: props.flex,
    flexWrap: props.flexWrap,
    flexDirection: props.flexDirection,
    flexGrow: props.flexGrow,
    flexShrink: props.flexShrink,
    flexBasis: props.flexBasis,
    alignItems: props.alignItems,
    alignContent: props.alignContent,
    alignSelf: props.alignSelf,
    justifyItems: props.justifyItems,
    justifyContent: props.justifyContent,
    justifySelf: props.justifySelf,
    placeSelf: props.placeSelf,
    order: props.order,

    // Grid
    grid: props.grid,
    gridColumn: props.gridColumn,
    gridRow: props.gridRow,
    gridRowStart: props.gridRowStart,
    gridRowEnd: props.gridRowEnd,
    gridColumnStart: props.gridColumnStart,
    gridColumnEnd: props.gridColumnEnd,
    gridArea: props.gridArea,
    gridAutoFlow: props.gridAutoFlow,
    gridAutoRows: props.gridAutoRows,
    gridAutoColumns: props.gridAutoColumns,
    gridTemplate: props.gridTemplate,
    gridTemplateAreas: props.gridTemplateAreas,
    gridTemplateColumns: props.gridTemplateColumns,
    gridTemplateRows: props.gridTemplateRows,

    // Spacing
    padding: props.padding,
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingRight: props.paddingRight,
    paddingLeft: props.paddingLeft,
    paddingX: props.paddingX,
    paddingY: props.paddingY,
    margin: props.margin,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginLeft: props.marginLeft,
    marginX: props.marginX,
    marginY: props.marginY,
    gap: props.gap,
    rowGap: props.rowGap,
    columnGap: props.columnGap,

    // Position
    position: props.position,
    zIndex: props.zIndex,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,

    // Visual
    backgroundColor: props.backgroundColor,
    children: props.children,
  };
};

/**
 * ## Box
 * 
 * Box is the basic Layout component.
 *
 *
 * Box components supports most spacing CSS properties like `display`, `padding*`, `flex*`, `height`, `width`, etc.
 *
 *  Check out {@linkcode BoxProps BoxPropsType} for complete list of props and [Layout RFC](https://github.com/razorpay/blade/blob/master/rfcs/2023-01-06-layout.md) for more details on API decision.
 * 
 * ----
 * 
 * ### Usage
 * 
 * ```jsx
 * <Box display="flex">
 * ```

 * #### Responsive Props
 *
 * ```jsx
 * <Box padding={{ base: 'spacing.3', m: 'spacing.10' }} />
 * ```
 * 
 * #### Margin and Padding Shorthands
 * 
 * ```jsx
 * <Box padding={["spacing.3", "spacing.10"]} />
 * ```
 *
 * ---
 * 
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-box Box Documentation}
 * 
 */
const Box = (props: BoxProps): JSX.Element => {
  React.useEffect(() => {
    validateBackgroundColor(props.backgroundColor);
  }, [props.backgroundColor]);

  return (
    <BaseBox
      {...metaAttribute(MetaConstants.Component, MetaConstants.Box)}
      {...getOnlyBoxProps(props)}
    />
  );
};

export { Box, getOnlyBoxProps };
