/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { isReactNative } from '~utils';
import type { BladeElementRef, TestID, ElementTiming } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { logger } from '~utils/logger';

const validAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

type HeadingSize = Extract<BaseTextSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
type HeadingWeight = Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;

type HeadingCommonProps = {
  as?: typeof validAsValues[number];
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of heading
   */
  color?: BaseTextProps['color'];
  children: React.ReactNode;
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  textTransform?: BaseTextProps['textTransform'];
  wordBreak?: BaseTextProps['wordBreak'];
} & TestID &
  ElementTiming &
  StyledPropsBlade;

type HeadingSansProps = {
  size?: HeadingSize;
  weight?: HeadingWeight;
  isSerif?: false;
};

type HeadingSerifProps = {
  /**
   * Serif headings are only available at `2xlarge`.
   */
  size: '2xlarge';
  /**
   * PT Serif ships in regular weight only.
   */
  weight?: 'regular';
  /**
   * Renders the heading in PT Serif.
   *
   * **Reserved for the agentic dashboard hero heading.** Only allowed with `size="2xlarge"`.
   * Web only for now: on React Native the heading keeps the default heading font.
   *
   * @default false
   */
  isSerif: true;
};

export type HeadingProps = HeadingCommonProps & (HeadingSansProps | HeadingSerifProps);

type GetHeadingPropsArgs = Pick<HeadingCommonProps, 'as' | 'color' | 'testID'> & {
  size?: HeadingSize;
  weight?: HeadingWeight;
  isSerif?: boolean;
};

export const getHeadingProps = ({
  as,
  size,
  weight,
  color,
  testID,
  isSerif,
}: GetHeadingPropsArgs): Omit<BaseTextProps, 'children'> => {
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

  if (isSerif) {
    if (size !== '2xlarge') {
      logger({
        message: `isSerif is only supported with size="2xlarge". Received size="${size}", so the default heading font is used.`,
        moduleName: 'Heading',
        type: 'warn',
      });
    } else if (isReactNative()) {
      logger({
        message:
          'isSerif is not supported on React Native yet, so the default heading font is used.',
        moduleName: 'Heading',
        type: 'warn',
      });
    } else {
      // PT Serif ships in regular weight only. Any other weight would make the browser fake bold.
      props.fontFamily = 'serif';
      props.fontWeight = 'regular';
      props.letterSpacing = 25;
    }
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
    wordBreak,
    textTransform,
    isSerif = false,
    ...styledProps
  }: HeadingProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  useValidateAsProp({ componentName: 'Heading', as, validAsValues });

  const props = getHeadingProps({ as, size, weight, color, testID, isSerif });

  return (
    <BaseText
      {...props}
      ref={ref}
      textAlign={textAlign}
      textDecorationLine={textDecorationLine}
      textTransform={textTransform}
      wordBreak={wordBreak}
      {...getStyledProps(styledProps)}
      {...makeAnalyticsAttribute(styledProps)}
    >
      {children}
    </BaseText>
  );
};

const Heading = React.forwardRef(_Heading);

export { Heading };
