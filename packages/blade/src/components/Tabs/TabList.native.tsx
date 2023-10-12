import React from 'react';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TabList = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return <>{children}</>;
};

const TabList = assignWithoutSideEffects(_TabList, { componentId: 'TabList' });

export { TabList };
