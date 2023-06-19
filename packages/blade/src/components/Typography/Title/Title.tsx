import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getPlatformType } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { StringChildrenType, TestID } from '~src/_helpers/types';

const validAsValues = ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type TitleProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Title component.
   *
   * **Note** This takes priority over `type` and `constrast` prop to decide color of title
   */
  color?: BaseTextProps['color'];
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  contrast?: ColorContrastTypes;
  type?: TextTypes;
  children: StringChildrenType;
} & TestID &
  StyledPropsBlade;

const getProps = ({
  as,
  size,
  type,
  contrast,
  color,
  testID,
}: Pick<TitleProps, 'as' | 'size' | 'type' | 'color' | 'contrast' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> = {
    color: color ?? `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 600,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 700,
    fontFamily: 'text',
    accessibilityProps: isPlatformWeb ? {} : { role: 'heading' },
    componentName: 'title',
    testID,
  };

  if (size === 'small') {
    props.fontSize = 600;
    props.lineHeight = 500;
    props.as = isPlatformWeb ? 'h3' : undefined;
  } else if (size === 'medium') {
    props.fontSize = 700;
    props.lineHeight = 600;
    props.as = isPlatformWeb ? 'h2' : undefined;
  } else if (size === 'large') {
    props.fontSize = 800;
    props.lineHeight = 700;
    props.as = isPlatformWeb ? 'h1' : undefined;
  } else if (size === 'xlarge') {
    props.fontSize = 1000;
    props.lineHeight = 800;
    props.as = isPlatformWeb ? 'h1' : undefined;
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

export const Title = ({
  as,
  size = 'small',
  type = 'normal',
  contrast = 'low',
  color,
  children,
  testID,
  ...styledProps
}: TitleProps): ReactElement => {
  const props = getProps({ as, size, type, contrast, color, testID });

  useValidateAsProp({ componentName: 'Text', as: props.as, validAsValues });

  return (
    <BaseText {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};
