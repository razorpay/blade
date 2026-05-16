/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';

import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

import { componentIds } from './utils';

import type { TabPanelProps } from './types';

const _TabPanel = (_props: TabPanelProps): React.ReactElement => {
  return <></>;
};

const TabPanel = assignWithoutSideEffects(_TabPanel, { componentId: componentIds.TabPanel });

export { TabPanel };
