import React from 'react';
import BaseBox from './BaseBox';
import type { BoxProps, BoxRefType, MakeValueResponsive } from './BaseBox/types';
import { validBoxAsValues } from './BaseBox/types/propsTypes';
import type { KeysRequired } from '~utils/types';
import { isReactNative } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const validateBackgroundString = (stringBackgroundColorValue: string): void => {
  if (__DEV__) {
    if (
      !stringBackgroundColorValue.startsWith('surface.background') &&
      !stringBackgroundColorValue.startsWith('brand.') &&
      !stringBackgroundColorValue.startsWith('overlay.') &&
      stringBackgroundColorValue !== 'transparent'
    ) {
      throwBladeError({
        message: `Oops! Currently you can only use \`transparent\`, \`surface.background.*\`, \`overlay.*\` and \`brand.*\` tokens with backgroundColor property but we received \`${stringBackgroundColorValue}\` instead.\n\n Do you have a usecase of using other values? Create an issue on https://github.com/razorpay/blade repo to let us know and we can discuss ✨`,
        moduleName: 'Box',
      });
    }
  }
};

const validateBackgroundProp = (
  responsiveBackgroundColor: MakeValueResponsive<string | undefined>,
): void => {
  if (__DEV__) {
    if (responsiveBackgroundColor) {
      if (typeof responsiveBackgroundColor === 'string') {
        validateBackgroundString(responsiveBackgroundColor);
        return;
      }

      Object.values(responsiveBackgroundColor).forEach((backgroundColor) => {
        if (typeof backgroundColor === 'string') {
          validateBackgroundString(backgroundColor);
        }
      });
    }
  }
};

/**
 * This function is to filter out any unexpected props passed by the user
 */
const makeBoxProps = (
  props: BoxProps,
): KeysRequired<Omit<BoxProps, 'testID' | 'id' | '__brand__'>> => {
  return {
    // Layout
    display: props.display,
    overflow: props.overflow,
    overflowX: props.overflowX,
    overflowY: props.overflowY,
    whiteSpace: props.whiteSpace,
    height: props.height,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    textAlign: props.textAlign,

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
    placeItems: props.placeItems,
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
    backgroundImage: props.backgroundImage,
    backgroundSize: props.backgroundSize,
    backgroundPosition: props.backgroundPosition,
    backgroundOrigin: props.backgroundOrigin,
    backgroundRepeat: props.backgroundRepeat,
    elevation: props.elevation,
    opacity: props.opacity,
    visibility: props.visibility,

    // Border
    borderWidth: props.borderWidth,
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    borderTopWidth: props.borderTopWidth,
    borderTopColor: props.borderTopColor,
    borderTopStyle: props.borderTopStyle,
    borderRightWidth: props.borderRightWidth,
    borderRightColor: props.borderRightColor,
    borderRightStyle: props.borderRightStyle,
    borderBottomWidth: props.borderBottomWidth,
    borderBottomColor: props.borderBottomColor,
    borderBottomStyle: props.borderBottomStyle,
    borderLeftWidth: props.borderLeftWidth,
    borderLeftColor: props.borderLeftColor,
    borderLeftStyle: props.borderLeftStyle,
    borderRadius: props.borderRadius,
    borderTopLeftRadius: props.borderTopLeftRadius,
    borderTopRightRadius: props.borderTopRightRadius,
    borderBottomRightRadius: props.borderBottomRightRadius,
    borderBottomLeftRadius: props.borderBottomLeftRadius,

    // Polygon Support
    transform: props.transform,
    transformOrigin: props.transformOrigin,
    clipPath: props.clipPath,

    // callbacks
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onMouseOver: props.onMouseOver,
    onScroll: props.onScroll,

    // Drag and Drop
    draggable: props.draggable,
    onDragStart: props.onDragStart,
    onDragEnd: props.onDragEnd,
    onDragEnter: props.onDragEnter,
    onDragLeave: props.onDragLeave,
    onDragOver: props.onDragOver,
    onDrop: props.onDrop,

    pointerEvents: props.pointerEvents,
    children: props.children,
    tabIndex: props.tabIndex,
    as: isReactNative() ? undefined : props.as, // as is not supported on react-native
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
const _Box: React.ForwardRefRenderFunction<BoxRefType, BoxProps> = (props, ref) => {
  React.useEffect(() => {
    if (__DEV__) {
      validateBackgroundProp(props.backgroundColor);
    }
  }, [props.backgroundColor]);

  React.useEffect(() => {
    if (__DEV__) {
      if (props.as) {
        if (isReactNative()) {
          throwBladeError({
            message: '`as` prop is not supported on React Native',
            moduleName: 'Box',
          });
        }

        if (!validBoxAsValues.includes(props.as)) {
          throwBladeError({
            message: `Invalid \`as\` prop value - ${props.as}. Only ${validBoxAsValues.join(
              ', ',
            )} are valid values`,
            moduleName: 'Box',
          });
        }
      }
    }
  }, [props.as]);

  return (
    <BaseBox
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={props.id}
      {...metaAttribute({ name: MetaConstants.Box, testID: props.testID })}
      {...makeBoxProps(props)}
      {...makeAnalyticsAttribute(props)}
    />
  );
};

const Box = assignWithoutSideEffects(React.forwardRef(_Box), {
  displayName: 'Box',
  componentId: 'Box',
});

export { Box, makeBoxProps };
