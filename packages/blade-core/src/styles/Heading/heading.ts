// Font size and line height types matching BaseText
export type FontSize = 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;
export type LineHeight = 0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;

export type HeadingSize = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
export type HeadingWeight = 'regular' | 'medium' | 'semibold';
export type HeadingAs = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const validHeadingAsValues: readonly HeadingAs[] = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type HeadingPropsResult = {
  color?: string;
  fontSize: FontSize;
  fontWeight: HeadingWeight;
  fontStyle: 'normal';
  lineHeight: LineHeight;
  fontFamily: 'heading';
  accessibilityProps: Record<string, never>;
  componentName: 'heading';
  testID?: string;
  as: HeadingAs;
};

type GetHeadingPropsParams = {
  as?: HeadingAs;
  size: HeadingSize;
  weight: HeadingWeight;
  color?: string;
  testID?: string;
};

/**
 * Get BaseText props from Heading props
 * Converts Heading component props to BaseText props with appropriate font sizes and line heights
 * These values correspond to BaseText utility classes (font-size-300, font-size-400, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 */
export function getHeadingProps({
  as,
  size,
  weight,
  color,
  testID,
}: GetHeadingPropsParams): HeadingPropsResult {
  const finalSize = size ?? 'small';
  const finalWeight = weight ?? 'semibold';

  const props: HeadingPropsResult = {
    color,
    fontSize: 300,
    fontWeight: finalWeight,
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'heading',
    accessibilityProps: {},
    componentName: 'heading',
    testID,
    as: 'h6',
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

  // Override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
}

