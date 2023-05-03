import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { useBottomSheetContext } from './BottomSheetContext';
import { BottomSheetCloseButton } from './BottomSheetCloseButton';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon } from '~components/Icons';

type BottomSheetHeaderTrailingProps = {
  visual: React.ReactNode;
};

type BottomSheetHeaderProps = {
  title?: string;
  subtitle?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trailing?: React.ReactNode;
  hideDivider?: boolean;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
};

const _BottomSheetHeader = ({
  title,
  subtitle,
  prefix,
  suffix,
  trailing,
  hideDivider = false,
  showBackButton = false,
  onBackButtonClick,
}: BottomSheetHeaderProps): React.ReactElement => {
  const { setHeaderHeight, isOpen, bind } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  return (
    <BaseBox ref={ref} overflow="auto" flexShrink={0}>
      <BaseBox
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        touchAction="none"
        {...bind?.()}
      >
        <BaseBox flex={1} display="flex" flexDirection="row" alignItems="center" userSelect="none">
          {showBackButton && (
            <BaseBox overflow="visible" marginRight="spacing.5">
              <IconButton
                size="large"
                icon={ChevronLeftIcon}
                onClick={() => onBackButtonClick?.()}
                accessibilityLabel="Back"
              />
            </BaseBox>
          )}
          <BaseBox
            paddingRight="spacing.5"
            marginRight="auto"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            {prefix && (
              <BaseBox
                width="spacing.8"
                height="spacing.8"
                flexShrink={0}
                marginRight="spacing.3"
                justifyContent="center"
                alignItems="center"
                display="flex"
                backgroundColor="surface.background.level1.lowContrast"
              >
                {prefix}
              </BaseBox>
            )}
            <BaseBox>
              <BaseBox flexShrink={0} display="flex" flexDirection="row" alignItems="center">
                {title && (
                  <Heading size="small" variant="regular" type="normal">
                    {title}
                  </Heading>
                )}
                {suffix && <BaseBox marginLeft="spacing.3">{suffix}</BaseBox>}
              </BaseBox>
              {subtitle && (
                <Text variant="body" size="small" weight="regular">
                  {subtitle}
                </Text>
              )}
            </BaseBox>
          </BaseBox>
          <BaseBox marginRight="spacing.5">{trailing}</BaseBox>
          <BottomSheetCloseButton />
        </BaseBox>
      </BaseBox>
      {!hideDivider && <Divider />}
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export { BottomSheetHeader, BottomSheetHeaderProps, BottomSheetHeaderTrailingProps };
