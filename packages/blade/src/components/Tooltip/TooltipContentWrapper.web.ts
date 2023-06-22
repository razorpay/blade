import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';
import type { TooltipContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const TooltipContentWrapper = styled(BaseBox)<
  { styles: CSSProperties } & TooltipContentWrapperProps
>(({ theme, styles }) => {
  return getTooltipContentWrapperStyles({ theme, styles });
});

export { TooltipContentWrapper };
