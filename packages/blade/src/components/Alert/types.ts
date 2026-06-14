import type { ReactNode } from 'react';

import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BoxProps } from '~components/Box';

export type AlertColors = FeedbackColors | 'primary';

export type StyledAlertProps = {
  children: ReactNode;
  emphasis: SubtleOrIntense;
  color: AlertColors;
  isFullWidth: boolean;
  isDesktop: boolean;
  maxWidth?: BoxProps['maxWidth'];
} & StyledPropsBlade;
