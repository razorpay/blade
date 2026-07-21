/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import type { TabItemProps, TabsProps } from './types';
import { paddingX, paddingTop, paddingBottom, filledHorizontalItemHeight } from './tabTokens';
import get from '~utils/lodashButBetter/get';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledTabButton = styled(BaseBox)<{
  size: TabsProps['size'];
  isFullWidthTabItem?: TabsProps['isFullWidthTabItem'];
  variant: NonNullable<TabsProps['variant']>;
}>(({ theme, size, variant, isFullWidthTabItem }) => {
  const _variant = variant === 'bordered' ? 'bordered' : 'filled';
  // Only `filled` + `small` (native is always horizontal) needs a pinned height —
  // its padding + line-height math falls short of the Figma spec.
  const pinnedHeight = _variant === 'filled' ? filledHorizontalItemHeight[size!] : undefined;

  return {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    // Center the tab label, matching TabItem.web's `justifyContent: 'center'`.
    // Without this, full-width tab items (`isFullWidthTabItem`) left-align their
    // label on native while web centers it — a web/native parity gap.
    justifyContent: 'center',
    width: isFullWidthTabItem ? '100%' : undefined,
    ...(pinnedHeight ? { height: pinnedHeight } : {}),
    paddingTop: makeSpace(get(theme, paddingTop[_variant].horizontal[size!])),
    paddingBottom: makeSpace(get(theme, paddingBottom[_variant].horizontal[size!])),
    paddingLeft: makeSpace(get(theme, paddingX[_variant].horizontal[size!])),
    paddingRight: makeSpace(get(theme, paddingX[_variant].horizontal[size!])),
  };
});

// Internally we just loop over the TabItems and extract it's props.
// This component itself doesn't need to render anything.
// Check the Tabs.native.tsx file where we map over the TabItems and render them
// via the `getTabs` utility
const TabItem = (_props: TabItemProps): React.ReactElement => {
  return <></>;
};

export { TabItem, StyledTabButton };
