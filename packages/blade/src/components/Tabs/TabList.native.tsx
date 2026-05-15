import React from 'react';

import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

import { componentIds } from './utils';

const _TabList = (_props: { children: React.ReactNode }): React.ReactElement => {
  return <></>;
};

const TabList = assignWithoutSideEffects(_TabList, { componentId: componentIds.TabList });

export { TabList };
