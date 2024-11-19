/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { ReactElement } from 'react';
import type { BaseInputProps } from './BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { BaseBoxProps, SpacingValueType } from '~components/Box/BaseBox';
import type { IconColors } from '~components/Icons';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import { Tooltip } from '~components/Tooltip';
import { Box } from '~components/Box';
import { isReactNative } from '~utils';

type InputVisuals = Pick<
  BaseInputProps,
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'onTrailingInteractionElementClick'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'isDisabled'
  | 'validationState'
  | 'size'
  | 'trailingButton'
  | 'showHintsAsTooltip'
  | 'errorText'
  | 'successText'
> & {
  size: NonNullable<BaseInputProps['size']>;
};

const getVisualContainerStyles = ({
  shouldStretchTrailingBox,
}: {
  shouldStretchTrailingBox?: boolean;
} = {}): Pick<BaseBoxProps, 'display' | 'flexDirection' | 'alignItems' | 'alignSelf'> => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: shouldStretchTrailingBox ? 'stretch' : 'center',
});

const trailingIconColor: Record<NonNullable<InputVisuals['validationState']>, IconColors> = {
  none: 'surface.icon.gray.subtle',
  error: 'feedback.icon.negative.intense',
  success: 'feedback.icon.positive.intense',
};

const iconSize = {
  medium: 'medium',
  large: 'large',
} as const;

const textSize = {
  medium: 'medium',
  large: 'large',
} as const;

const getPrefixStyles = ({
  hasLeadingIcon,
  hasPrefix,
}: {
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
}): Pick<BaseBoxProps, 'paddingLeft'> => {
  if (hasPrefix && hasLeadingIcon) {
    return {
      paddingLeft: 'spacing.3',
    };
  }

  if (hasPrefix && !hasLeadingIcon) {
    return {
      paddingLeft: 'spacing.4',
    };
  }

  return {
    paddingLeft: 'spacing.0',
  };
};

const getInteractionElementStyles = ({
  hasTrailingIcon,
  hasLeadingInteractionElement,
  hasTrailingInteractionElement,
  hasSuffix,
  hasTrailingButton,
}: {
  hasTrailingIcon: boolean;
  hasLeadingInteractionElement?: boolean;
  hasTrailingInteractionElement?: boolean;
  hasSuffix: boolean;
  hasTrailingButton: boolean;
}): SpacingValueType => {
  if (hasTrailingInteractionElement && (hasSuffix || hasTrailingIcon || hasTrailingButton)) {
    return 'spacing.2';
  }

  if (hasTrailingInteractionElement && !hasSuffix && !hasTrailingIcon && !hasTrailingButton) {
    return 'spacing.4';
  }

  if (hasLeadingInteractionElement) {
    return 'spacing.3';
  }

  return 'spacing.0';
};

const getSuffixStyles = ({
  hasTrailingIcon,
  hasSuffix,
  hasTrailingButton,
}: {
  hasTrailingIcon: boolean;
  hasSuffix: boolean;
  hasTrailingButton: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasSuffix && (hasTrailingIcon || hasTrailingButton)) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  if (hasSuffix && !hasTrailingIcon && !hasTrailingButton) {
    return {
      paddingRight: 'spacing.4',
    };
  }

  return {
    paddingRight: 'spacing.0',
  };
};

const getTrailingIconStyles = ({
  hasTrailingIcon,
  hasTrailingButton,
}: {
  hasTrailingIcon: boolean;
  hasTrailingButton: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasTrailingIcon && hasTrailingButton) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  if (hasTrailingIcon && !hasTrailingButton) {
    return {
      paddingRight: 'spacing.4',
    };
  }

  return {
    paddingRight: 'spacing.0',
  };
};

export const getInputVisualsToBeRendered = ({
  leadingIcon,
  prefix,
  trailingInteractionElement,
  leadingInteractionElement,
  suffix,
  trailingIcon,
  trailingButton,
}: InputVisuals) => ({
  hasLeadingIcon: Boolean(leadingIcon),
  hasPrefix: Boolean(prefix),
  hasTrailingInteractionElement: Boolean(trailingInteractionElement),
  hasLeadingInteractionElement: Boolean(leadingInteractionElement),
  hasSuffix: Boolean(suffix),
  hasTrailingIcon: Boolean(trailingIcon),
  hasTrailingButton: Boolean(trailingButton),
});

const getTooltipContent = ({
  validationState,
  errorText,
  successText,
}: {
  validationState: BaseInputProps['validationState'];
  errorText: BaseInputProps['errorText'];
  successText: BaseInputProps['errorText'];
}): string => {
  if (validationState === 'error' && errorText) {
    return errorText;
  }

  if (validationState === 'success' && successText) {
    return successText;
  }

  return '';
};

const ValidationIconTooltip = ({
  children,
  validationState,
  errorText,
  successText,
  showHintsAsTooltip,
}: {
  children: ReactElement;
  validationState: BaseInputProps['validationState'];
  errorText: BaseInputProps['errorText'];
  successText: BaseInputProps['errorText'];
  showHintsAsTooltip: BaseInputProps['showHintsAsTooltip'];
}) => {
  if (
    (showHintsAsTooltip && validationState === 'error' && errorText) ||
    (validationState === 'success' && successText)
  ) {
    return (
      <Tooltip content={getTooltipContent({ validationState, errorText, successText })}>
        <Box display="flex" justifyContent="center" alignItems="center">
          {children}
        </Box>
      </Tooltip>
    );
  }

  return children;
};

export const BaseInputVisuals = ({
  leadingIcon: LeadingIcon,
  prefix,
  trailingInteractionElement,
  onTrailingInteractionElementClick,
  leadingInteractionElement,
  suffix,
  trailingIcon: TrailingIcon,
  isDisabled,
  validationState = 'none',
  size,
  showHintsAsTooltip,
  errorText,
  successText,
  trailingButton: TrailingButton,
}: InputVisuals): ReactElement | null => {
  const {
    hasLeadingIcon,
    hasPrefix,
    hasSuffix,
    hasTrailingInteractionElement,
    hasLeadingInteractionElement,
    hasTrailingIcon,
    hasTrailingButton,
  } = getInputVisualsToBeRendered({
    leadingIcon: LeadingIcon,
    prefix,
    leadingInteractionElement,
    trailingInteractionElement,
    suffix,
    trailingIcon: TrailingIcon,
    trailingButton: TrailingButton,
    size,
  });

  const hasLeadingVisuals = hasLeadingInteractionElement || hasLeadingIcon || hasPrefix;
  const hasTrailingVisuals =
    hasTrailingInteractionElement || hasSuffix || hasTrailingIcon || hasTrailingButton;

  if (__DEV__) {
    if (hasTrailingButton && !isValidAllowedChildren(TrailingButton, 'Link')) {
      throwBladeError({
        message: 'trailingButton must be a valid Blade Link component',
        moduleName: 'BaseInput',
      });
    }
  }

  if (hasLeadingVisuals) {
    return (
      <BaseBox {...getVisualContainerStyles()}>
        {hasLeadingInteractionElement ? (
          <BaseBox
            paddingLeft={getInteractionElementStyles({
              hasTrailingIcon,
              hasLeadingInteractionElement,
              hasSuffix,
              hasTrailingButton,
            })}
            display="flex"
            alignItems="stretch"
            alignSelf="stretch"
          >
            {leadingInteractionElement}
          </BaseBox>
        ) : null}
        {LeadingIcon ? (
          <BaseBox paddingLeft="spacing.4" display="flex">
            <LeadingIcon
              size={iconSize[size]}
              color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
            />
          </BaseBox>
        ) : null}
        {hasPrefix ? (
          <BaseBox {...getPrefixStyles({ hasLeadingIcon, hasPrefix })}>
            <Text
              size={textSize[size]}
              variant="body"
              weight="regular"
              color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
            >
              {prefix}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    );
  }

  if (hasTrailingVisuals) {
    return (
      <BaseBox
        {...getVisualContainerStyles({
          shouldStretchTrailingBox:
            hasTrailingInteractionElement && Boolean(onTrailingInteractionElementClick),
        })}
      >
        {hasTrailingInteractionElement ? (
          <BaseBox
            {...getVisualContainerStyles({
              shouldStretchTrailingBox:
                hasTrailingInteractionElement && Boolean(onTrailingInteractionElementClick),
            })}
          >
            <BaseBox
              paddingRight={getInteractionElementStyles({
                hasTrailingIcon,
                hasTrailingInteractionElement,
                hasSuffix,
                hasTrailingButton,
              })}
              display="flex"
              alignItems="stretch"
              alignSelf="stretch"
              {...(!isReactNative() && { onClick: onTrailingInteractionElementClick })}
            >
              {trailingInteractionElement}
            </BaseBox>
          </BaseBox>
        ) : null}
        {hasSuffix ? (
          <BaseBox {...getSuffixStyles({ hasTrailingIcon, hasSuffix, hasTrailingButton })}>
            <Text
              size={textSize[size]}
              variant="body"
              weight="regular"
              color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
            >
              {suffix}
            </Text>
          </BaseBox>
        ) : null}
        {TrailingIcon ? (
          <BaseBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            {...getTrailingIconStyles({ hasTrailingIcon, hasTrailingButton })}
          >
            <ValidationIconTooltip
              showHintsAsTooltip={showHintsAsTooltip}
              errorText={errorText}
              successText={successText}
              validationState={validationState}
            >
              <TrailingIcon
                size={iconSize[size]}
                color={
                  isDisabled ? 'interactive.icon.gray.disabled' : trailingIconColor[validationState]
                }
              />
            </ValidationIconTooltip>
          </BaseBox>
        ) : null}
        {TrailingButton ? (
          <BaseBox paddingRight="spacing.4" display="flex">
            {React.cloneElement(TrailingButton, {
              size,
              variant: 'button',
              isDisabled,
            })}
          </BaseBox>
        ) : null}
      </BaseBox>
    );
  }

  return null;
};
