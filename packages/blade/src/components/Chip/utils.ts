// ref - /blade/packages/blade/src/components/Box/styledProps/getStyledProps.ts
// since here the use case is too specific that's why makeLayout Prop is inside Chip.

import type { ChipGroupContainerLayoutProps } from './types';
import { removeUndefinedStyledProps } from '~components/Box/styledProps';
import type { KeysRequired } from '~utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyledPropsInputType = Record<string, any>;

const makeStyledProps = (
  props: StyledPropsInputType,
): KeysRequired<ChipGroupContainerLayoutProps> => {
  return {
    display: props.display,
    gridColumn: props.gridColumn,
    gridRow: props.gridRow,
    gridArea: props.gridArea,
    alignSelf: props.alignSelf,
    justifySelf: props.justifySelf,
    placeSelf: props.placeSelf,
    order: props.order,
    gridColumnStart: props.gridColumnStart,
    gridColumnEnd: props.gridColumnEnd,
    alignContent: props.alignContent,
    alignItems: props.alignItems,
    columnGap: props.columnGap,
    gap: props.gap,
    gridAutoColumns: props.gridAutoColumns,
    gridAutoFlow: props.gridAutoFlow,
    gridAutoRows: props.gridAutoRows,
    gridTemplateAreas: props.gridTemplateAreas,
    grid: props.grid,
    gridTemplate: props.gridTemplate,
    gridTemplateColumns: props.gridTemplateColumns,
    gridTemplateRows: props.gridTemplateRows,
    justifyContent: props.justifyContent,
    justifyItems: props.justifyItems,
    rowGap: props.rowGap,
    flexBasis: props.flexBasis,
    flexDirection: props.flexDirection,
    flexGrow: props.flexGrow,
    flexShrink: props.flexShrink,
    flexWrap: props.flexWrap,
    flex: props.flex,
    placeItems: props.placeItems,
    gridRowEnd: props.gridRowEnd,
    gridRowStart: props.gridRowStart,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLayOutProps = (props: Record<string, any>): ChipGroupContainerLayoutProps => {
  return removeUndefinedStyledProps(makeStyledProps(props));
};

export { getLayOutProps };
