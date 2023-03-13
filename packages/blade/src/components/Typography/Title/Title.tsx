import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import { getPlatformType } from '~utils';
import type { StringChildrenType, TestID } from '~src/_helpers/types';

export type TitleProps = {
  size?: 'small' | 'medium' | 'large';
  contrast?: ColorContrastTypes;
  type?: TextTypes;
  children: StringChildrenType;
} & TestID;

const getProps = ({
  size,
  type,
  contrast,
  testID,
}: Pick<TitleProps, 'size' | 'type' | 'contrast' | 'testID'>): Omit<BaseTextProps, 'children'> => {
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
    testID,
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
  testID,
}: TitleProps): ReactElement => {
  const props = getProps({ size, type, contrast, testID });
  return <BaseText {...props}>{children}</BaseText>;
};
