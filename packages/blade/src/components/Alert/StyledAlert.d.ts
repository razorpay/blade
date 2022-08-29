import type { ReactNode } from 'react';

import type { ColorContrast, Feedback } from '~tokens/theme/theme';

export type StyledAlertProps = {
  children: ReactNode;
  contrastType: keyof ColorContrast;
  intent: Exclude<Feedback, 'neutral'>;
  isFullWidth: boolean;
  isBorderless: boolean;
};

export { StyledAlert } from './StyledAlert.web';
