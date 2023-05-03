import React from 'react';
import { ComponentIds } from './componentIds';
import { Divider } from './Divider';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import { BottomSheetCloseButton } from './BottomSheetCloseButton';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { Heading, Text } from '~components/Typography';
import { ChevronLeftIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';

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
  return (
    <BaseBox backgroundColor="white" overflow="visible" flexShrink={0}>
      <BaseBox
        overflow="visible"
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        touchAction="none"
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
              >
                {prefix}
              </BaseBox>
            )}
            <BaseBox width="90%">
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

export { BottomSheetGrabHandle, BottomSheetHeader, BottomSheetHeaderProps };
