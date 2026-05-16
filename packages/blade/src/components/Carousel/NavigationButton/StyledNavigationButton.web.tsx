import styled from 'styled-components';
import { getNavigationButtonStyles } from './getNavigationButtonStyles';

import type { NavigationButtonProps } from './types';

const StyledNavigationButton = styled.button<Pick<NavigationButtonProps, 'variant'>>((props) => {
  return getNavigationButtonStyles(props);
});

export { StyledNavigationButton };
