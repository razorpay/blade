import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const PopoverContentWrapper = styled(BaseBox)<
  { styles: CSSProperties } & PopoverContentWrapperProps
>(({ theme, isMobile, styles }) => {
  return getPopoverContentWrapperStyles({ theme, styles, isMobile });
});

export { PopoverContentWrapper };
