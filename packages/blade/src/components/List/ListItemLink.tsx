import type { LinkProps } from '../Link';
import { Link } from '../Link';
import { useListContext } from './ListContext';

type ListItemLinkProps = Exclude<LinkProps, 'size' | 'variant' | 'isDisabled'>;

const ListItemLink = ({
  accessibilityLabel,
  children,
  href,
  icon,
  iconPosition,
  onClick,
  rel,
  target,
}: ListItemLinkProps): React.ReactElement => {
  const { size } = useListContext();

  return (
    <Link
      size={size}
      variant="anchor"
      {...(icon ? { icon, children } : { children })}
      href={href}
      target={target}
      rel={rel}
      iconPosition={iconPosition}
      onClick={onClick}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export { ListItemLink, ListItemLinkProps };
