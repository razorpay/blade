/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SnapPoints } from './utils';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import type { BaseBoxProps, SpacingValueType } from '~components/Box/BaseBox';
import type { DataAnalyticsAttribute } from '~utils/types';

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
  /**
   * Sets the z-index of the bottom sheet
   * Note: when using stacked bottom sheet make sure all the bottom sheets have the same zIndex
   * @default 100
   */
  zIndex?: number;
} & DataAnalyticsAttribute;

type BottomSheetHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'showBackButton' | 'onBackButtonClick' | 'children'
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
} & DataAnalyticsAttribute;

type BottomSheetFooterProps = Pick<BaseFooterProps, 'children'> & DataAnalyticsAttribute;

type BottomSheetBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.5`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.5'>;
  overflow?: BaseBoxProps['overflow'];
} & DataAnalyticsAttribute;

export type {
  BottomSheetProps,
  BottomSheetHeaderProps,
  BottomSheetFooterProps,
  BottomSheetBodyProps,
};
