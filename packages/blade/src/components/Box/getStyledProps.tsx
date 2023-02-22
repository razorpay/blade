import type { StyledProps } from './BaseBox/types';

/**
 * This utility takes all your props and returns only the styled props that are to be used on components
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyledProps = (props: Record<string, any>): StyledProps => {
  return {
    alignSelf: props.alignSelf,
    justifySelf: props.justifySelf,
    order: props.order,
    position: props.position,
    zIndex: props.zIndex,
    gridColumn: props.gridColumn,
    gridRow: props.gridRow,
    gridRowStart: props.gridRowStart,
    gridRowEnd: props.gridRowEnd,
    gridArea: props.gridArea,
    margin: props.margin,
    marginX: props.marginX,
    marginY: props.marginY,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginLeft: props.marginLeft,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
  };
};

export { getStyledProps };
