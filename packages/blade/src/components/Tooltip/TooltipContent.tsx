import React from 'react';
import { TooltipContentWrapper } from './TooltipContextWrapper';
import type { TooltipContentProps } from './types';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, arrow, side, style, isVisible }, ref) => {
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
        side={side}
        isVisible={isVisible}
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
