import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType, makeSpace, useBreakpoint } from '~utils';
import Box from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type CommonProps = {
  as: 'span' | 'label';
  position?: 'top' | 'left';
  necessityIndicator?: 'required' | 'optional' | 'none';
  accessibilityText?: string;
  children: string;
  id?: string;
  contrast?: ColorContrastTypes;
};

type LabelProps = CommonProps & {
  htmlFor: string;
  as: 'label';
};

type SpanProps = CommonProps & {
  as: 'span';
  htmlFor?: undefined;
};

type FormLabelProps = LabelProps | SpanProps;

export type FormInputLabelProps = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Desktop only prop. Default value on mobile will be `top`
   */
  labelPosition?: 'left' | 'top';
  /**
   * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
};

const FormLabel = ({
  as = 'span',
  position = 'top',
  necessityIndicator = 'none',
  accessibilityText,
  children,
  id,
  htmlFor,
  contrast = 'low',
}: FormLabelProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isReactNative = getPlatformType() === 'react-native';

  let necessityLabel: React.ReactNode = null;

  const isLabelLeftPositioned = position === 'left' && isDesktop;

  if (necessityIndicator === 'optional') {
    necessityLabel = (
      <Text variant="caption" weight="regular" type="placeholder">
        (optional)
      </Text>
    );
  }
  if (necessityIndicator === 'required') {
    necessityLabel = (
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontStyle="normal"
        fontSize={75}
        fontWeight="bold"
        color="feedback.text.negative.lowContrast"
      >
        *
      </BaseText>
    );
  }

  const computedAccessibilityNode = (
    <VisuallyHidden>
      {necessityIndicator !== 'none' && <Text>{necessityIndicator}</Text>}
      <Text>{accessibilityText}</Text>
    </VisuallyHidden>
  );

  const textNode = (
    <Box
      gap={necessityIndicator === 'optional' ? 'spacing.2' : 'spacing.0'}
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text
        type="subdued"
        variant="body"
        contrast={contrast}
        size={isLabelLeftPositioned ? 'medium' : 'small'}
        weight="bold"
      >
        {children}
      </Text>
      {computedAccessibilityNode}
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {necessityLabel}
    </Box>
  );

  // What harm can it do?
  if (isReactNative) {
    return (
      <Box marginRight="spacing.5" marginBottom="spacing.2">
        {textNode}
      </Box>
    );
  }

  const Component = as;
  // only set 120px label when device is desktop
  const width = isLabelLeftPositioned && isDesktop ? '120px' : 'auto';

  return (
    <Component
      htmlFor={htmlFor}
      style={{
        width,
        flexShrink: 0,
        marginRight: makeSpace(theme.spacing[5]),
        wordBreak: 'break-all',
      }}
      id={id}
    >
      <Box marginBottom={isLabelLeftPositioned ? 'spacing.0' : 'spacing.2'}>{textNode}</Box>
    </Component>
  );
};

export { FormLabel };
