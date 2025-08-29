import { CollapsibleProps } from './Collapsible';
import { CollapsibleBodyProps } from './types';
import { Theme } from '../BladeProvider';
import { BoxProps } from '../Box';
declare const getCollapsibleBodyContentBoxProps: ({ direction, _hasMargin, }: {
    direction: CollapsibleProps['direction'];
    _hasMargin: CollapsibleBodyProps['_hasMargin'];
}) => BoxProps;
declare const getOpacity: ({ isExpanded }: {
    isExpanded: boolean;
}) => number;
declare const getTransitionDuration: (theme: Theme) => import('../../utils/makeMotionTime/types').MakeMotionTime<280>;
declare const getTransitionEasing: (theme: Theme) => import('../../tokens/global/motion').EasingType<"cubic-bezier(0.3, 0, 0.2, 1)">;
declare const getCollapsibleChevronIconTransforms: () => {
    transformExpanded: number;
    transformCollapsed: number;
};
export { getCollapsibleBodyContentBoxProps, getOpacity, getTransitionDuration, getTransitionEasing, getCollapsibleChevronIconTransforms, };
