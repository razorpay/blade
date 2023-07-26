import React from 'react';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType, useBreakpoint } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { ColorContrastTypes } from '~tokens/theme/theme';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';
import { size } from '~tokens/global';

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
  label?: string;
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
        lineHeight={100}
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
    <BaseBox
      gap={necessityIndicator === 'optional' ? 'spacing.2' : 'spacing.0'}
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      maxHeight={makeSpace(size[36])}
    >
      <Text
        type="subdued"
        variant="body"
        contrast={contrast}
        size={isLabelLeftPositioned ? 'medium' : 'small'}
        truncateAfterLines={2}
        weight="bold"
      >
        {children}
      </Text>
      {computedAccessibilityNode}
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {necessityLabel}
    </BaseBox>
  );

  // What harm can it do?
  if (isReactNative) {
    return (
      <BaseBox marginRight="spacing.5" marginBottom="spacing.2">
        {textNode}
      </BaseBox>
    );
  }

  const Component = as;
  // only set 120px label when device is desktop
  const width = isLabelLeftPositioned && isDesktop ? makeSize(size[120]) : 'auto';

  return (
    <Component
      htmlFor={htmlFor}
      style={{
        width,
        flexShrink: 0,
        marginRight: makeSpace(theme.spacing[5]),
      }}
      id={id}
      {...metaAttribute({ name: MetaConstants.FormLabel })}
    >
      <BaseBox marginBottom={isLabelLeftPositioned ? 'spacing.0' : 'spacing.2'}>{textNode}</BaseBox>
    </Component>
  );
};

export { FormLabel };
