import type React from 'react';
import type { ViewStyle } from 'react-native';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { AriaRoles } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

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
  metaName: string;

  /**
   * Internal layout props for the dock content surface.
   */
  dockLayoutProps?: Pick<
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

  /**
   * Internal native styles for composing platform components.
   */
  nativeStyle?: ViewStyle;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

export type { BottomDockProps };
