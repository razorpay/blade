/* eslint-disable react-native-a11y/has-valid-accessibility-role */
import React from 'react';
import type { BreadcrumbProps } from './types';
import { BreadcrumbContext } from './BreadcrumbContext';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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

const listStyleNone = { listStyle: 'none' };

const _Breadcrumb = (
  {
    size = 'medium',
    color = 'primary',
    showLastSeparator = false,
    accessibilityLabel = 'Breadcrumb',
    children,
    ...rest
  }: BreadcrumbProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const contextValue = React.useMemo(() => ({ size, color }), [size, color]);

  return (
    <BaseBox
      ref={ref as never}
      as="nav"
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Breadcrumb })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BreadcrumbContext.Provider value={contextValue}>
        <BaseBox
          as="ol"
          margin="spacing.0"
          padding="spacing.0"
          display="flex"
          flexWrap="wrap"
          gap="spacing.2"
          alignItems="center"
          style={listStyleNone}
          {...makeAccessible({ label: accessibilityLabel })}
        >
          {React.Children.map(children, (child, index) => {
            const ariaCurrent = (child as React.ReactElement)?.props?.isCurrentPage
              ? 'page'
              : undefined;

            return (
              <BaseBox
                key={index}
                as="li"
                display="flex"
                alignItems="center"
                gap="spacing.2"
                {...makeAccessible({ current: ariaCurrent })}
                {...metaAttribute({ name: MetaConstants.BreadcrumbItem })}
              >
                {child}
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
      </BreadcrumbContext.Provider>
    </BaseBox>
  );
};

const Breadcrumb = React.forwardRef(_Breadcrumb);

export { Breadcrumb };
