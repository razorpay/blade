import type { CSSProperties } from 'react';
import React from 'react';
import { TooltipContentWrapper } from './TooltipContextWrapper';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';

type TooltipContentProps = {
  children: React.ReactNode;
  style: CSSProperties;
  arrow: React.ReactNode;
};
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, arrow, style }, ref) => {
    return (
      <TooltipContentWrapper
        position={isReactNative() ? 'absolute' : 'relative'}
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
        maxWidth={{ base: '120px', l: '160px' }}
        ref={ref as never}
        styles={style}
        collapsable={false}
      >
        <Text
          variant="body"
          size="small"
          weight="regular"
          contrast="high"
          color="feedback.text.neutral.highContrast"
        >
          {children}
        </Text>
        {arrow}
      </TooltipContentWrapper>
    );
  },
);

export { TooltipContent };
