import type { ReactNode } from 'react';

import type { ColorContrast, Feedback } from '~tokens/theme/theme';
import type { StyledProps } from '~components/Box/styled-props';

export type StyledAlertProps = {
  children: ReactNode;
  contrastType: keyof ColorContrast;
  intent: Feedback;
  isFullWidth: boolean;
  isDesktop: boolean;
} & StyledProps;
