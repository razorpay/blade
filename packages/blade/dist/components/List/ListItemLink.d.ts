import { LinkProps } from '../Link';
type ListItemLinkProps = Exclude<LinkProps, 'size' | 'variant' | 'isDisabled'>;
declare const ListItemLink: ({ accessibilityLabel, children, href, icon, iconPosition, onClick, rel, target, testID, }: ListItemLinkProps) => React.ReactElement;
export type { ListItemLinkProps };
export { ListItemLink };
