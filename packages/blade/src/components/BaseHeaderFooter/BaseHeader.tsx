/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon, CloseIcon } from '~components/Icons';
import type { TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { isReactNative } from '~utils';
import { metaAttribute } from '~utils/metaAttribute';
import { logger, throwBladeError } from '~utils/logger';

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
  closeButtonRef?: React.MutableRefObject<any>;
  metaComponentName?: string;
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
> &
  TestID;

type TrailingComponents = 'Button' | 'Badge' | 'Link' | 'Text' | 'Amount';

const centerBoxProps: BoxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // We want to align title, icon, titleSuffix, trailing, closeButton to baseline
  // But we also want to keep them center aligned to each other
  // So we add a virtual Box around these slots with 28px and center align them to that box
  // We have done similar thing in figma as well (which is where this 28px comes from)
  height: '28px',
};

// prop restriction map for corresponding sub components
const propRestrictionMap = {
  Button: {
    size: 'xsmall',
    variant: 'tertiary',
  },
  Badge: {
    size: 'medium',
  },
  Link: {
    size: 'medium',
  },
  Text: {
    size: 'medium',
    variant: 'body',
  },
  Amount: {
    size: 'body-medium',
  },
} as const;

const useTrailingRestriction = (trailing: React.ReactNode): React.ReactNode => {
  const [
    validatedTrailingComponent,
    setValidatedTrailingComponent,
  ] = React.useState<React.ReactElement | null>(null);

  // validate and restrict sub component props in trailing prop
  React.useEffect(() => {
    if (React.isValidElement(trailing)) {
      const trailingComponentType = getComponentId(trailing) as TrailingComponents;
      const restrictedProps = propRestrictionMap[trailingComponentType];
      const allowedComponents = Object.keys(propRestrictionMap);
      if (__DEV__) {
        if (!restrictedProps) {
          throwBladeError({
            message: `Only one of \`${allowedComponents.join(
              ', ',
            )}\` component is accepted as trailing`,
            moduleName: 'Header',
          });
        }
      }

      const restrictedPropKeys = Object.keys(propRestrictionMap[trailingComponentType]);
      for (const prop of restrictedPropKeys) {
        if (trailing?.props?.hasOwnProperty(prop)) {
          logger({
            message: `Do not pass "${prop}" to "${trailingComponentType}" while inside Header trailing, because we override it.`,
            moduleName: 'Header',
            type: 'warn',
          });
        }
      }
      setValidatedTrailingComponent(
        React.cloneElement(trailing as React.ReactElement, restrictedProps),
      );
    }
  }, [trailing]);

  return validatedTrailingComponent;
};

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
  testID,
  onClickCapture,
  onKeyDown,
  onKeyUp,
  onLostPointerCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  metaComponentName,
}: BaseHeaderProps): React.ReactElement => {
  const validatedTrailingComponent = useTrailingRestriction(trailing);
  const shouldWrapTitle = titleSuffix && trailing && showBackButton && showCloseButton;

  const webOnlyEventHandlers: Record<string, any> = isReactNative()
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

  return (
    <BaseBox {...metaAttribute({ name: metaComponentName, testID })}>
      <BaseBox
        // marginY={{ base: 'spacing.5', m: 'spacing.6' }}
        // paddingX={{ base: 'spacing.5', m: 'spacing.6' }}
        touchAction="none"
        {...webOnlyEventHandlers}
      >
        <BaseBox display="flex" flexDirection="row" userSelect="none">
          {showBackButton ? (
            <BaseBox overflow="visible" marginRight="spacing.5">
              <Box {...centerBoxProps}>
                <IconButton
                  size="large"
                  icon={ChevronLeftIcon}
                  onClick={() => onBackButtonClick?.()}
                  accessibilityLabel="Back"
                />
              </Box>
            </BaseBox>
          ) : null}
          <BaseBox
            paddingRight="spacing.5"
            marginRight="auto"
            flex="auto"
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
          >
            {leading ? (
              <BaseBox
                width="spacing.8"
                height="spacing.8"
                marginRight="spacing.3"
                {...centerBoxProps}
              >
                {leading}
              </BaseBox>
            ) : null}
            <BaseBox flex="auto">
              <BaseBox
                // Explicitly setting maxWidth in React Native because text is not being wrapped properly when multiple fix width components are rendered in header
                // In web, flex containers seem to work a expected
                // @todo: resolve this if we figure out some better solution later
                maxWidth={isReactNative() && shouldWrapTitle ? '100px' : undefined}
                flexShrink={0}
                display="flex"
                flexDirection="row"
              >
                {title ? (
                  <Heading size="small" variant="regular" type="normal">
                    {title}
                  </Heading>
                ) : null}
                {titleSuffix && (
                  <BaseBox marginLeft="spacing.3">
                    <Box {...centerBoxProps}>{titleSuffix}</Box>
                  </BaseBox>
                )}
              </BaseBox>
              {subtitle ? (
                <Text variant="body" size="small" weight="regular" type="muted">
                  {subtitle}
                </Text>
              ) : null}
            </BaseBox>
          </BaseBox>
          {validatedTrailingComponent ? (
            <BaseBox marginRight="spacing.5">
              <Box {...centerBoxProps}>{validatedTrailingComponent}</Box>
            </BaseBox>
          ) : null}
          {showCloseButton ? (
            <Box {...centerBoxProps}>
              <IconButton
                ref={closeButtonRef}
                size="large"
                icon={CloseIcon}
                accessibilityLabel="Close"
                onClick={() => onCloseButtonClick?.()}
              />
            </Box>
          ) : null}
        </BaseBox>
      </BaseBox>
      {showDivider ? <Divider /> : null}
    </BaseBox>
  );
};

const BaseHeader = assignWithoutSideEffects(_BaseHeader, {
  componentId: 'BaseHeader',
});

export { BaseHeader, BaseHeaderProps };
