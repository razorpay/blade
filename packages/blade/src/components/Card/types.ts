import type { CSSObject } from 'styled-components';
import type { CardProps } from './Card';
import type { BaseBoxProps, SpacingValueType } from '~components/Box/BaseBox';
import type { Platform } from '~utils';

type CardSpacingValueType = Extract<
  SpacingValueType,
  'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'
>;

type CardRootProps = {
  isSelected?: boolean;
  isFocused?: boolean;
  shouldScaleOnHover?: boolean;
  onClick?: CardProps['onClick'];
  children?: React.ReactNode;
  href?: string;
  as?: 'label';
  accessibilityLabel?: string;
  validationState?: 'none' | 'error' | 'success';
  cursor?: Platform.Select<{
    web: CSSObject['cursor'];
    native: undefined;
  }>;
} & BaseBoxProps;

type LinkOverlayProps = {
  href?: string;
} & BaseBoxProps;

export type { CardRootProps, LinkOverlayProps, CardSpacingValueType };
