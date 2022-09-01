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
  id: string;
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

  if (necessityIndicator === 'optional') {
    necessityLabel = (
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontStyle="italic"
        fontSize={50}
        color="surface.text.placeholder.lowContrast"
      >
        (optional)
      </BaseText>
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
        color="surface.text.placeholder.lowContrast"
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
      <BaseText
        lineHeight={position === 'left' ? 'l' : 's'}
        fontFamily="text"
        fontWeight="bold"
        color="surface.text.subtle.lowContrast"
        fontSize={position === 'left' ? 100 : 75}
      >
        {children}
        {computedAccessibilityNode}
      </BaseText>
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
  const width = position === 'left' && isDesktop ? '120px' : 'auto';

  return (
    <Component
      htmlFor={htmlFor}
      style={{ width, marginRight: makeSpace(theme.spacing[5]) }}
      id={id}
    >
      <Box marginBottom="spacing.2">{textNode}</Box>
    </Component>
  );
};

export { FormLabel };
