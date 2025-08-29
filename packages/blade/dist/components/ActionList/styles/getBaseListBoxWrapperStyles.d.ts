import { CSSObject } from 'styled-components';
import { Theme } from '../../BladeProvider';
declare const actionListMaxHeight: 300;
declare const getActionListPadding: (theme: Theme) => number;
declare const getBaseListBoxWrapperStyles: (props: {
    theme: Theme;
    isInBottomSheet: boolean;
}) => CSSObject;
export { getBaseListBoxWrapperStyles, actionListMaxHeight, getActionListPadding };
