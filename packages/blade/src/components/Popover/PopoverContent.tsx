import React from 'react';
import { PopoverContentWrapper } from './PopoverContentWrapper';
import type { PopoverContentProps } from './types';
import { PopoverCloseButton } from './PopoverCloseButton';
import BaseBox from '~components/Box/BaseBox';
import { Heading } from '~components/Typography';

type PopoverHeaderProps = {
  headerTitle?: string;
  headerLeading?: React.ReactNode;
};

const PopoverHeader = ({ headerLeading, headerTitle }: PopoverHeaderProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
      {headerLeading
        ? React.cloneElement(headerLeading as React.ReactElement, { size: 'large' })
        : null}
      {headerTitle ? (
        <BaseBox paddingRight="spacing.4">
          <Heading size="small" weight="bold" type="normal">
            {headerTitle}
          </Heading>
        </BaseBox>
      ) : null}
      <BaseBox marginLeft="auto">
        <PopoverCloseButton />
      </BaseBox>
    </BaseBox>
  );
};

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, headerTitle, headerLeading, footerContent, arrow, side, style, isVisible }, ref) => {
    return (
      <PopoverContentWrapper ref={ref} styles={style} side={side} isVisible={isVisible}>
        <PopoverHeader headerLeading={headerLeading} headerTitle={headerTitle} />
        <BaseBox>{children}</BaseBox>
        {footerContent ? <BaseBox>{footerContent}</BaseBox> : null}
        {arrow}
      </PopoverContentWrapper>
    );
  },
);

export { PopoverContent };
