import { ReactElement } from 'react';
import { TextProps, TextVariant } from '../Typography';
type ListItemTextProps = Omit<TextProps<{
    variant: TextVariant;
}>, 'variant' | 'size'>;
declare const ListItemText: ({ children, testID, ...props }: ListItemTextProps) => ReactElement;
export type { ListItemTextProps };
export { ListItemText };
