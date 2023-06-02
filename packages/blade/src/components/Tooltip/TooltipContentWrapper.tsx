import React from 'react';
import type { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeBorderSize, castWebType, isReactNative } from '~utils';

const TooltipContentWrapper = styled(BaseBox)<{ collapsable?: boolean; styles: CSSProperties }>(
  ({ theme, styles }) => {
    return {
      backgroundColor: theme.colors.brand.gray[200].highContrast,
      borderWidth: makeBorderSize(theme.border.width.thin),
      borderRadius: makeBorderSize(theme.border.radius.medium),
      borderColor: theme.colors.brand.gray[300].highContrast,
      borderStyle: 'solid',
      boxShadow: castWebType(theme.elevation.lowRaised),
      ...styles,
    };
  },
);

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
