// Font size and line height types matching BaseText
export type FontSize =
  | 25
  | 50
  | 75
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100;
export type LineHeight =
  | 0
  | 25
  | 50
  | 75
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100;

export type TextVariant = 'body' | 'caption';
export type TextSize = 'xsmall' | 'small' | 'medium' | 'large';
export type TextWeight = 'regular' | 'medium' | 'semibold';
export type TextAs = 'p' | 'span' | 'div' | 'abbr' | 'figcaption' | 'cite' | 'q' | 'label';

export const validTextAsValues: readonly TextAs[] = [
  'p',
  'span',
  'div',
  'abbr',
  'figcaption',
  'cite',
  'q',
  'label',
] as const;

export type TextPropsResult = {
  color?: string;
  fontSize: FontSize;
  fontWeight: TextWeight;
  fontStyle: 'normal';
  lineHeight: LineHeight;
  fontFamily: 'text';
  componentName: 'text';
  testID?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through';
};

type GetTextPropsParams = {
  variant: TextVariant;
  weight?: TextWeight;
  size?: TextSize | undefined;
  color?: string;
  testID?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through';
};

/**
 * Get BaseText props from Text props
 * Converts Text component props to BaseText props with appropriate font sizes and line heights
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 */
export function getTextProps({
  variant,
  weight,
  size,
  color = 'surface.text.gray.normal',
  testID,
  textAlign,
  textDecorationLine,
}: GetTextPropsParams): TextPropsResult {
  const props: TextPropsResult = {
    color,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 100,
    fontFamily: 'text',
    componentName: 'text',
    testID,
    textAlign,
    textDecorationLine,
  };

  if (variant === 'caption') {
    // Variant of caption can only have size of small or medium
    if (size && size !== 'small' && size !== 'medium') {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error(
          `[Blade: Text]: size cannot be '${size}' when variant is 'caption'. Only 'small' and 'medium' are allowed.`,
        );
      }
      // Set size as small in case of invalid size
      size = 'small';
    }
  } else if (!size) {
    // For body variant, default to medium if no size is provided
    size = 'medium';
  }

  if (variant === 'body') {
    if (size === 'xsmall') {
      props.fontSize = 25;
      props.lineHeight = 25;
    }
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 75;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 100;
    }
    if (size === 'large') {
      props.fontSize = 200;
      props.lineHeight = 200;
    }
  }
  if (variant === 'caption') {
    if (size === 'small') {
      props.fontSize = 50;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
    }
  }

  return props;
}
