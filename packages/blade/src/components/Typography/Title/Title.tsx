import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getPlatformType } from '~utils';
import { getStyledProps } from '~components/Box/styled-props';
import type { StyledProps } from '~components/Box/styled-props';
import type { StringChildrenType } from '~src/_helpers/types';

export type TitleProps = {
  size?: 'small' | 'medium' | 'large';
  contrast?: ColorContrastTypes;
  type?: TextTypes;
  children: StringChildrenType;
} & StyledProps;

const getProps = ({
  size,
  type,
  contrast,
}: Pick<TitleProps, 'size' | 'type' | 'contrast'>): Omit<BaseTextProps, 'children'> => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> = {
    color: `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 600,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: '4xl',
    fontFamily: 'text',
    accessibilityProps: isPlatformWeb ? {} : { role: 'heading' },
    componentName: 'title',
  };

  if (size === 'small') {
    props.fontSize = 600;
    props.lineHeight = '4xl';
    props.as = isPlatformWeb ? 'h3' : undefined;
  } else if (size === 'medium') {
    props.fontSize = 700;
    props.lineHeight = '4xl';
    props.as = isPlatformWeb ? 'h2' : undefined;
  } else if (size === 'large') {
    props.fontSize = 1000;
    props.lineHeight = '6xl';
    props.as = isPlatformWeb ? 'h1' : undefined;
  }

  return props;
};

export const Title = ({
  size = 'small',
  type = 'normal',
  contrast = 'low',
  children,
  ...styledProps
}: TitleProps): ReactElement => {
  const props = getProps({ size, type, contrast });
  return (
    <BaseText {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};
