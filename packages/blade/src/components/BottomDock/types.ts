import type React from 'react';
import type { ViewStyle } from 'react-native';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { AriaRoles } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { MetaConstants } from '~utils/metaAttribute';

type MetaConstantsValues = typeof MetaConstants[keyof typeof MetaConstants];
type BottomDockLayoutProps = Pick<
  BaseBoxProps,
  | 'display'
  | 'flexDirection'
  | 'gap'
  | 'paddingX'
  | 'paddingTop'
  | 'paddingBottom'
  | 'alignItems'
  | 'justifyContent'
>;

type BottomDockProps = {
  children: React.ReactNode;

  /**
   * zIndex of the bottom dock surface.
   *
   * @default 100
   */
  zIndex?: number;

  /**
   * Accessible landmark role for the dock surface.
   */
  role?: AriaRoles;

  /**
   * Internal metaAttribute component name.
   */
  metaName: MetaConstantsValues;

  /**
   * Internal native styles for composing platform components.
   */
  nativeStyle?: ViewStyle;
} & StyledPropsBlade &
  BottomDockLayoutProps &
  TestID &
  DataAnalyticsAttribute;

export type { BottomDockProps };
