import React from 'react';

import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

import { ComponentIds } from './componentIds';

import type { BottomSheetFooterProps } from './types';

const _BottomSheetFooter = ({ children }: BottomSheetFooterProps): React.ReactElement => {
  return (
    <BaseBox
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor="popup.background.gray.subtle"
      touchAction="none"
      zIndex={2}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

const BottomSheetFooter = assignWithoutSideEffects(_BottomSheetFooter, {
  componentId: ComponentIds.BottomSheetFooter,
});

export { BottomSheetFooter };
