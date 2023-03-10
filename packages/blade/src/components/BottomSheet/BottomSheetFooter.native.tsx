/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import { Divider } from './Divider.native';
import type { BottomSheetFooterProps } from './BottomSheetFooter.web';
import { BottomSheetFooterLeading, BottomSheetFooterTrailing } from './BottomSheetFooter.web';
import { ComponentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { WithComponentId } from '~utils';

const BottomSheetFooter: WithComponentId<BottomSheetFooterProps> = ({
  title,
  leading,
  trailing,
}) => {
  const { theme } = useTheme();
  return (
    <BaseBox
      data-footer
      width="100%"
      flexShrink={0}
      marginTop="auto"
      backgroundColor={theme.colors.surface.background.level2.lowContrast}
      touchAction="none"
      zIndex={2}
    >
      <Divider />
      <BaseBox
        marginLeft="spacing.6"
        marginRight="spacing.6"
        marginTop="spacing.5"
        marginBottom="spacing.5"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <BottomSheetFooterLeading title={title} prefix={leading} />
        <BottomSheetFooterTrailing hasLeading={Boolean(leading)} actions={trailing} />
      </BaseBox>
    </BaseBox>
  );
};
BottomSheetFooter.componentId = ComponentIds.BottomSheetFooter;

export { BottomSheetFooter, BottomSheetFooterLeading, BottomSheetFooterTrailing };
