import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type BottomSheetHeaderLeadingProps = {
  title: string;
  prefix: React.ReactNode;
};

const _BottomSheetHeaderLeading = ({
  title,
  prefix,
}: BottomSheetHeaderLeadingProps): React.ReactElement => {
  return (
    <BaseBox flex={1} display="flex" flexDirection="row" alignItems="center" userSelect="none">
      <BaseBox marginRight="spacing.4" alignSelf="center" display="flex">
        {prefix}
      </BaseBox>
      <BaseBox>
        <Text variant="body" weight="bold" type="normal" contrast="low">
          {title}
        </Text>
      </BaseBox>
    </BaseBox>
  );
};
const BottomSheetHeaderLeading = assignWithoutSideEffects(_BottomSheetHeaderLeading, {
  componentId: ComponentIds.BottomSheetHeaderLeading,
});

type BottomSheetHeaderTrailingProps = {
  visual: React.ReactNode;
};

const _BottomSheetHeaderTrailing = ({
  visual,
}: BottomSheetHeaderTrailingProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();

  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center">
      <BaseBox marginRight="spacing.4" alignSelf="center" display="flex">
        {visual}
      </BaseBox>
      <BaseBox>
        <IconButton
          ref={defaultInitialFocusRef}
          onClick={() => {
            close();
          }}
          icon={CloseIcon}
          accessibilityLabel="Close BottomSheet"
        />
      </BaseBox>
    </BaseBox>
  );
};
const BottomSheetHeaderTrailing = assignWithoutSideEffects(_BottomSheetHeaderTrailing, {
  componentId: ComponentIds.BottomSheetHeaderTrailing,
});

type BottomSheetHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const _BottomSheetHeader = ({
  leading,
  trailing,
  title,
}: BottomSheetHeaderProps): React.ReactElement => {
  const { setHeaderHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  return (
    <BaseBox as="div" ref={ref} overflow="auto" flexShrink={0}>
      <BaseBox
        as="div"
        data-header
        overflow="auto"
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.6"
        paddingRight="spacing.6"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        touchAction="none"
        {...bind?.()}
      >
        <BottomSheetHeaderLeading title={title} prefix={leading} />
        <BottomSheetHeaderTrailing visual={trailing} />
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
  BottomSheetHeaderLeadingProps,
  BottomSheetHeaderProps,
  BottomSheetHeaderTrailing,
  BottomSheetHeaderTrailingProps,
};
