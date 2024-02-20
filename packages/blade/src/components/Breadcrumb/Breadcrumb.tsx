/* eslint-disable react-native-a11y/has-valid-accessibility-role */
import React from 'react';
import type { BreadcrumbProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { getStyledProps } from '~components/Box/styledProps';

const Separator = ({
  size,
  color,
}: Pick<BreadcrumbProps, 'size' | 'color'>): React.ReactElement => {
  return (
    <Text
      as="span"
      color={color === 'white' ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted'}
      size={size}
      weight="medium"
    >
      /
    </Text>
  );
};

const listStyle = { listStyle: 'none' };

const Breadcrumb = ({
  size = 'medium',
  color = 'primary',
  showLastSeparator = false,
  accessibilityLabel = 'Breadcrumb',
  children,
  ...styledProps
}: BreadcrumbProps): React.ReactElement => {
  return (
    <BaseBox as="nav" {...getStyledProps(styledProps)}>
      <BaseBox
        as="ol"
        margin="spacing.0"
        padding="spacing.0"
        display="flex"
        flexWrap="wrap"
        gap="spacing.3"
        alignItems="center"
        style={listStyle}
        {...makeAccessible({ label: accessibilityLabel })}
      >
        {React.Children.map(children, (child, index) => {
          return (
            <BaseBox
              key={index}
              as="li"
              display="flex"
              alignItems="center"
              gap="spacing.3"
              {...makeAccessible({
                current: (child as React.ReactElement)?.props?.isCurrentPage ? 'page' : undefined,
              })}
            >
              {React.cloneElement(child as React.ReactElement, { _size: size, _color: color })}
              <BaseBox as="span" {...makeAccessible({ hidden: true })}>
                {index !== React.Children.count(children) - 1 && <Separator size={size} />}
                {index === React.Children.count(children) - 1 && showLastSeparator && (
                  <Separator size={size} color={color} />
                )}
              </BaseBox>
            </BaseBox>
          );
        })}
      </BaseBox>
    </BaseBox>
  );
};

export { Breadcrumb };
