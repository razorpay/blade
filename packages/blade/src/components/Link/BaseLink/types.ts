import type { Dispatch, SetStateAction } from 'react';
import type { CSSObject } from 'styled-components';
import type { BaseLinkProps } from './BaseLink';
import type { DurationString, EasingString } from '~tokens/global';
import type { ActionStates } from '~tokens/theme/theme';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~src/_helpers/types';
import type { BladeCommonEvents } from '~components/types';

export type StyledBaseLinkProps = {
  variant: BaseLinkProps['variant'];
  as: 'a' | 'button';
  cursor?: CSSObject['cursor'];
  href?: string;
  target?: string;
  rel?: string;
  onClick?: BaseLinkProps['onClick'];
  onBlur?: BaseLinkProps['onBlur'];
  onMouseLeave?: BaseLinkProps['onMouseLeave'];
  onKeyDown?: BaseLinkProps['onKeyDown'];
  focusRingColor: string;
  disabled: boolean;
  motionDuration: DurationString;
  motionEasing: EasingString;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
  accessibilityProps: Record<string, unknown>;
  type?: 'button';
  size?: 'small' | 'medium';
  hitSlop?: BaseLinkProps['hitSlop'];
} & TestID &
  StyledPropsBlade &
  Omit<BladeCommonEvents, 'onBlur' | 'onMouseLeave'>;
