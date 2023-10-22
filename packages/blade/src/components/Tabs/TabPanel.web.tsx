/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { TabPanelProps } from './types';
import { useTabsContext } from './TabsContext';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';

const TabPanel = ({ children, value }: TabPanelProps): React.ReactElement => {
  const { selectedValue, baseId, isLazy } = useTabsContext();
  const isSelected = selectedValue === value;
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;

  if (isLazy) {
    return (
      <>
        {isSelected ? (
          <BaseBox
            id={panelId}
            tabIndex={0}
            {...makeAccessible({ role: 'tabpanel', labelledBy: tabItemId })}
          >
            {children}
          </BaseBox>
        ) : null}
      </>
    );
  }

  return (
    <BaseBox
      id={panelId}
      tabIndex={0}
      display={isSelected ? 'block' : 'none'}
      {...makeAccessible({ role: 'tabpanel', labelledBy: tabItemId, hidden: !isSelected })}
    >
      {children}
    </BaseBox>
  );
};

export { TabPanel };
