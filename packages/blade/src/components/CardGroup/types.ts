import type { ReactNode } from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type CardGroupProps = {
  /**
   * Rows of the group — compose `CardGroupItem` and `CardGroupCollapsibleItem`.
   */
  children: ReactNode;

  /**
   * Accessible label for the group, announced by screen readers.
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupItemProps = {
  /**
   * Row content — the free slot between the leading and trailing slots.
   */
  children?: ReactNode;

  /**
   * Leading content, rendered before `children` (e.g. an icon or avatar).
   */
  leading?: ReactNode;

  /**
   * Trailing content, rendered after `children` and before the chevron
   * (e.g. a badge or amount).
   */
  trailing?: ReactNode;

  /**
   * Renders the row as a navigating link. A row either navigates (`href`) or
   * selects (`onClick` / `isSelected`) — never both. Ignored when the row acts
   * as a collapsible trigger.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Link target, used only with `href`.
   *
   * @default undefined
   */
  target?: string;

  /**
   * Link rel, used only with `href`.
   *
   * @default undefined
   */
  rel?: string;

  /**
   * Click handler for a selecting row. Ignored when `href` is set or when the
   * row acts as a collapsible trigger.
   *
   * @default undefined
   */
  onClick?: Platform.Select<{
    web: (event: React.MouseEvent<HTMLElement>) => void;
    native: (event: unknown) => void;
  }>;

  /**
   * Marks a selecting row as selected. Selection is consumer-driven; the group
   * does not own selection state.
   *
   * @default false
   */
  isSelected?: boolean;

  /**
   * Disables the row.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessible label for the row.
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemProps = {
  /**
   * Compose a `CardGroupItem` (the disclosure trigger) followed by a
   * `CardGroupCollapsibleItemBody` (the revealed content).
   */
  children: ReactNode;

  /**
   * Expands the row (controlled).
   *
   * @default undefined
   */
  isExpanded?: boolean;

  /**
   * Expands the row by default (uncontrolled).
   *
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Callback for a change in the row's expanded state.
   *
   * @default undefined
   */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemBodyProps = {
  /**
   * Revealed content — a free slot that may hold anything, including a nested
   * `CardGroup`.
   */
  children: ReactNode;
} & TestID &
  DataAnalyticsAttribute;
