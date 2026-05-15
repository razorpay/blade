import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';

import type { CSSProperties } from 'react';
import type { PopoverContentWrapperProps } from './types';

const PopoverContentWrapper = styled(BaseBox)<
  { styles: CSSProperties } & PopoverContentWrapperProps
>(({ theme, isMobile, styles, colorScheme }) => {
  return getPopoverContentWrapperStyles({ theme, styles, isMobile, colorScheme });
});

export { PopoverContentWrapper };
