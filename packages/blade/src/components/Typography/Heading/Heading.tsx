import type { ReactElement } from 'react';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import type { Theme } from '../../BladeProvider';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText';

type HeadingCommonProps = {
  type: TextTypes;
  children: string;
};

type HeadingNormalVariant = HeadingCommonProps & {
  variant: 'small' | 'medium' | 'large';
  weight: keyof Theme['typography']['fonts']['weight'];
};

type HeadingSubHeadingVariant = HeadingCommonProps & {
  variant: 'subheading';
  weight: keyof Pick<Theme['typography']['fonts']['weight'], 'bold'>;
};

/**
 * Conditionally changing props based on variant.
 * Overloads or union gives wrong intellisense.
 */
export type HeadingProps<T> = T extends {
  variant: infer Variant;
}
  ? Variant extends 'small' | 'medium' | 'large'
    ? HeadingNormalVariant
    : Variant extends 'subheading'
    ? HeadingSubHeadingVariant
    : T
  : T;

const getProps = <T extends { variant: 'small' | 'medium' | 'large' | 'subheading' }>({
  variant,
  type,
  weight,
}: Pick<HeadingProps<T>, 'variant' | 'type' | 'weight'>): Omit<BaseTextProps, 'children'> => {
  const props: Omit<BaseTextProps, 'children'> = {
    color: `surface.text.${type}.lowContrast`,
    fontSize: 25,
    fontWeight: weight,
    fontStyle: 'normal',
    lineHeight: 'm',
    fontFamily: 'text',
  };

  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';

  if (variant === 'small') {
    props.fontSize = 200;
    props.lineHeight = 'xl';
    props.as = isPlatformWeb ? 'h6' : undefined;
  } else if (variant === 'medium') {
    props.fontSize = 300;
    props.lineHeight = '2xl';
    props.as = isPlatformWeb ? 'h5' : undefined;
  } else if (variant === 'large') {
    props.fontSize = 400;
    props.lineHeight = '2xl';
    props.as = isPlatformWeb ? 'h4' : undefined;
  } else if (variant === 'subheading') {
    if (weight === 'regular') {
      throw new Error(`[Blade: Heading]: weight cannot be 'regular' when variant is 'subheading'`);
    }
    props.fontSize = 75;
    props.lineHeight = 'm';
    props.as = isPlatformWeb ? 'h6' : undefined;
  }

  return props;
};

const Heading = <T extends { variant: 'small' | 'medium' | 'large' | 'subheading' }>({
  variant,
  type,
  weight,
  children,
}: HeadingProps<T>): ReactElement => {
  const props = getProps({ variant, type, weight });
  return <BaseText {...props}>{children}</BaseText>;
};

export default Heading;
