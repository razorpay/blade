import type { ReactNode } from 'react';

import type { ColorContrast, Feedback } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';

export type StyledAlertProps = {
  children: ReactNode;
  contrastType: keyof ColorContrast;
  intent: Feedback;
  isFullWidth: boolean;
  isDesktop: boolean;
} & StyledPropsBlade;
