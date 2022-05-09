import type { ReactElement } from 'react';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import type { Theme } from '../../BladeProvider';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

export type HeadingCommonProps = {
  type: TextTypes;
  children?: React.ReactNode;
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
}: Pick<HeadingProps<T>, 'variant' | 'type' | 'weight'>): BaseTextProps => {
  const props: BaseTextProps = {
    color: `surface.text.${type}.lowContrast`,
    fontSize: 25,
    fontWeight: weight,
    fontStyle: 'normal',
    lineHeight: 'm',
    fontFamily: 'text',
  };

  if (variant === 'small') {
    props.fontSize = 200;
    props.lineHeight = 'xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h6' : undefined;
  } else if (variant === 'medium') {
    props.fontSize = 300;
    props.lineHeight = '2xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h5' : undefined;
  } else if (variant === 'large') {
    props.fontSize = 400;
    props.lineHeight = '2xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h4' : undefined;
  } else if (variant === 'subheading') {
    if (weight === 'regular') {
      throw new Error(`[Blade: Heading]: weight cannot be 'regular' when variant is 'subheading'`);
    }
    props.fontSize = 75;
    props.lineHeight = 'm';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h6' : undefined;
  }

  return props;
};

const Heading = <T extends { variant: 'small' | 'medium' | 'large' | 'subheading' }>({
  variant,
  type,
  weight,
  children,
}: HeadingProps<T>): ReactElement => {
  const props = getProps<T>({ variant, type, weight });
  return <BaseText {...props}>{children}</BaseText>;
};

export default Heading;
