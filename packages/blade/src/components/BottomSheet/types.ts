/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import type { SnapPoints } from './utils';

type BottomSheetProps = {
  /**
   * Accepts BottomSheetHeader, BottomSheetFooter, BottomSheetBody
   */
  children: React.ReactNode;
  /**
   * SnapPoints in which the bottom sheeet will rest on.
   * Accepts numbers between 0 & 1 which maps to the total view height of the screen, 0.5 means 50% of screen height.
   *
   * @default [0.35, 0.5, 0.85]
   */
  snapPoints?: SnapPoints;
  /**
   * Called when the bottom sheet is closed, either by user state, hitting `esc` or tapping backdrop
   */
  onDismiss?: () => void;
  /**
   * Toggles bottom sheet state
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * Ref element you want to get keyboard focus when opening the sheet
   * By default the initial focus will go to the close button
   */
  initialFocusRef?: React.MutableRefObject<any>;
};

type BottomSheetHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'showBackButton' | 'onBackButtonClick'
> & {
  /**
   * Trailing element to be rendered in the Header
   *
   * Accepts one of `Badge`, `Text`, `Button`, `Link`
   */
  trailing?: BaseHeaderProps['trailing'];
  /**
   * Renders an adornment besides the title
   *
   * Accepts `Counter`
   */
  titleSuffix?: BaseHeaderProps['titleSuffix'];
};

type BottomSheetFooterProps = Pick<BaseFooterProps, 'children'>;

export { BottomSheetProps, BottomSheetHeaderProps, BottomSheetFooterProps };
