/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import get from 'lodash/get';
import React from 'react';
import type { TabItemProps, TabsProps } from './types';
import { paddings } from './tabTokens';
import { makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const StyledTabButton = styled(BaseBox)<{
  size: TabsProps['size'];
  autoWidth?: TabsProps['autoWidth'];
  variant: NonNullable<TabsProps['variant']>;
}>(({ theme, size, variant, autoWidth }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: autoWidth ? '100%' : undefined,
    paddingTop: makeSpace(get(theme, paddings[variant].horizontal.mobile.top[size!])),
    paddingBottom: makeSpace(get(theme, paddings[variant].horizontal.mobile.bottom[size!])),
    paddingLeft: makeSpace(get(theme, paddings[variant].horizontal.mobile.left[size!])),
    paddingRight: makeSpace(get(theme, paddings[variant].horizontal.mobile.right[size!])),
  };
});

const TabItem = (_props: TabItemProps): React.ReactElement => {
  return <></>;
};

export { TabItem, StyledTabButton };
