import type { BreadcrumbItemProps, BreadcrumbProps } from './types';
import { BaseLink } from '~components/Link/BaseLink';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

const BreadcrumbItem = ({
  _size,
  _color,
  children,
  href,
  icon: Icon,
  isCurrentPage,
  onClick,
  accessibilityLabel,
}: BreadcrumbItemProps & {
  _size?: BreadcrumbProps['size'];
  _color?: BreadcrumbProps['color'];
}): React.ReactElement => {
  if (isCurrentPage) {
    const isWhite = _color === 'white';
    return (
      <BaseBox display="flex" gap="spacing.2" alignItems="center">
        {Icon && (
          <Icon
            size={_size}
            color={isWhite ? 'surface.icon.staticWhite.normal' : 'surface.icon.gray.normal'}
          />
        )}
        <Text
          weight="medium"
          size={_size}
          color={isWhite ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}
        >
          {children}
        </Text>
      </BaseBox>
    );
  }

  return (
    <BaseLink
      size={_size}
      color={_color}
      opacity={_color !== 'primary' ? 0.5 : 1}
      icon={Icon}
      href={href}
      onClick={onClick}
      accessibilityProps={{ label: accessibilityLabel }}
    >
      {children ?? ''}
    </BaseLink>
  );
};

export { BreadcrumbItem };
