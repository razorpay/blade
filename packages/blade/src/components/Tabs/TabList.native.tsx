import React from 'react';
import { componentIds } from './utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TabList = (_props: { children: React.ReactNode }): React.ReactElement => {
  return <></>;
};

const TabList = assignWithoutSideEffects(_TabList, { componentId: componentIds.TabList });

export { TabList };
