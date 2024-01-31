/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { PopoverContentWrapper } from './PopoverContentWrapper';
import type { PopoverContentProps } from './types';
import { PopoverCloseButton } from './PopoverCloseButton';
import { usePopoverContext } from './PopoverContext';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { useIsMobile } from '~utils/useIsMobile';

type PopoverHeaderProps = {
  title?: string;
  titleLeading?: React.ReactNode;
};

const PopoverHeader = ({ title, titleLeading }: PopoverHeaderProps): React.ReactElement => {
  const { titleId } = usePopoverContext();

  const isFloating = !(title || titleLeading);
  if (isFloating) {
    return (
      <BaseBox
        borderRadius="max"
        position="absolute"
        padding="spacing.2"
        top="spacing.2"
        right="spacing.2"
        zIndex={1}
      >
        <PopoverCloseButton />
      </BaseBox>
    );
  }

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      flexWrap={isReactNative() ? 'wrap' : 'nowrap'}
      alignItems="center"
      gap="spacing.3"
    >
      {titleLeading
        ? React.cloneElement(titleLeading as React.ReactElement, { size: 'large' })
        : null}
      {title ? (
        <BaseBox id={titleId} paddingRight="spacing.4">
          <Text size="large" weight="semibold">
            {title}
          </Text>
        </BaseBox>
      ) : null}
      <BaseBox marginLeft="auto">
        <PopoverCloseButton />
      </BaseBox>
    </BaseBox>
  );
};

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, title, titleLeading, footer, arrow, side, style, isVisible }, ref) => {
    const isMobile = useIsMobile();
    return (
      <PopoverContentWrapper
        ref={ref as never}
        styles={style}
        side={side}
        isVisible={isVisible}
        isMobile={isMobile}
      >
        <BaseBox padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
          <PopoverHeader title={title} titleLeading={titleLeading} />
          <BaseBox>{children}</BaseBox>
          {footer ? <BaseBox>{footer}</BaseBox> : null}
        </BaseBox>
        {arrow}
      </PopoverContentWrapper>
    );
  },
);

export { PopoverContent };
