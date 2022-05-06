import type { ReactElement } from 'react';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatform from '../../../utils/getPlatform';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

export type TitleProps = {
  variant: 'large' | 'medium' | 'small';
  type: TextTypes;
  children?: React.ReactNode;
};

const getProps = ({ variant, type }: TitleProps): BaseTextProps => {
  const props: BaseTextProps = {
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
    props.as = getPlatform() !== 'react-native' ? 'h3' : undefined;
  } else if (variant === 'medium') {
    props.fontSize = 700;
    props.lineHeight = '4xl';
    props.as = getPlatform() !== 'react-native' ? 'h2' : undefined;
  } else if (variant === 'large') {
    props.fontSize = 1000;
    props.lineHeight = '6xl';
    props.as = getPlatform() !== 'react-native' ? 'h1' : undefined;
  }

  return props;
};

const Title = ({ variant, type, children }: TitleProps): ReactElement => {
  const props = getProps({ variant, type });
  return <BaseText {...props}>{children}</BaseText>;
};

export default Title;
