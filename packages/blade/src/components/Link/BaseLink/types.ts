import type { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import type { CSSObject } from 'styled-components';
import type { BaseLinkProps } from './BaseLink';
import type { DurationString, EasingString } from '~tokens/global/motion';
import type { ActionStates } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styled-props';

export type StyledBaseLinkProps = {
  variant: BaseLinkProps['variant'];
  as: 'a' | 'button';
  cursor?: CSSObject['cursor'];
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: SyntheticEvent) => void;
  focusRingColor: string;
  disabled: boolean;
  motionDuration: DurationString;
  motionEasing: EasingString;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
  accessibilityProps: Record<string, unknown>;
  type?: 'button';
  size?: 'small' | 'medium';
} & StyledPropsBlade;
