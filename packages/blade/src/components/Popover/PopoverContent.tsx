import React from 'react';
import { PopoverContentWrapper } from './PopoverContentWrapper';
import type { PopoverContentProps } from './types';
import { PopoverCloseButton } from './PopoverCloseButton';
import { Heading } from '~components/Typography';
import { isReactNative } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, headerTitle, headerLeading, footerContent, arrow, side, style, isVisible }, ref) => {
    return (
      <PopoverContentWrapper
        position={isReactNative() ? 'absolute' : 'relative'}
        paddingTop="spacing.5"
        paddingBottom="spacing.5"
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        ref={ref as never}
        styles={style}
        side={side}
        isVisible={isVisible}
      >
        <BaseBox display="flex" alignItems="center" gap="spacing.3">
          {headerLeading
            ? React.cloneElement(headerLeading as React.ReactElement, { size: 'large' })
            : null}
          {headerTitle ? (
            <BaseBox paddingRight="spacing.3">
              <Heading size="small" weight="bold" type="normal">
                {headerTitle}
              </Heading>
            </BaseBox>
          ) : null}
          <BaseBox marginLeft="auto">
            <PopoverCloseButton />
          </BaseBox>
        </BaseBox>
        <BaseBox>{children}</BaseBox>
        {footerContent ? <BaseBox>{footerContent}</BaseBox> : null}
        {arrow}
      </PopoverContentWrapper>
    );
  },
);

export { PopoverContent };
