/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { Theme } from '~components/BladeProvider';
import { isReactNative } from '~utils';
import type { TestID } from '~utils/types';

type HeadingVariant = 'regular' | 'subheading';
type HeadingSize = 'small' | 'medium' | 'large';

const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type HeadingCommonProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `constrast` prop to decide color of heading
   */
  color?: BaseTextProps['color'];
  type?: TextTypes;
  contrast?: ColorContrastTypes;
  children: React.ReactNode;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
} & TestID &
  StyledPropsBlade;

type HeadingNormalVariant = HeadingCommonProps & {
  variant?: Exclude<HeadingVariant, 'subheading'>;
  /**
   *
   * @default small
   */
  size?: HeadingSize;
  weight?: keyof Theme['typography']['fonts']['weight'];
};

type HeadingSubHeadingVariant = HeadingCommonProps & {
  variant?: Extract<HeadingVariant, 'subheading'>;
  /**
   * `size` cannot be used with variant="subheading". Either change to variant="regular" or remove size prop
   */
  size?: undefined;
  weight?: keyof Pick<Theme['typography']['fonts']['weight'], 'bold'>;
};

/**
 * Conditionally changing props based on variant.
 * Overloads or union gives wrong intellisense.
 */
export type HeadingProps<T> = T extends {
  variant: infer Variant;
}
  ? Variant extends Exclude<HeadingVariant, 'subheading'>
    ? HeadingNormalVariant
    : Variant extends 'subheading'
    ? HeadingSubHeadingVariant
    : T
  : T;

const getProps = <T extends { variant: HeadingVariant }>({
  as,
  variant,
  size,
  type,
  weight,
  contrast,
  color,
  testID,
}: Pick<
  HeadingProps<T>,
  'as' | 'variant' | 'size' | 'type' | 'weight' | 'contrast' | 'color' | 'testID'
>): Omit<BaseTextProps, 'children'> => {
  const colorContrast: keyof ColorContrast = contrast ? `${contrast!}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> = {
    color: color ?? `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 200,
    fontWeight: weight ?? 'bold',
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'text',
    accessibilityProps: isReactNative() ? { role: 'heading' } : {},
    componentName: 'heading',
    testID,
  };

  if (variant === 'regular') {
    if (!size || size === 'small') {
      props.fontSize = 200;
      props.lineHeight = 300;
      props.as = 'h6';
    } else if (size === 'medium') {
      props.fontSize = 300;
      props.lineHeight = 200;
      props.as = 'h5';
    } else if (size === 'large') {
      props.fontSize = 400;
      props.lineHeight = 400;
      props.as = 'h4';
    }
  } else if (variant === 'subheading') {
    if (__DEV__) {
      if (weight === 'regular') {
        throw new Error(
          `[Blade: Heading]: weight cannot be 'regular' when variant is 'subheading'`,
        );
      }
      if (size) {
        throw new Error(
          `[Blade: Heading]: size prop cannot be added when variant is 'subheading'. Use variant 'regular' or remove size prop`,
        );
      }
    }
    props.fontSize = 75;
    props.lineHeight = 50;
    props.as = 'p';
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

export const Heading = <T extends { variant: HeadingVariant }>({
  as,
  variant = 'regular',
  size, // Not setting default value since the `size` should be undefined with variant="subheading"
  type = 'normal',
  weight = 'bold',
  contrast = 'low',
  color,
  children,
  testID,
  textAlign,
  textDecorationLine,
  ...styledProps
}: HeadingProps<T>): ReactElement => {
  useValidateAsProp({ componentName: 'Heading', as, validAsValues });

  const props = getProps({ as, variant, size, type, weight, color, contrast, testID });

  return (
    <BaseText
      {...props}
      textAlign={textAlign}
      textDecorationLine={textDecorationLine}
      {...getStyledProps(styledProps)}
    >
      {children}
    </BaseText>
  );
};
