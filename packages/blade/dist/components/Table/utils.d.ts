import { Theme } from '../BladeProvider';
import { DotNotationToken } from '../../utils/lodashButBetter/get';
declare const getTableRowBackgroundTransition: (theme: Theme) => string;
declare const getTableActionsHoverStyles: ({ hoverColor, theme, backgroundGradientColor, }: {
    hoverColor: DotNotationToken<Theme['colors']>;
    backgroundGradientColor?: DotNotationToken<Omit<import('../../tokens/theme/theme').Colors, "name">, Omit<Omit<import('../../tokens/theme/theme').Colors, "name">, "name">> | undefined;
    theme: Theme;
}) => React.CSSProperties;
export { getTableActionsHoverStyles, getTableRowBackgroundTransition };
