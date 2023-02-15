import type { ReactNode } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox/types';

import type { ColorContrast, Feedback } from '~tokens/theme/theme';

export type StyledAlertProps = {
  children: ReactNode;
  contrastType: keyof ColorContrast;
  intent: Feedback;
  isFullWidth: boolean;
  isDesktop: boolean;
} & BaseBoxProps;
