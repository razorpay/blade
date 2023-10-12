/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { TabPanelProps } from './types';
import { useTabsContext } from './TabsContext';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';

const TabPanel = ({ children, value }: TabPanelProps): React.ReactElement => {
  const { selectedValue, baseId } = useTabsContext();
  const isSelected = selectedValue === value;
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;

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
};

export { TabPanel };
