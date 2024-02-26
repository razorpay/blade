/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { ReactElement } from 'react';
import type { BaseInputProps } from './BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { IconColors } from '~components/Icons';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';

type InputVisuals = Pick<
  BaseInputProps,
  | 'leadingIcon'
  | 'prefix'
  | 'interactionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'isDisabled'
  | 'validationState'
  | 'size'
  | 'trailingActionButton'
> & {
  size: NonNullable<BaseInputProps['size']>;
};

const getVisualContainerStyles = (): Pick<
  BaseBoxProps,
  'display' | 'flexDirection' | 'alignItems' | 'alignSelf'
> => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
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
  hasInteractionElement,
  hasSuffix,
  hasTrailingActionButton,
}: {
  hasTrailingIcon: boolean;
  hasInteractionElement: boolean;
  hasSuffix: boolean;
  hasTrailingActionButton: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasInteractionElement && (hasSuffix || hasTrailingIcon || hasTrailingActionButton)) {
    return {
      paddingRight: 'spacing.2',
    };
  }

  if (hasInteractionElement && !hasSuffix && !hasTrailingIcon && !hasTrailingActionButton) {
    return {
      paddingRight: 'spacing.4',
    };
  }

  return {
    paddingRight: 'spacing.0',
  };
};

const getSuffixStyles = ({
  hasTrailingIcon,
  hasSuffix,
  hasTrailingActionButton,
}: {
  hasTrailingIcon: boolean;
  hasSuffix: boolean;
  hasTrailingActionButton: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasSuffix && (hasTrailingIcon || hasTrailingActionButton)) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  if (hasSuffix && !hasTrailingIcon && !hasTrailingActionButton) {
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
  hasTrailingActionButton,
}: {
  hasTrailingIcon: boolean;
  hasTrailingActionButton: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasTrailingIcon && hasTrailingActionButton) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  if (hasTrailingIcon && !hasTrailingActionButton) {
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
  interactionElement,
  suffix,
  trailingIcon,
  trailingActionButton,
}: InputVisuals) => ({
  hasLeadingIcon: Boolean(leadingIcon),
  hasPrefix: Boolean(prefix),
  hasInteractionElement: Boolean(interactionElement),
  hasSuffix: Boolean(suffix),
  hasTrailingIcon: Boolean(trailingIcon),
  hasTrailingActionButton: Boolean(trailingActionButton),
});

export const BaseInputVisuals = ({
  leadingIcon: LeadingIcon,
  prefix,
  interactionElement,
  suffix,
  trailingIcon: TrailingIcon,
  isDisabled,
  validationState = 'none',
  size,
  trailingActionButton: TrailingActionButton,
}: InputVisuals): ReactElement | null => {
  const {
    hasLeadingIcon,
    hasPrefix,
    hasInteractionElement,
    hasSuffix,
    hasTrailingIcon,
    hasTrailingActionButton,
  } = getInputVisualsToBeRendered({
    leadingIcon: LeadingIcon,
    prefix,
    interactionElement,
    suffix,
    trailingIcon: TrailingIcon,
    trailingActionButton: TrailingActionButton,
    size,
  });

  const hasLeadingVisuals = hasLeadingIcon || hasPrefix;
  const hasTrailingVisuals =
    hasInteractionElement || hasSuffix || hasTrailingIcon || hasTrailingActionButton;

  if (__DEV__) {
    if (hasTrailingActionButton && !isValidAllowedChildren(TrailingActionButton, 'Link')) {
      throwBladeError({
        message: 'trailingActionButton must be a valid Blade Link component',
        moduleName: 'BaseInput',
      });
    }
  }

  if (hasLeadingVisuals) {
    return (
      <BaseBox {...getVisualContainerStyles()}>
        {LeadingIcon ? (
          <BaseBox paddingLeft="spacing.4" display="flex">
            <LeadingIcon
              size={iconSize[size]}
              color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.subtle'}
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
      <BaseBox alignSelf="stretch" alignItems="stretch" {...getVisualContainerStyles()}>
        {hasInteractionElement ? (
          <BaseBox
            {...getInteractionElementStyles({
              hasTrailingIcon,
              hasInteractionElement,
              hasSuffix,
              hasTrailingActionButton,
            })}
            display="flex"
            alignItems="stretch"
            alignSelf="stretch"
          >
            {interactionElement}
          </BaseBox>
        ) : null}
        {hasSuffix ? (
          <BaseBox {...getSuffixStyles({ hasTrailingIcon, hasSuffix, hasTrailingActionButton })}>
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
            {...getTrailingIconStyles({ hasTrailingIcon, hasTrailingActionButton })}
          >
            {
              <TrailingIcon
                size={iconSize[size]}
                color={
                  isDisabled ? 'interactive.icon.gray.disabled' : trailingIconColor[validationState]
                }
              />
            }
          </BaseBox>
        ) : null}
        {TrailingActionButton ? (
          <BaseBox paddingRight="spacing.4" display="flex">
            {React.cloneElement(TrailingActionButton, {
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
