import type { CSSProperties } from 'react';
import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import { getTooltipContentWrapperStyles } from './getTooltipContentWrapperStyles';
import type { TooltipContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const TooltipContentWrapper: StyledComponent<
  typeof BaseBox,
  any,
  { styles: CSSProperties } & TooltipContentWrapperProps,
  never
> = styled(BaseBox)<{ styles: CSSProperties } & TooltipContentWrapperProps>(({ theme, styles }) => {
  return getTooltipContentWrapperStyles({ theme, styles });
});

export { TooltipContentWrapper };
