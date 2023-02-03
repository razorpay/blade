/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ReactElement } from 'react';
import type { BaseInputProps } from './BaseInput';
import Box from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { BoxProps } from '~components/Box/BaseBox/types';

type InputVisuals = Pick<
  BaseInputProps,
  'leadingIcon' | 'prefix' | 'interactionElement' | 'suffix' | 'trailingIcon' | 'isDisabled'
>;

const getVisualContainerStyles = (): BoxProps => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const getPrefixStyles = ({
  hasLeadingIcon,
  hasPrefix,
}: {
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
}): BoxProps => {
  if (hasPrefix && hasLeadingIcon) {
    return {
      paddingLeft: 'spacing.2',
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
}): BoxProps => {
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
}): BoxProps => {
  if (hasSuffix && hasTrailingIcon) {
    return {
      paddingRight: 'spacing.2',
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
  });

  const hasLeadingVisuals = hasLeadingIcon || hasPrefix;
  const hasTrailingVisuals = hasInteractionElement || hasSuffix || hasTrailingIcon;

  if (hasLeadingVisuals) {
    return (
      <Box {...getVisualContainerStyles()}>
        {LeadingIcon ? (
          <Box paddingLeft="spacing.4" display="flex">
            <LeadingIcon
              size="medium"
              color={
                isDisabled
                  ? 'surface.text.placeholder.lowContrast'
                  : 'surface.text.subtle.lowContrast'
              }
            />
          </Box>
        ) : null}
        {hasPrefix ? (
          <Box {...getPrefixStyles({ hasLeadingIcon, hasPrefix })}>
            <Text
              size="medium"
              variant="body"
              weight="regular"
              contrast="low"
              type={isDisabled ? 'placeholder' : 'subtle'}
            >
              {prefix}
            </Text>
          </Box>
        ) : null}
      </Box>
    );
  }

  if (hasTrailingVisuals) {
    return (
      <Box {...getVisualContainerStyles()}>
        {hasInteractionElement ? (
          <Box
            {...getInteractionElementStyles({ hasTrailingIcon, hasInteractionElement, hasSuffix })}
            display="flex"
          >
            {interactionElement}
          </Box>
        ) : null}
        {hasSuffix ? (
          <Box {...getSuffixStyles({ hasTrailingIcon, hasSuffix })}>
            <Text
              size="medium"
              variant="body"
              weight="regular"
              contrast="low"
              type={isDisabled ? 'placeholder' : 'subtle'}
            >
              {suffix}
            </Text>
          </Box>
        ) : null}
        {TrailingIcon ? (
          <Box paddingRight="spacing.4" display="flex">
            {
              <TrailingIcon
                size="medium"
                color={
                  isDisabled
                    ? 'surface.text.placeholder.lowContrast'
                    : 'surface.text.subtle.lowContrast'
                }
              />
            }
          </Box>
        ) : null}
      </Box>
    );
  }

  return null;
};
