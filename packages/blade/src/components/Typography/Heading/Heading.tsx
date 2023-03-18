/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getPlatformType } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';

import type { Theme } from '~components/BladeProvider';
import type { StringChildrenType, TestID } from '~src/_helpers/types';

type HeadingVariant = 'regular' | 'subheading';
type HeadingSize = 'small' | 'medium' | 'large';

type HeadingCommonProps = {
  type?: TextTypes;
  contrast?: ColorContrastTypes;
  children: StringChildrenType;
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
  variant,
  size,
  type,
  weight,
  contrast,
  testID,
}: Pick<HeadingProps<T>, 'variant' | 'size' | 'type' | 'weight' | 'contrast' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast!}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> = {
    color: `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 200,
    fontWeight: weight ?? 'bold',
    fontStyle: 'normal',
    lineHeight: 'xl',
    fontFamily: 'text',
    accessibilityProps: isPlatformWeb ? {} : { role: 'heading' },
    componentName: 'heading',
    testID,
  };

  if (variant === 'regular') {
    if (!size || size === 'small') {
      props.fontSize = 200;
      props.lineHeight = '2xl';
      props.as = isPlatformWeb ? 'h6' : undefined;
    } else if (size === 'medium') {
      props.fontSize = 300;
      props.lineHeight = '3xl';
      props.as = isPlatformWeb ? 'h5' : undefined;
    } else if (size === 'large') {
      props.fontSize = 400;
      props.lineHeight = '3xl';
      props.as = isPlatformWeb ? 'h4' : undefined;
    }
  } else if (variant === 'subheading') {
    if (weight === 'regular') {
      throw new Error(`[Blade: Heading]: weight cannot be 'regular' when variant is 'subheading'`);
    }
    if (size) {
      throw new Error(
        `[Blade: Heading]: size prop cannot be added when variant is 'subheading'. Use variant 'regular' or remove size prop`,
      );
    }
    props.fontSize = 75;
    props.lineHeight = 's';
    props.as = isPlatformWeb ? 'h6' : undefined;
  }

  return props;
};

export const Heading = <T extends { variant: HeadingVariant }>({
  variant = 'regular',
  size, // Not setting default value since the `size` should be undefined with variant="subheading"
  type = 'normal',
  weight = 'bold',
  contrast = 'low',
  children,
  testID,
  ...styledProps
}: HeadingProps<T>): ReactElement => {
  const props = getProps({ variant, size, type, weight, contrast, testID });
  return (
    <BaseText {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};
