/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { TabPanelProps } from './types';
import { componentIds } from './utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TabPanel = (_props: TabPanelProps): React.ReactElement => {
  return <></>;
};

const TabPanel = assignWithoutSideEffects(_TabPanel, { componentId: componentIds.TabPanel });

export { TabPanel };
