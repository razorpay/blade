import type React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { BladeCommonEvents } from '~components/types';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';
import type { SpacingValueType } from '~components/Box/BaseBox/types';

/**
 * Values mirror `Popover`'s `placement`, where the unsuffixed value is centered
 * and `start` / `end` name the inline edges.
 */
type FloatingActionButtonPlacement = 'bottom-end' | 'bottom-start' | 'bottom';

type FloatingActionButtonCommonProps = {
  /**
   * Icon rendered inside the button.
   *
   * Accepts an icon component from blade.
   */
  icon: IconComponent;

  /**
   * Color of the button.
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'black';

  /**
   * Corner of the viewport the button is anchored to.
   *
   * @default 'bottom-end'
   */
  placement?: FloatingActionButtonPlacement;

  /**
   * Distance between the button and the edges it is anchored to.
   *
   * @default 'spacing.5'
   */
  offset?: SpacingValueType;

  /**
   * zIndex of the button.
   *
   * Defaults to a value that sits above page content but below `BottomNav`,
   * `BottomSheet` and `Modal`.
   *
   * @default 99
   */
  zIndex?: number;

  /**
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Shows a spinner in place of the button's content.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Automatically renders the button with an `a` tag with `href` on web.
   */
  href?: BaseButtonProps['href'];

  /**
   * anchor target attribute
   *
   * Should only be used alongside `href`
   */
  target?: BaseButtonProps['target'];

  /**
   * anchor rel attribute
   *
   * Should only be used alongside `href`
   */
  rel?: BaseButtonProps['rel'];

  /**
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';

  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute &
  BladeCommonEvents;

/*
  With a label, `accessibilityLabel` is optional since the label already names
  the action.
*/
type FloatingActionButtonWithLabelProps = FloatingActionButtonCommonProps & {
  children: StringChildrenType;
  accessibilityLabel?: string;
};

/*
  Without a label the button is a bare icon, so it is unusable with a screen
  reader unless `accessibilityLabel` names the action.
*/
type FloatingActionButtonIconOnlyProps = FloatingActionButtonCommonProps & {
  children?: undefined;
  accessibilityLabel: string;
};

type FloatingActionButtonProps =
  | FloatingActionButtonWithLabelProps
  | FloatingActionButtonIconOnlyProps;

type FloatingActionButtonContainerProps = {
  children: React.ReactNode;
  placement: FloatingActionButtonPlacement;
  offset: SpacingValueType;
  zIndex: number;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

export type {
  FloatingActionButtonProps,
  FloatingActionButtonPlacement,
  FloatingActionButtonContainerProps,
};
