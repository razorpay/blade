import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import BaseText from '~components/Typography/BaseText';
import { getPlatformType, useBreakpoint } from '~utils';
import Box from '~components/Box';
import { useTheme } from '~components/BladeProvider';

type FormLabelPropsText = {
  position?: 'top' | 'left';
  neccessityIndicator?: 'required' | 'optional' | undefined;
  accessibillityText?: string;
  children: React.ReactNode;
  id: string;
};

const FormLabelText = ({
  position = 'top',
  neccessityIndicator,
  accessibillityText,
  children,
  id,
}: FormLabelPropsText): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isReactNative = getPlatformType() === 'react-native';

  // TODO: replace with <Text /> when #548 merges
  const neccessityLabel =
    neccessityIndicator === 'optional' ? (
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontStyle="italic"
        fontSize={50}
        color="surface.text.placeholder.lowContrast"
      >
        (optional)
      </BaseText>
    ) : neccessityIndicator === 'required' ? (
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
    ) : null;

  const computedAccessibilityNode = (
    <VisuallyHidden>
      <Text>{neccessityIndicator}</Text>
      <Text>{accessibillityText}</Text>
    </VisuallyHidden>
  );

  const textNode = (
    <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontWeight="bold"
        color="surface.text.subtle.lowContrast"
        fontSize={75}
      >
        {children}
        {computedAccessibilityNode}
      </BaseText>
      <Box marginRight={neccessityIndicator === 'optional' ? 'spacing.1' : 'spacing.0'} />
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {neccessityLabel}
    </Box>
  );

  // What harm can it do?
  if (isReactNative) {
    return textNode;
  }

  // only set 120px label when device is desktop
  const width = position === 'left' && isDesktop ? '120px' : 'auto';
  return (
    <span style={{ width }} id={id}>
      {textNode}
    </span>
  );
};

export { FormLabelText };
