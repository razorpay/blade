import type { ReactNode } from 'react';

import type { IntentTypes } from '~tokens/theme/theme';

export type StyledAlertProps = {
  children: ReactNode[];
  contrastType: 'lowContrast' | 'highContrast';
  intent: Exclude<IntentTypes, 'neutral'>;
  isFullWidth: boolean;
  isBorderless: boolean;
};

export { default } from './StyledAlert.web';
