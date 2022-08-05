import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getPlatformType } from '~utils';

export type TitleProps = {
  variant?: 'small' | 'medium' | 'large';
  contrast?: ColorContrastTypes;
  type?: TextTypes;
  children: string;
};

const getProps = ({
  variant,
  type,
  contrast,
}: Pick<TitleProps, 'variant' | 'type' | 'contrast'>): Omit<BaseTextProps, 'children'> => {
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
  };

  if (variant === 'small') {
    props.fontSize = 600;
    props.lineHeight = '4xl';
    props.as = isPlatformWeb ? 'h3' : undefined;
  } else if (variant === 'medium') {
    props.fontSize = 700;
    props.lineHeight = '4xl';
    props.as = isPlatformWeb ? 'h2' : undefined;
  } else if (variant === 'large') {
    props.fontSize = 1000;
    props.lineHeight = '6xl';
    props.as = isPlatformWeb ? 'h1' : undefined;
  }

  return props;
};

export const Title = ({
  variant = 'small',
  type = 'normal',
  contrast = 'low',
  children,
}: TitleProps): ReactElement => {
  const props = getProps({ variant, type, contrast });
  return <BaseText {...props}>{children}</BaseText>;
};
