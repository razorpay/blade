import type { BreadcrumbItemProps, BreadcrumbProps } from './types';
import { BaseLink } from '~components/Link/BaseLink';
import { Text } from '~components/Typography';

const BreadcrumbItem = ({
  _size,
  _color,
  children,
  href,
  icon,
  isCurrentPage,
  onClick,
  accessibilityLabel,
}: BreadcrumbItemProps & {
  _size?: BreadcrumbProps['size'];
  _color?: BreadcrumbProps['color'];
}): React.ReactElement => {
  if (isCurrentPage) {
    return (
      <Text
        weight="medium"
        size={_size}
        color={_color === 'white' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}
      >
        {children}
      </Text>
    );
  }

  return (
    <BaseLink
      size={_size}
      color={_color}
      opacity={_color !== 'primary' ? 0.5 : 1}
      icon={icon}
      href={href}
      onClick={onClick}
      accessibilityProps={{ label: accessibilityLabel }}
    >
      {children ?? ''}
    </BaseLink>
  );
};

export { BreadcrumbItem };
