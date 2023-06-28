import type { LinkProps } from '../Link';
import { Link } from '../Link';
import { useListContext } from './ListContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ListItemLinkProps = Exclude<LinkProps, 'size' | 'variant' | 'isDisabled'>;

const _ListItemLink = ({
  accessibilityLabel,
  children,
  href,
  icon,
  iconPosition,
  onClick,
  rel,
  target,
  testID,
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
      testID={testID}
    />
  );
};

const ListItemLink = assignWithoutSideEffects(_ListItemLink, { componentId: 'ListItemLink' });

export { ListItemLink, ListItemLinkProps };
