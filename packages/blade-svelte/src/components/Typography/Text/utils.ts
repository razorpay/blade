import type { BaseTextProps } from '../BaseText/types';
import type { TextVariant } from './types';

export const validAsValues = [
  'p',
  'span',
  'div',
  'abbr',
  'figcaption',
  'cite',
  'q',
  'label',
] as const;

type GetTextPropsParams = {
  variant: TextVariant;
  weight?: 'regular' | 'medium' | 'semibold';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | undefined;
  color?: BaseTextProps['color'];
  testID?: string;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
};

export function getTextProps({
  variant,
  weight,
  size,
  color = 'surface.text.gray.normal',
  testID,
  textAlign,
  textDecorationLine,
}: GetTextPropsParams): Omit<BaseTextProps, 'children'> {
  const props: Omit<BaseTextProps, 'children'> = {
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
    // variant of caption can only have size of small or medium
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
