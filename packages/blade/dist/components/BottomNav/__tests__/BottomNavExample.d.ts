import { BottomNavProps } from '../index';
declare const BottomNavExample: ({ initialEntries, moreClick, ...args }: Omit<BottomNavProps, "children"> & {
    initialEntries?: string[] | undefined;
    moreClick?: (() => void) | undefined;
}) => React.ReactElement;
export { BottomNavExample };
