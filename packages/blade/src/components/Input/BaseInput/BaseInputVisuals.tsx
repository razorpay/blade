/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ReactElement } from 'react';
import type { BaseInputProps } from './BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { IconColors } from '~components/Icons';

type InputVisuals = Pick<
  BaseInputProps,
  | 'leadingIcon'
  | 'prefix'
  | 'interactionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'isDisabled'
  | 'validationState'
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
}: {
  hasTrailingIcon: boolean;
  hasInteractionElement: boolean;
  hasSuffix: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasInteractionElement && (hasSuffix || hasTrailingIcon)) {
    return {
      paddingRight: 'spacing.2',
    };
  }

  if (hasInteractionElement && !hasSuffix && !hasTrailingIcon) {
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
}: {
  hasTrailingIcon: boolean;
  hasSuffix: boolean;
}): Pick<BaseBoxProps, 'paddingRight'> => {
  if (hasSuffix && hasTrailingIcon) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  if (hasSuffix && !hasTrailingIcon) {
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
}: InputVisuals) => ({
  hasLeadingIcon: Boolean(leadingIcon),
  hasPrefix: Boolean(prefix),
  hasInteractionElement: Boolean(interactionElement),
  hasSuffix: Boolean(suffix),
  hasTrailingIcon: Boolean(trailingIcon),
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
}: InputVisuals): ReactElement | null => {
  const {
    hasLeadingIcon,
    hasPrefix,
    hasInteractionElement,
    hasSuffix,
    hasTrailingIcon,
  } = getInputVisualsToBeRendered({
    leadingIcon: LeadingIcon,
    prefix,
    interactionElement,
    suffix,
    trailingIcon: TrailingIcon,
    size,
  });

  const hasLeadingVisuals = hasLeadingIcon || hasPrefix;
  const hasTrailingVisuals = hasInteractionElement || hasSuffix || hasTrailingIcon;

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
            {...getInteractionElementStyles({ hasTrailingIcon, hasInteractionElement, hasSuffix })}
            display="flex"
            alignItems="stretch"
            alignSelf="stretch"
          >
            {interactionElement}
          </BaseBox>
        ) : null}
        {hasSuffix ? (
          <BaseBox {...getSuffixStyles({ hasTrailingIcon, hasSuffix })}>
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
          <BaseBox paddingRight="spacing.4" display="flex">
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
      </BaseBox>
    );
  }

  return null;
};
