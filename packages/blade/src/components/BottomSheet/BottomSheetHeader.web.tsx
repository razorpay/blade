import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import BaseBox from '~components/Box/BaseBox';
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

type BottomSheetHeaderProps = {
  title: string;
  leading?: React.ReactNode;
};

const _BottomSheetHeader = ({ leading, title }: BottomSheetHeaderProps): React.ReactElement => {
  const { setHeaderHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  return (
    <BaseBox as="div" ref={ref} data-testid="bottomsheet-header" overflow="auto" flexShrink={0}>
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
  BottomSheetHeaderTrailingProps,
};
