import React from 'react';
import { TooltipContentWrapper } from './TooltipContentWrapper';
import type { TooltipContentProps } from './types';
import { Text } from '~components/Typography';
import { isReactNative, makeSize } from '~utils';
import { size } from '~tokens/global';

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, title, arrow, side, style, isVisible }, ref) => {
    return (
      <TooltipContentWrapper
        position={isReactNative() ? 'absolute' : 'relative'}
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        paddingLeft="spacing.4"
        paddingRight="spacing.4"
        maxWidth={makeSize(size[200])}
        ref={ref as never}
        styles={style}
        side={side}
        isVisible={isVisible}
      >
        {title ? (
          <Text weight="semibold" size="medium" color="surface.text.staticWhite.normal">
            {title}
          </Text>
        ) : null}
        <Text
          variant="body"
          size="small"
          weight="regular"
          color="surface.text.staticWhite.subtle"
          wordBreak="break-word"
        >
          {children}
        </Text>
        {arrow}
      </TooltipContentWrapper>
    );
  },
);

export { TooltipContent };
