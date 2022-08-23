import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType, makeSpace, useBreakpoint } from '~utils';
import Box from '~components/Box';
import { useTheme } from '~components/BladeProvider';

type CommonProps = {
  as: 'span' | 'label';
  position?: 'top' | 'left';
  necessityIndicator?: 'required' | 'optional' | 'none';
  accessibilityText?: string;
  children: React.ReactNode;
  id?: string;
};

type LabelProps = CommonProps & {
  htmlFor: string;
  as: 'label';
};

type SpanProps = CommonProps & {
  as: 'span';
  htmlFor?: undefined;
};

export type FormLabelProps = LabelProps | SpanProps;

const FormLabel = ({
  as = 'span',
  position = 'top',
  necessityIndicator = 'none',
  accessibilityText,
  children,
  id,
  htmlFor,
}: FormLabelProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isReactNative = getPlatformType() === 'react-native';

  // TODO: replace with <Text /> when #548 merges
  let necessityLabel: React.ReactNode = null;

  if (!isDesktop && position === 'left') {
    console.warn(
      '[Blade: FormLabel]: Expected value `top` for label position on mobile device. Received `left`, falling back to `top`',
    );
  }

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
      gap={necessityIndicator === 'optional' ? 'spacing.1' : 'spacing.0'}
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text
        type="subdued"
        variant="body"
        size={position === 'left' ? 'medium' : 'small'}
        weight="bold"
      >
        {children}
        {computedAccessibilityNode}
      </Text>
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {necessityLabel}
    </Box>
  );

  // What harm can it do?
  if (isReactNative) {
    return (
      <Box marginRight="spacing.4" marginBottom="spacing.1">
        {textNode}
      </Box>
    );
  }

  const Component = as;
  const isLabelLeftPositioned = position === 'left';
  // only set 120px label when device is desktop
  const width = isLabelLeftPositioned && isDesktop ? '120px' : 'auto';

  return (
    <Component
      htmlFor={htmlFor}
      style={{
        width,
        flexShrink: 0,
        marginRight: makeSpace(theme.spacing[4]),
        wordBreak: 'break-all',
      }}
      id={id}
    >
      <Box marginBottom={isLabelLeftPositioned ? 'spacing.0' : 'spacing.1'}>{textNode}</Box>
    </Component>
  );
};

export { FormLabel };
