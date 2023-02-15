import type { StyleProps } from './BaseBox/types';

/**
 * StylePropsBox is a container that we wrap all our components with to give them styled properties
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyleProps = (props: Record<string, any>): StyleProps => {
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

export { getStyleProps };
