import { CSSObject } from 'styled-components';
import { Theme } from '../../BladeProvider';
type StyledActionListProps = {
    id?: string;
    isInBottomSheet?: boolean;
};
declare const getBaseActionListStyles: (props: StyledActionListProps & {
    theme: Theme;
}) => CSSObject;
export type { StyledActionListProps };
export { getBaseActionListStyles };
