import React from 'react';
import type { BreadcrumbItemProps } from './types';
import { BreadcrumbContext } from './BreadcrumbContext';
import { BaseLink } from '~components/Link/BaseLink';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { opacity } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const BreadcrumbItem = ({
  children,
  href,
  icon: Icon,
  isCurrentPage,
  onClick,
  accessibilityLabel,
  ...rest
}: BreadcrumbItemProps): React.ReactElement => {
  const { color, size } = React.useContext(BreadcrumbContext);

  if (isCurrentPage) {
    const isWhite = color === 'white';
    return (
      <BaseBox display="flex" gap="spacing.2" alignItems="center">
        {Icon && (
          <Icon
            size={size}
            color={isWhite ? 'surface.icon.staticWhite.normal' : 'surface.icon.gray.normal'}
          />
        )}
        <Text
          weight="medium"
          size={size}
          color={isWhite ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}
        >
          {children}
        </Text>
      </BaseBox>
    );
  }

  return (
    <BaseLink
      size={size}
      color={color}
      opacity={color !== 'primary' ? opacity[700] : 1}
      icon={Icon}
      href={href}
      onClick={onClick}
      accessibilityProps={{ label: accessibilityLabel }}
      {...makeAnalyticsAttribute(rest)}
    >
      {children ?? ''}
    </BaseLink>
  );
};

export { BreadcrumbItem };
