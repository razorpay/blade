import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import BaseBox from '~components/Box/BaseBox';
import { Text, Heading } from '~components/Typography';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type BottomSheetHeaderTrailingProps = {
  visual: React.ReactNode;
};

type BottomSheetHeaderProps = {
  title: string;
  subtitle?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const _BottomSheetHeader = ({
  prefix,
  suffix,
  title,
  subtitle,
}: BottomSheetHeaderProps): React.ReactElement => {
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
        <BaseBox
          flex={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          userSelect="none"
          maxWidth="90%"
        >
          <BaseBox
            marginRight="spacing.4"
            marginTop="spacing.2"
            alignSelf="flex-start"
            display="flex"
          >
            {prefix}
          </BaseBox>
          <BaseBox>
            <BaseBox display="flex" flexDirection="row" alignItems="center">
              <Heading size="small" variant="regular" type="normal">
                {title}
              </Heading>
              <BaseBox marginLeft="spacing.3">{suffix}</BaseBox>
            </BaseBox>
            {subtitle && (
              <Text variant="body" size="small" weight="regular">
                {subtitle}
              </Text>
            )}
          </BaseBox>
        </BaseBox>
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
  BottomSheetHeaderProps,
  BottomSheetHeaderTrailingProps,
};
