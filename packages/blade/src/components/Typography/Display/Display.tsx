import React from 'react';
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeElementRef, TestID } from '~utils/types';
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
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  children: React.ReactNode;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
} & TestID &
  StyledPropsBlade;

const getProps = ({
  as,
  size,
  weight,
  color,
  testID,
}: Pick<DisplayProps, 'as' | 'size' | 'color' | 'weight' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const letterSpacing = weight === 'medium' || weight === 'regular' ? 50 : 100;
  const props: Omit<BaseTextProps, 'children'> = {
    color,
    fontSize: 800,
    fontWeight: weight,
    fontStyle: 'normal',
    lineHeight: 800,
    fontFamily: 'heading',
    accessibilityProps: isPlatformWeb ? {} : { role: 'heading' },
    componentName: 'display',
    testID,
    letterSpacing,
  };

  if (size === 'small') {
    props.fontSize = 800;
    props.lineHeight = 800;
  } else if (size === 'medium') {
    props.fontSize = 900;
    props.lineHeight = 900;
  } else if (size === 'large') {
    props.fontSize = 1000;
    props.lineHeight = 1000;
  } else if (size === 'xlarge') {
    props.fontSize = 1100;
    props.lineHeight = 1100;
  }

  props.as = isPlatformWeb ? 'h1' : undefined;
  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

const _Display = (
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
  }: DisplayProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  useValidateAsProp({ componentName: 'Display', as, validAsValues });

  const props = getProps({ as, size, color, weight, testID });

  return (
    <BaseText
      ref={ref}
      {...props}
      textAlign={textAlign}
      textDecorationLine={textDecorationLine}
      {...getStyledProps(styledProps)}
    >
      {children}
    </BaseText>
  );
};

const Display = React.forwardRef(_Display);
export { Display };
