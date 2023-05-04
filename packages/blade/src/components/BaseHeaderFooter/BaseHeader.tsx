import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { assignWithoutSideEffects, isReactNative } from '~utils';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon, CloseIcon } from '~components/Icons';

export type BaseHeaderProps = {
  title?: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  hideDivider?: boolean;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  onBackButtonClick?: () => void;
  closeButtonRef: React.MutableRefObject<HTMLButtonElement>;
} & Pick<
  ReactDOMAttributes,
  | 'onClickCapture'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onLostPointerCapture'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
>;

const _BaseHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  hideDivider = false,
  showBackButton = false,
  showCloseButton = true,
  onBackButtonClick,
  onCloseButtonClick,
  closeButtonRef,
  onClickCapture,
  onKeyDown,
  onKeyUp,
  onLostPointerCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BaseHeaderProps): React.ReactElement => {
  return (
    <>
      <BaseBox
        marginTop="spacing.5"
        marginBottom="spacing.5"
        paddingLeft="spacing.5"
        paddingRight="spacing.5"
        touchAction="none"
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onLostPointerCapture={onLostPointerCapture}
        onPointerCancel={onPointerCancel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
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
            {leading && (
              <BaseBox
                width="spacing.8"
                height="spacing.8"
                flexShrink={0}
                marginRight="spacing.3"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                {leading}
              </BaseBox>
            )}
            <BaseBox width={isReactNative() ? '90%' : '100%'}>
              <BaseBox flexShrink={0} display="flex" flexDirection="row" alignItems="center">
                {title && (
                  <Heading size="small" variant="regular" type="normal">
                    {title}
                  </Heading>
                )}
                {titleSuffix && <BaseBox marginLeft="spacing.3">{titleSuffix}</BaseBox>}
              </BaseBox>
              {subtitle && (
                <Text variant="body" size="small" weight="regular">
                  {subtitle}
                </Text>
              )}
            </BaseBox>
          </BaseBox>
          {trailing && <BaseBox marginRight="spacing.5">{trailing}</BaseBox>}
          {showCloseButton && (
            <IconButton
              ref={closeButtonRef}
              size="large"
              icon={CloseIcon}
              accessibilityLabel="Close"
              onClick={() => onCloseButtonClick?.()}
            />
          )}
        </BaseBox>
      </BaseBox>
      {!hideDivider && <Divider />}
    </>
  );
};

const BaseHeader = assignWithoutSideEffects(_BaseHeader, {
  componentId: 'BaseHeader',
});

export { BaseHeader };
