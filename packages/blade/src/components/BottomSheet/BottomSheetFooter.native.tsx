import React from 'react';
import { BaseFooter } from '../BaseHeaderFooter/BaseFooter';
import type { BottomSheetFooterProps } from './types';
import { ComponentIds } from './componentIds';
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
      backgroundColor={theme.colors.surface.background.level2.lowContrast}
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
