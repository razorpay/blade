import { default as React } from 'react';
import { CSSObject } from 'styled-components';
import { Theme } from '../BladeProvider';
declare const getPopoverContentWrapperStyles: ({ theme, styles, isMobile, }: {
    isMobile: boolean;
    theme: Theme;
    styles: React.CSSProperties;
}) => CSSObject;
export { getPopoverContentWrapperStyles };
