import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider.native';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle.native';
import { BottomSheetHeaderLeading } from './BottomSheetHeader.web';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type BottomSheetHeaderProps = {
  title: string;
  leading?: React.ReactNode;
};

const _BottomSheetHeader = ({ leading, title }: BottomSheetHeaderProps): React.ReactElement => {
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
      </BaseBox>
      <Divider />
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export {
  BottomSheetGrabHandle,
  BottomSheetHeader,
  BottomSheetHeaderLeading,
  BottomSheetHeaderProps,
};
