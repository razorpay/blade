import type { ReactNode } from 'react';

import type { ColorContrast, IntentTypes } from '~tokens/theme/theme';

export type StyledAlertProps = {
  children: ReactNode[];
  contrastType: keyof ColorContrast;
  intent: Exclude<IntentTypes, 'neutral'>;
  isFullWidth: boolean;
  isBorderless: boolean;
};

export { default } from './StyledAlert.web';
