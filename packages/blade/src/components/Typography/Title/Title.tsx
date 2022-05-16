import type { ReactElement } from 'react';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

export type TitleProps = {
  variant?: 'small' | 'medium' | 'large';
  type?: TextTypes;
  children: string;
};

const getProps = ({
  variant,
  type,
}: Pick<TitleProps, 'variant' | 'type'>): Omit<BaseTextProps, 'children'> => {
  const props: Omit<BaseTextProps, 'children'> = {
    color: `surface.text.${type ?? 'normal'}.lowContrast`,
    fontSize: 600,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: '4xl',
    fontFamily: 'text',
  };
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';

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

const Title = ({ variant = 'small', type = 'normal', children }: TitleProps): ReactElement => {
  const props = getProps({ variant, type });
  return <BaseText {...props}>{children}</BaseText>;
};

export default Title;
