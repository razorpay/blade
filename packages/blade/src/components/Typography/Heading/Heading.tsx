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
import { logger, throwBladeError } from '~utils/logger';

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

export type HeadingProps = HeadingCommonProps & {
  /**
   * Leave unset with `variant="serif"`, which always renders at the 2xlarge size. Any other size
   * throws in dev.
   *
   * @default 'small'
   */
  size?: HeadingSize;
  /**
   * Leave unset with `variant="serif"`, which always renders in regular weight. Any other weight
   * throws in dev.
   *
   * @default 'semibold'
   */
  weight?: HeadingWeight;
  /**
   * Visual variant of the heading.
   *
   * - `default`: the heading font (TASA Orbiter) at the given `size` and `weight`.
   * - `serif`: PT Serif at the 2xlarge size, regular weight. **Reserved for the agentic dashboard
   *   hero heading.** Its size and weight are fixed, so don't pass `size` or `weight` with it.
   *   Web only for now: on React Native it keeps the same size and weight in the default heading
   *   font.
   *
   * @default 'default'
   */
  variant?: 'default' | 'serif';
};

type GetHeadingPropsArgs = Pick<HeadingCommonProps, 'as' | 'color' | 'testID'> & {
  size?: HeadingSize;
  weight?: HeadingWeight;
  variant?: HeadingProps['variant'];
};

export const getHeadingProps = ({
  as,
  size: sizeProp,
  weight,
  color,
  testID,
  variant = 'default',
}: GetHeadingPropsArgs): Omit<BaseTextProps, 'children'> => {
  const isSerif = variant === 'serif';
  if (isSerif && __DEV__) {
    // The serif variant fixes its own size and weight. Passing different ones is a mistake.
    if (sizeProp && sizeProp !== '2xlarge') {
      throwBladeError({
        moduleName: 'Heading',
        message: `variant="serif" always renders at size="2xlarge". Remove size="${sizeProp}".`,
      });
    }
    if (weight && weight !== 'regular') {
      throwBladeError({
        moduleName: 'Heading',
        message: `variant="serif" always renders in regular weight, because PT Serif ships in regular weight only. Remove weight="${weight}".`,
      });
    }
  }

  // The serif variant fixes its own size; everything else defaults to small.
  const size: HeadingSize = isSerif ? '2xlarge' : sizeProp ?? 'small';
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
    // The serif variant always uses regular weight, on every platform: PT Serif ships in regular
    // weight only, and any other weight would make the browser fake bold.
    props.fontWeight = 'regular';
    if (isReactNative()) {
      // PT Serif isn't bundled for React Native yet, so only the font falls back.
      logger({
        message:
          'variant="serif" is web only for now. On React Native it renders in the default heading font at the same size and weight.',
        moduleName: 'Heading',
        type: 'warn',
      });
    } else {
      props.fontFamily = 'serif';
      // Design asked for -0.5px. Token 50 (-1.3%) gives -0.52px at 40px and -0.42px at 32px.
      props.letterSpacing = 50;
    }
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

const _Heading = (
  {
    as,
    // No defaults here: getHeadingProps falls back to small / semibold, and needs to know whether
    // a size or weight was passed so it can reject them with variant="serif".
    size,
    weight,
    color = 'surface.text.gray.normal',
    children,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    textTransform,
    variant,
    ...styledProps
  }: HeadingProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  useValidateAsProp({ componentName: 'Heading', as, validAsValues });

  const props = getHeadingProps({ as, size, weight, color, testID, variant });

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
