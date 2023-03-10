/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import type { WithComponentId } from '~utils';
import BaseBox from '~components/Box/BaseBox';

const BottomSheetBody: WithComponentId<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BaseBox
      style={{
        flexShrink: 1,
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <BaseBox
        marginLeft="spacing.3"
        marginRight="spacing.3"
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        data-content
        overflow="hidden"
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};
BottomSheetBody.componentId = ComponentIds.BottomSheetBody;

export { BottomSheetBody };
