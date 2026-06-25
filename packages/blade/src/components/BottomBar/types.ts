import type React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type BottomBarProps = {
  /**
   * BottomBar content slot. Usually contains action buttons.
   */
  children: React.ReactNode;

  /**
   * zIndex of BottomBar.
   *
   * @default 100
   */
  zIndex?: number;

  /**
   * Accessible label for the BottomBar region/group.
   * Passed through to `aria-label` on web and `accessibilityLabel` on native.
   */
  accessibilityLabel?: string;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

export type { BottomBarProps };
