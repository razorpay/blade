import { CodeProps } from '../Typography';
type ListItemCodeProps = Exclude<CodeProps, 'size'>;
declare const ListItemCode: ({ children, testID }: ListItemCodeProps) => React.ReactElement;
export type { ListItemCodeProps };
export { ListItemCode };
