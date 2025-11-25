import type { BaseTextProps } from '../BaseText/types';

export const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

type GetHeadingPropsParams = {
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  weight: 'regular' | 'medium' | 'semibold';
  color?: BaseTextProps['color'];
  testID?: string;
};

export function getHeadingProps({
  as,
  size,
  weight,
  color,
  testID,
}: GetHeadingPropsParams): Omit<BaseTextProps, 'children'> {
  const finalSize = size ?? 'small';
  const finalWeight = weight ?? 'semibold';

  const props: Omit<BaseTextProps, 'children'> = {
    color,
    fontSize: 300,
    fontWeight: finalWeight,
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'heading',
    accessibilityProps: {},
    componentName: 'heading',
    testID,
  };

  if (finalSize === 'small') {
    props.fontSize = 300;
    props.lineHeight = 300;
    props.as = 'h6';
  } else if (finalSize === 'medium') {
    props.fontSize = 400;
    props.lineHeight = 400;
    props.as = 'h5';
  } else if (finalSize === 'large') {
    props.fontSize = 500;
    props.lineHeight = 500;
    props.as = 'h4';
  } else if (finalSize === 'xlarge') {
    props.fontSize = 600;
    props.lineHeight = 600;
    props.as = 'h3';
  } else if (finalSize === '2xlarge') {
    props.fontSize = 700;
    props.lineHeight = 700;
    props.as = 'h2';
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
}

