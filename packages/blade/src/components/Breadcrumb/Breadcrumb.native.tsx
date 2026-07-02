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
      color={color === 'white' ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted'}
      size={size}
      weight="medium"
    >
      /
    </Text>
  );
};

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
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.Breadcrumb })}
      {...makeAnalyticsAttribute(rest)}
      {...makeAccessible({ label: accessibilityLabel })}
    >
      <BreadcrumbContext.Provider value={contextValue}>
        <BaseBox
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          gap="spacing.2"
          alignItems="center"
        >
          {React.Children.map(children, (child, index) => {
            return (
              <BaseBox
                key={index}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="spacing.2"
                {...metaAttribute({ name: MetaConstants.BreadcrumbItem })}
              >
                {child}
                <BaseBox {...makeAccessible({ hidden: true })}>
                  {index !== React.Children.count(children) - 1 && (
                    <Separator size={size} color={color} />
                  )}
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
