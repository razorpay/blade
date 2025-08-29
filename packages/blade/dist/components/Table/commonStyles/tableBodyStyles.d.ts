import { Theme } from '../../BladeProvider';
import { BoxProps } from '../../Box';
declare const getTableBodyStyles: ({ isVirtualized, addCommonStyles, theme, height, width, isSelectable, showStripedRows, }: {
    isVirtualized?: boolean | undefined;
    addCommonStyles?: boolean | undefined;
    theme: Theme;
    height?: BoxProps['height'];
    width?: BoxProps['width'];
    isSelectable?: boolean | undefined;
    showStripedRows?: boolean | undefined;
}) => Record<string, unknown>;
export { getTableBodyStyles };
