import type { ReactElement } from 'react';
import type { BaseInputProps } from './BaseInput';
import Box from '~components/Box';
import type { BoxProps } from '~components/Box/Box';
import { Text } from '~components/Typography';
import { getPlatformType } from '~utils';

const getVisualContainerStyles = ({
  visualSide,
}: {
  visualSide: 'leading' | 'trailing';
}): BoxProps => {
  const isReactNative = getPlatformType() === 'react-native';
  return {
    position: 'absolute',
    // we don't need transform on react-native we can center only with the 'top' property
    transform: isReactNative ? undefined : 'translateY(-50%)',
    // On web we control the alignment center with top+transform combination but on native it's only 'top'
    top: isReactNative ? '15%' : '50%',
    right: visualSide === 'trailing' ? 0 : undefined,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  };
};

const getPrefixStyles = ({
  hasLeadingIcon,
  hasPrefix,
}: {
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
}): BoxProps => {
  if (hasPrefix && hasLeadingIcon) {
    return {
      paddingLeft: 'spacing.1',
    };
  }

  if (hasPrefix && !hasLeadingIcon) {
    return {
      paddingLeft: 'spacing.3',
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
      paddingRight: 'spacing.1',
    };
  }

  if (hasInteractionElement && !hasSuffix && !hasTrailingIcon) {
    return {
      paddingRight: 'spacing.3',
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
      paddingRight: 'spacing.1',
    };
  }

  if (hasSuffix && !hasTrailingIcon) {
    return {
      paddingRight: 'spacing.3',
    };
  }

  return {
    paddingRight: 'spacing.0',
  };
};

export const BaseInputVisuals = ({
  leadingIcon: LeadingIcon,
  prefix,
  interactionElement,
  suffix,
  trailingIcon: TrailingIcon,
}: Pick<
  BaseInputProps,
  'leadingIcon' | 'prefix' | 'interactionElement' | 'suffix' | 'trailingIcon'
>): ReactElement | null => {
  const hasLeadingIcon = Boolean(LeadingIcon);
  const hasPrefix = Boolean(prefix);
  const hasInteractionElement = Boolean(interactionElement);
  const hasSuffix = Boolean(suffix);
  const hasTrailingIcon = Boolean(TrailingIcon);

  const hasLeadingVisuals = hasLeadingIcon || hasPrefix;
  const hasTrailingVisuals = hasInteractionElement || hasSuffix || hasTrailingIcon;

  if (hasLeadingVisuals) {
    return (
      <Box
        {...getVisualContainerStyles({ visualSide: 'leading' })}
        style={{ pointerEvents: 'none' }}
      >
        {hasLeadingIcon ? (
          <Box paddingLeft="spacing.3" display="flex">
            {LeadingIcon && <LeadingIcon size="small" color="feedback.icon.neutral.lowContrast" />}
          </Box>
        ) : null}
        {hasPrefix ? (
          <Box {...getPrefixStyles({ hasLeadingIcon, hasPrefix })}>
            <Text size="medium" variant="body" weight="regular" contrast="low">
              {prefix}
            </Text>
          </Box>
        ) : null}
      </Box>
    );
  }

  if (hasTrailingVisuals) {
    return (
      <Box
        {...getVisualContainerStyles({ visualSide: 'trailing' })}
        style={{ pointerEvents: 'none' }}
      >
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
            <Text size="medium" variant="body" weight="regular" contrast="low">
              {suffix}
            </Text>
          </Box>
        ) : null}
        {hasTrailingIcon ? (
          <Box paddingRight="spacing.3" display="flex">
            {TrailingIcon && (
              <TrailingIcon size="small" color="feedback.icon.neutral.lowContrast" />
            )}
          </Box>
        ) : null}
      </Box>
    );
  }

  return null;
};
