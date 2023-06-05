import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';
import BaseBox from '~components/Box/BaseBox';

const TooltipContentWrapper = styled(BaseBox)<{ collapsable?: boolean; styles: CSSProperties }>(
  ({ theme, styles }) => {
    return getTooltipContentWrapperStyles({ theme, styles });
  },
);

export { TooltipContentWrapper };
