import { default as React } from 'react';
import { CSSObject } from 'styled-components';
import { Theme } from '../BladeProvider';
declare const getTooltipContentWrapperStyles: ({ theme, styles, }: {
    theme: Theme;
    styles: React.CSSProperties;
}) => CSSObject;
export { getTooltipContentWrapperStyles };
