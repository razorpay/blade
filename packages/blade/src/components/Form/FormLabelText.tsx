import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import BaseText from '~components/Typography/BaseText';
import { getPlatformType, useBreakpoint } from '~utils';
import Box from '~components/Box';
import { useTheme } from '~components/BladeProvider';

type FormLabelTextProps = {
  position?: 'top' | 'left';
  neccessityIndicator?: 'required' | 'optional' | 'none';
  accessibillityText?: string;
  children: React.ReactNode;
  id: string;
};

const FormLabelText = ({
  position = 'top',
  neccessityIndicator = 'none',
  accessibillityText,
  children,
  id,
}: FormLabelTextProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isReactNative = getPlatformType() === 'react-native';

  // TODO: replace with <Text /> when #548 merges
  let neccessityLabel: React.ReactNode = null;

  if (neccessityIndicator === 'optional') {
    neccessityLabel = (
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
  if (neccessityIndicator === 'required') {
    neccessityLabel = (
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
      {neccessityIndicator !== 'none' && <Text>{neccessityIndicator}</Text>}
      <Text>{accessibillityText}</Text>
    </VisuallyHidden>
  );

  const textNode = (
    <Box
      gap={neccessityIndicator === 'optional' ? 'spacing.1' : 'spacing.0'}
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
    >
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
