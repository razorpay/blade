/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { TabPanelProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TabPanel = ({ children, value }: TabPanelProps): React.ReactElement => {
  return <BaseBox>{children}</BaseBox>;
};

const TabPanel = assignWithoutSideEffects(_TabPanel, { componentId: 'TabPanel' });

export { TabPanel };
