import type { ReactElement } from 'react';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

export type TitleProps = {
  variant: 'large' | 'medium' | 'small';
  type: TextTypes;
  children: string;
};

const getProps = ({
  variant,
  type,
}: Pick<TitleProps, 'variant' | 'type'>): Omit<BaseTextProps, 'children'> => {
  const props: Omit<BaseTextProps, 'children'> = {
    color: `surface.text.${type}.lowContrast`,
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 's',
    fontFamily: 'text',
  };

  if (variant === 'small') {
    props.fontSize = 600;
    props.lineHeight = '4xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h3' : undefined;
  } else if (variant === 'medium') {
    props.fontSize = 700;
    props.lineHeight = '4xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h2' : undefined;
  } else if (variant === 'large') {
    props.fontSize = 1000;
    props.lineHeight = '6xl';
    props.as = getPlatformType() === 'browser' || getPlatformType() === 'node' ? 'h1' : undefined;
  }

  return props;
};

const Title = ({ variant, type, children }: TitleProps): ReactElement => {
  const props = getProps({ variant, type });
  return <BaseText {...props}>{children}</BaseText>;
};

export default Title;
