/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { isReactNative } from '~utils';
import type { BladeElementRef, TestID } from '~utils/types';

const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of heading
   */
  color?: BaseTextProps['color'];
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
  children: React.ReactNode;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  size?: Extract<BaseTextSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
} & TestID &
  StyledPropsBlade;

export const getHeadingProps = ({
  as,
  size,
  weight,
  color,
  testID,
}: Pick<HeadingProps, 'as' | 'size' | 'weight' | 'color' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const props: Omit<BaseTextProps, 'children'> = {
    color,
    fontSize: 300,
    fontWeight: weight ?? 'semibold',
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'heading',
    accessibilityProps: isReactNative() ? { role: 'heading' } : {},
    componentName: 'heading',
    testID,
  };

  if (size === 'small') {
    props.fontSize = 300;
    props.lineHeight = 300;
    props.as = 'h6';
  } else if (size === 'medium') {
    props.fontSize = 400;
    props.lineHeight = 400;
    props.as = 'h5';
  } else if (size === 'large') {
    props.fontSize = 500;
    props.lineHeight = 500;
    props.as = 'h4';
  } else if (size === 'xlarge') {
    props.fontSize = 600;
    props.lineHeight = 600;
    props.as = 'h3';
  } else if (size === '2xlarge') {
    props.fontSize = 700;
    props.lineHeight = 700;
    props.as = 'h2';
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

const _Heading = (
  {
    as,
    size = 'small',
    weight = 'semibold',
    color = 'surface.text.gray.normal',
    children,
    testID,
    textAlign,
    textDecorationLine,
    ...styledProps
  }: HeadingProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  useValidateAsProp({ componentName: 'Heading', as, validAsValues });

  const props = getHeadingProps({ as, size, weight, color, testID });

  return (
    <BaseText
      {...props}
      ref={ref}
      textAlign={textAlign}
      textDecorationLine={textDecorationLine}
      {...getStyledProps(styledProps)}
    >
      {children}
    </BaseText>
  );
};

const Heading = React.forwardRef(_Heading);

export { Heading };
