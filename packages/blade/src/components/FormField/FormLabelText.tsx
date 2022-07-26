import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import BaseText from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

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
  const isReactNative = getPlatformType() === 'react-native';

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
      <Box paddingRight={neccessityIndicator === 'optional' ? 'spacing.1' : 'spacing.0'} />
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {neccessityLabel}
    </Box>
  );

  // What harm can it do?
  if (isReactNative) {
    return textNode;
  }

  return (
    <span style={{ width: position === 'left' ? '120px' : 'auto' }} id={id}>
      {textNode}
    </span>
  );
};

export { FormLabelText };
