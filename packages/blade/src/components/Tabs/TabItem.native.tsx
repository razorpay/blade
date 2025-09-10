/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled, { StyledComponent } from 'styled-components';
import React from 'react';
import type { TabItemProps, TabsProps } from './types';
import { paddingX, paddingTop, paddingBottom } from './tabTokens';
import get from '~utils/lodashButBetter/get';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledTabButton: StyledComponent<
  typeof BaseBox,
  any,
  {
    size: TabsProps['size'];
    isFullWidthTabItem?: TabsProps['isFullWidthTabItem'];
    variant: NonNullable<TabsProps['variant']>;
  },
  never
> = styled(BaseBox)<{
  size: TabsProps['size'];
  isFullWidthTabItem?: TabsProps['isFullWidthTabItem'];
  variant: NonNullable<TabsProps['variant']>;
}>(({ theme, size, variant, isFullWidthTabItem }) => {
  const _variant = variant === 'bordered' ? 'bordered' : 'filled';

  return {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: isFullWidthTabItem ? '100%' : undefined,
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
