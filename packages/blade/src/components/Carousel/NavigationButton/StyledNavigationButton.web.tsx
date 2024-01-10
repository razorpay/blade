import styled from 'styled-components';
import type { NavigationButtonProps } from './types';
import { getNavigationButtonStyles } from './getNavigationButtonStyles';

const StyledNavigationButton = styled.button<Pick<NavigationButtonProps, 'variant'>>((props) => {
  return getNavigationButtonStyles(props);
});

export { StyledNavigationButton };
