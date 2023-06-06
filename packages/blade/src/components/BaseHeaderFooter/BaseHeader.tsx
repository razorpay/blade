/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Divider } from './Divider';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { assignWithoutSideEffects, isReactNative, makeSize, metaAttribute } from '~utils';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon, CloseIcon } from '~components/Icons';
import { size } from '~tokens/global';
import { useTheme } from '~components/BladeProvider';

type BaseHeaderProps = {
  title?: string;
  subtitle?: string;
  /**
   * Leading part of the header placed at the left most side of the header
   */
  leading?: React.ReactNode;
  /**
   * Trailing part of the header placed at the right most side of the header
   */
  trailing?: React.ReactNode;
  /**
   * Placed adjacent to the title text
   */
  titleSuffix?: React.ReactNode;
  /**
   * @default true
   */
  showDivider?: boolean;
  /**
   * @default false
   */
  showBackButton?: boolean;
  /**
   * @default true
   */
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  onBackButtonClick?: () => void;
  closeButtonRef: React.MutableRefObject<any>;
  metaDataComponentName?: string;
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
  showDivider = true,
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
  metaDataComponentName,
}: BaseHeaderProps): React.ReactElement => {
  const { theme } = useTheme();
  const webOnlyEventHandlers = isReactNative()
    ? {}
    : {
        onClickCapture,
        onKeyDown,
        onKeyUp,
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      };

  const isHeaderEmpty = !title && !subtitle && !leading && !trailing && !titleSuffix;

  return (
    <BaseBox {...metaAttribute({ name: metaDataComponentName })}>
      {isHeaderEmpty ? (
        <BaseBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          right="spacing.5"
          top="spacing.5"
          width={makeSize(size[28])}
          height={makeSize(size[28])}
          flexShrink={0}
          backgroundColor={theme.colors.surface.background.level2.lowContrast}
          borderRadius="max"
        >
          <IconButton
            ref={closeButtonRef}
            size="large"
            icon={CloseIcon}
            accessibilityLabel="Close"
            onClick={() => onCloseButtonClick?.()}
          />
        </BaseBox>
      ) : (
        <>
          <BaseBox
            marginTop="spacing.4"
            marginBottom="spacing.5"
            paddingLeft="spacing.5"
            paddingRight="spacing.5"
            touchAction="none"
            {...webOnlyEventHandlers}
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
          {showDivider ? <Divider /> : null}
        </>
      )}
    </BaseBox>
  );
};

const BaseHeader = assignWithoutSideEffects(_BaseHeader, {
  componentId: 'BaseHeader',
});

export { BaseHeader, BaseHeaderProps };
