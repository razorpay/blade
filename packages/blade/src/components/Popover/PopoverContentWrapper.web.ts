import type { CSSProperties } from 'react';
import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const PopoverContentWrapper: StyledComponent<
  typeof BaseBox,
  any,
  { styles: CSSProperties } & PopoverContentWrapperProps,
  never
> = styled(BaseBox)<{ styles: CSSProperties } & PopoverContentWrapperProps>(
  ({ theme, isMobile, styles }) => {
    return getPopoverContentWrapperStyles({ theme, styles, isMobile });
  },
);

export { PopoverContentWrapper };
