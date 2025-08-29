import { CSSObject } from 'styled-components';
import { BaseBoxProps, MakeValueResponsive, SpacingValueType, ArrayOfMaxLength4 } from './types';
import { Breakpoints } from '../../../tokens/global';
import { Theme } from '../../BladeProvider';
declare const getSpacingValue: (spacingValue: MakeValueResponsive<SpacingValueType | ArrayOfMaxLength4<SpacingValueType>> | undefined, theme: Theme, breakpoint?: keyof Breakpoints) => string | undefined;
declare const getColorValue: (color: BaseBoxProps['backgroundColor'] | BaseBoxProps['borderColor'], theme: Theme, breakpoint?: keyof Breakpoints) => string;
declare const getBorderRadiusValue: (borderRadius: BaseBoxProps['borderRadius'], theme: Theme, breakpoint?: keyof Breakpoints) => string | undefined;
export declare const getElevationValue: (elevation: BaseBoxProps['elevation'], theme: Theme, breakpoint?: keyof Breakpoints) => string | undefined;
declare const getAllProps: (props: BaseBoxProps & {
    theme: Theme;
}, breakpoint?: keyof Breakpoints) => CSSObject;
/** We only add breakpoint if at least one of the value is defined */
declare const shouldAddBreakpoint: (cssProps: CSSObject) => boolean;
declare const getAllMediaQueries: (props: BaseBoxProps & {
    theme: Theme;
}) => CSSObject;
declare const getBaseBoxStyles: (props: BaseBoxProps & {
    theme: Theme;
}) => CSSObject;
export { getBaseBoxStyles, getSpacingValue, getColorValue, getBorderRadiusValue, shouldAddBreakpoint, getAllMediaQueries, getAllProps, };
