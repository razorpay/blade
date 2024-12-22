/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { TabPanelProps } from './types';
import { useTabsContext } from './TabsContext';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const TabPanel = ({ children, value, ...rest }: TabPanelProps): React.ReactElement => {
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
            {...metaAttribute({ name: MetaConstants.TabPanel })}
            {...makeAccessible({ role: 'tabpanel', labelledBy: tabItemId })}
            {...makeAnalyticsAttribute(rest)}
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
      {...metaAttribute({ name: MetaConstants.TabPanel })}
      {...makeAccessible({ role: 'tabpanel', labelledBy: tabItemId, hidden: !isSelected })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { TabPanel };
