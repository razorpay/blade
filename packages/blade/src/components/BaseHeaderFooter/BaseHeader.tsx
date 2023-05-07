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
    <BaseBox>
      <BaseBox
        marginTop="spacing.4"
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
        <BaseBox display="flex" flexDirection="row" alignItems="center" userSelect="none">
          {showBackButton ? (
            <BaseBox overflow="visible" marginRight="spacing.5">
              <IconButton
                size="large"
                icon={ChevronLeftIcon}
                onClick={() => onBackButtonClick?.()}
                accessibilityLabel="Back"
              />
            </BaseBox>
          ) : null}
          <BaseBox
            paddingRight="spacing.5"
            marginRight="auto"
            flex="auto"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            {leading ? (
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
            ) : null}
            <BaseBox>
              <BaseBox flexShrink={0} display="flex" flexDirection="row" alignItems="center">
                {title ? (
                  <Heading size="small" variant="regular" type="normal">
                    {title}
                  </Heading>
                ) : null}
                {titleSuffix && <BaseBox marginLeft="spacing.3">{titleSuffix}</BaseBox>}
              </BaseBox>
              {subtitle ? (
                <Text variant="body" size="small" weight="regular">
                  {subtitle}
                </Text>
              ) : null}
            </BaseBox>
          </BaseBox>
          {trailing ? <BaseBox marginRight="spacing.5">{trailing}</BaseBox> : null}
          {showCloseButton ? (
            <IconButton
              ref={closeButtonRef}
              size="large"
              icon={CloseIcon}
              accessibilityLabel="Close"
              onClick={() => onCloseButtonClick?.()}
            />
          ) : null}
        </BaseBox>
      </BaseBox>
      {hideDivider ? null : <Divider />}
    </BaseBox>
  );
};

const BaseHeader = assignWithoutSideEffects(_BaseHeader, {
  componentId: 'BaseHeader',
});

export { BaseHeader };
