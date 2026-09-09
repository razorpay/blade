import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import type { SpacingValueType } from '~components/Box/BaseBox/types/spacingTypes';
import BaseBox from '~components/Box/BaseBox';

const PopoverContentWrapper = styled(BaseBox)<
  { styles: CSSProperties } & Omit<PopoverContentWrapperProps, 'maxWidth'> & {
      maxWidth?: SpacingValueType;
    }
>(({ theme, isMobile, styles, colorScheme, maxWidth }) => {
  return getPopoverContentWrapperStyles({
    theme,
    styles,
    isMobile,
    colorScheme,
    maxWidth,
  });
});

export { PopoverContentWrapper };
