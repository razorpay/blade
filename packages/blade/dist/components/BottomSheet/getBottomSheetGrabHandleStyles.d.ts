import { CSSObject } from 'styled-components';
import { Theme } from '../BladeProvider';
declare const getHandlePartStyles: ({ theme }: {
    theme: Theme;
}) => CSSObject;
declare const getBottomSheetGrabHandleStyles: ({ theme, isHeaderFloating, }: {
    theme: Theme;
    isHeaderFloating?: boolean | undefined;
}) => CSSObject;
export { getBottomSheetGrabHandleStyles, getHandlePartStyles };
