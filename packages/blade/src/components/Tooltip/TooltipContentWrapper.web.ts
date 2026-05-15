import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';

import type { CSSProperties } from 'react';
import type { TooltipContentWrapperProps } from './types';
import type { ColorSchemeNames } from '~tokens/theme/theme';

const TooltipContentWrapper = styled(BaseBox)<
  { styles: CSSProperties; colorScheme: ColorSchemeNames } & TooltipContentWrapperProps
>(({ theme, styles, colorScheme }) => {
  return getTooltipContentWrapperStyles({ theme, styles, colorScheme });
});

export { TooltipContentWrapper };
