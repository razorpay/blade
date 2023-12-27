import React from 'react';
import type { BottomSheetFooterProps } from './types';
import { ComponentIds } from './componentIds';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BottomSheetFooter = ({ children }: BottomSheetFooterProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor={theme.colors.popup.background.subtle}
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
