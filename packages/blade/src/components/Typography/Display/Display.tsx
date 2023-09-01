import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';
import { getPlatformType } from '~utils';

const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type DisplayProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Display component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of title
   */
  color?: BaseTextProps['color'];
  size?: Extract<BaseTextSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
  contrast?: ColorContrastTypes;
  type?: TextTypes;
  children: React.ReactNode;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
} & TestID &
  StyledPropsBlade;

const getProps = ({
  as,
  size,
  type,
  contrast,
  color,
  testID,
}: Pick<DisplayProps, 'as' | 'size' | 'type' | 'color' | 'contrast' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> = {
    color: color ?? `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 1100,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 900,
    fontFamily: 'text',
    accessibilityProps: isPlatformWeb ? {} : { role: 'heading' },
    componentName: 'title',
    testID,
  };

  if (size === 'small') {
    props.fontSize = 1100;
    props.lineHeight = 900;
    props.as = isPlatformWeb ? 'h3' : undefined;
  } else if (size === 'medium') {
    props.fontSize = 1200;
    props.lineHeight = 1000;
    props.as = isPlatformWeb ? 'h2' : undefined;
  } else if (size === 'large') {
    props.fontSize = 1300;
    props.lineHeight = 1100;
    props.as = isPlatformWeb ? 'h1' : undefined;
  } else if (size === 'xlarge') {
    props.fontSize = 1600;
    props.lineHeight = 1500;
    props.as = isPlatformWeb ? 'h1' : undefined;
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

export const Display = ({
  as,
  size = 'small',
  type = 'normal',
  contrast = 'low',
  color,
  children,
  testID,
  textAlign,
  textDecorationLine,
  ...styledProps
}: DisplayProps): ReactElement => {
  useValidateAsProp({ componentName: 'Display', as, validAsValues });

  const props = getProps({ as, size, type, contrast, color, testID });

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
