import type { Dispatch, SetStateAction } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../tokens/global/motion';
import type { ActionStates } from '../../../tokens/theme/theme';

export type StyledBaseLinkProps = {
  as: 'a' | 'button';
  cursor?: CSSObject['cursor'];
  href?: string;
  target?: string;
  onClick?: () => void;
  focusRingColor: string;
  disabled: boolean;
  cursor: CSSObject['cursor'];
  motionDuration: DurationString;
  motionEasing: EasingString;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
};

export { default } from './StyledBaseLink.web';
