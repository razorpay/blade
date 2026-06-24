import type { ReactNode } from 'react';

import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';

export type AlertColors = FeedbackColors | 'primary';

export type StyledAlertProps = {
  children: ReactNode;
  emphasis: SubtleOrIntense;
  color: AlertColors;
  isFullWidth: boolean;
  isDesktop: boolean;
} & StyledPropsBlade;
