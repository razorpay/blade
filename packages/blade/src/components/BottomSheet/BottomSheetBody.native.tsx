/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const _BottomSheetBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
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

const BottomSheetBody = assignWithoutSideEffects(_BottomSheetBody, {
  componentId: ComponentIds.BottomSheetBody,
});

export { BottomSheetBody };
