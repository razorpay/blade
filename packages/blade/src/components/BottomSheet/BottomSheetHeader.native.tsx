import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider.native';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle.native';
import { BottomSheetHeaderLeading, BottomSheetHeaderTrailing } from './BottomSheetHeader.web';
import BaseBox from '~components/Box/BaseBox';
import type { WithComponentId } from '~utils';

type BottomSheetHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const BottomSheetHeader: WithComponentId<BottomSheetHeaderProps> = ({
  leading,
  trailing,
  title,
}): React.ReactElement => {
  return (
    <BaseBox backgroundColor="white" overflow="visible" flexShrink={0}>
      <BaseBox
        data-header
        overflow="visible"
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.6"
        paddingRight="spacing.6"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        touchAction="none"
      >
        <BottomSheetHeaderLeading title={title} prefix={leading} />
        <BottomSheetHeaderTrailing visual={trailing} />
      </BaseBox>
      <Divider />
    </BaseBox>
  );
};
BottomSheetHeader.componentId = ComponentIds.BottomSheetHeader;

export {
  BottomSheetGrabHandle,
  BottomSheetHeader,
  BottomSheetHeaderLeading,
  BottomSheetHeaderProps,
  BottomSheetHeaderTrailing,
};
