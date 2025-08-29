import { CSSObject } from 'styled-components';
import { BaseBoxProps } from './types';
import { Theme } from '../../BladeProvider';
import { ColorSchemeNames } from '../../../tokens/theme';
declare const getMemoDependency: (props: BaseBoxProps & {
    theme?: Theme;
} & {
    colorScheme: ColorSchemeNames;
}) => string | BaseBoxProps;
/**
 * Uses `React.useMemo` to watch over changing dependencies and only calculate `getBaseBoxStyles` when needed.
 *
 * This helps us in not doing the CSS calculations on screen size change or randomly when not required
 *
 * Without memo, the Box style recalculations will run on things like screen size change or randomly during scroll.
 * With memo, it only runs once for each box and then runs when any of the prop changes
 *
 * Checkout: https://github.com/razorpay/blade/pull/1009#discussion_r1113767442 for benchmarks
 */
declare const useMemoizedStyles: (boxProps: BaseBoxProps & {
    theme: Theme;
}) => CSSObject;
export { useMemoizedStyles, getMemoDependency };
