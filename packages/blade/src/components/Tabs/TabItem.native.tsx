/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import get from 'lodash/get';
import React from 'react';
import type { TabItemProps, TabsProps } from './types';
import { paddingX, paddingY } from './tabTokens';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledTabButton = styled(BaseBox)<{
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
    paddingTop: makeSpace(get(theme, paddingY[_variant].horizontal.mobile[size!])),
    paddingBottom: makeSpace(get(theme, paddingY[_variant].horizontal.mobile[size!])),
    paddingLeft: makeSpace(get(theme, paddingX[_variant].horizontal.mobile[size!])),
    paddingRight: makeSpace(get(theme, paddingX[_variant].horizontal.mobile[size!])),
  };
});

const TabItem = (_props: TabItemProps): React.ReactElement => {
  return <></>;
};

export { TabItem, StyledTabButton };
