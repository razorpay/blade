/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import { ChevronLeftIcon, CloseIcon } from '~components/Icons';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { isReactNative, makeSize } from '~utils';
import { metaAttribute } from '~utils/metaAttribute';
import { logger, throwBladeError } from '~utils/logger';
import { size as sizeToken } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
   * Slot for rendering any trailing interaction element into BaseHeader.
   *
   * E.g. Used in accordion to render CollapsibleChevronIcon
   */
  trailingInteractionElement?: React.ReactNode;

  /**
   * Decides size of the Header
   */
  size?: 'large' | 'medium';
  /**
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Disabled state of BaseHeader
   *
   * @default false
   */
  isDisabled?: boolean;

  paddingX?: BoxProps['paddingX'];
  marginY?: BoxProps['marginY'];
  marginTop?: BoxProps['marginTop'];
  marginBottom?: BoxProps['marginBottom'];
  onCloseButtonClick?: () => void;
  onBackButtonClick?: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  backButtonRef?: React.MutableRefObject<any>;
  metaComponentName?: string;
  /**
   * inner child of BottomSheetHeader. Meant to be used for AutoComplete only
   */
  children?: React.ReactElement | React.ReactElement[];
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
  TestID &
  DataAnalyticsAttribute;

type TrailingComponents = 'Button' | 'Badge' | 'Link' | 'Text' | 'Amount';

const commonCenterBoxProps: BoxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const centerBoxProps: { large: BoxProps; medium: BoxProps } = {
  large: {
    ...commonCenterBoxProps,
    // We want to align title, icon, titleSuffix, trailing, closeButton to baseline
    // But we also want to keep them center aligned to each other
    // So we add a virtual Box around these slots with 28px and center align them to that box
    // We have done similar thing in figma as well (which is where this 28px comes from)
    height: '28px',
  },
  medium: {
    ...commonCenterBoxProps,
    height: '20px',
  },
};

const sizeTokensMapping = {
  large: {
    title: 'large',
  },
  medium: {
    title: 'medium',
  },
} as const;

// prop restriction map for corresponding sub components
const propRestrictionMap = {
  large: {
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
      type: 'body',
      size: 'medium',
    },
  },
  medium: {
    Button: {
      size: 'xsmall',
      variant: 'tertiary',
    },
    Badge: {
      size: 'small',
    },
    Link: {
      size: 'small',
    },
    Text: {
      size: 'small',
      variant: 'body',
    },
    Amount: {
      type: 'body',
      size: 'small',
    },
  },
} as const;

const useTrailingRestriction = ({
  trailing,
  size,
}: {
  size: NonNullable<BaseHeaderProps['size']>;
  trailing: BaseHeaderProps['trailing'];
}): React.ReactNode => {
  const [
    validatedTrailingComponent,
    setValidatedTrailingComponent,
  ] = React.useState<React.ReactElement | null>(null);

  // validate and restrict sub component props in trailing prop
  React.useEffect(() => {
    if (React.isValidElement(trailing)) {
      const trailingComponentType = getComponentId(trailing) as TrailingComponents;
      const restrictedProps = propRestrictionMap[size][trailingComponentType];
      const allowedComponents = Object.keys(propRestrictionMap[size]);
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

      const restrictedPropKeys = Object.keys(propRestrictionMap[size][trailingComponentType]);
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
  }, [trailing, size]);

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
  backButtonRef,
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
  paddingX,
  marginY,
  marginBottom,
  marginTop,
  size = 'large',
  isDisabled,
  children,
  trailingInteractionElement,
  ...rest
}: BaseHeaderProps): React.ReactElement => {
  const validatedTrailingComponent = useTrailingRestriction({ trailing, size });
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
    <BaseBox
      {...metaAttribute({ name: metaComponentName, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        marginY={marginY ?? { base: 'spacing.5', m: 'spacing.6' }}
        paddingX={paddingX ?? { base: 'spacing.5', m: 'spacing.6' }}
        marginTop={marginTop}
        marginBottom={marginBottom}
        touchAction="none"
        {...webOnlyEventHandlers}
      >
        <BaseBox display="flex" flexDirection="row" userSelect="none">
          {showBackButton ? (
            <BaseBox overflow="visible" marginRight="spacing.5">
              <Box {...centerBoxProps[size]}>
                <IconButton
                  ref={backButtonRef}
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
              <BaseBox marginRight="spacing.3" {...centerBoxProps[size]}>
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
                  <Text
                    size={sizeTokensMapping[size].title}
                    marginTop={makeSize(sizeToken['1'])}
                    weight="semibold"
                    color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.normal'}
                    wordBreak="break-word"
                  >
                    {title}
                  </Text>
                ) : null}
                {titleSuffix && (
                  <BaseBox marginLeft="spacing.3">
                    <Box {...centerBoxProps[size]}>{titleSuffix}</Box>
                  </BaseBox>
                )}
              </BaseBox>
              {subtitle ? (
                <Text
                  variant="body"
                  size="small"
                  weight="regular"
                  color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
                >
                  {subtitle}
                </Text>
              ) : null}
            </BaseBox>
          </BaseBox>
          {validatedTrailingComponent ? (
            <BaseBox marginRight="spacing.5">
              <Box {...centerBoxProps[size]}>{validatedTrailingComponent}</Box>
            </BaseBox>
          ) : null}
          {showCloseButton ? (
            <Box {...centerBoxProps[size]}>
              <IconButton
                ref={closeButtonRef}
                size="large"
                icon={CloseIcon}
                accessibilityLabel="Close"
                onClick={() => onCloseButtonClick?.()}
              />
            </Box>
          ) : null}
          {trailingInteractionElement && !children ? (
            <Box {...centerBoxProps[size]}>{trailingInteractionElement}</Box>
          ) : null}
        </BaseBox>
        <BaseBox
          display="flex"
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box width="100%">{children}</Box>
          {trailingInteractionElement && children ? (
            <Box alignSelf="flex-start" {...centerBoxProps[size]}>
              {trailingInteractionElement}
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

export type { BaseHeaderProps };
export { BaseHeader };
