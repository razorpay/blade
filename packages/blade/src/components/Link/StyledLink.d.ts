import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../tokens/global/motion';

export type StyledLinkProps = {
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
};

export { default } from './StyledLink.web';
