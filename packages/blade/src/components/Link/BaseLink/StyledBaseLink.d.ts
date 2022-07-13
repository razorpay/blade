import type { Dispatch, SetStateAction } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../tokens/global/motion';
import type { ActionStates } from '../../../tokens/theme/theme';
import type { BaseLinkProps } from './BaseLink';

export type StyledBaseLinkProps = {
  variant: BaseLinkProps['variant'];
  as: 'a' | 'button';
  cursor?: CSSObject['cursor'];
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  focusRingColor: string;
  disabled: boolean;
  cursor: CSSObject['cursor'];
  motionDuration: DurationString;
  motionEasing: EasingString;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
  accessibilityProps: Record<string, unknown>;
};

export { default } from './StyledBaseLink.web';
