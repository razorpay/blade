import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { ColorSchemeNames } from '~tokens/theme';

const PopoverContentWrapper = styled(BaseBox)<
  { styles: CSSProperties; colorScheme: ColorSchemeNames } & PopoverContentWrapperProps
>(({ theme, isMobile, styles, colorScheme }) => {
  return getPopoverContentWrapperStyles({ theme, styles, isMobile, colorScheme });
});

export { PopoverContentWrapper };
