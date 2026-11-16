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
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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

// A single object type (not a union), so consumers can still `interface X extends HeadingProps`
// and build wrappers with `Omit` / `Pick` over it.
export type HeadingProps = HeadingCommonProps & {
  size?: HeadingSize;
  weight?: HeadingWeight;
  /**
   * Renders the heading in PT Serif.
   *
   * **Reserved for the agentic dashboard hero heading.** Only works with `size="2xlarge"`, in
   * regular weight. Web only for now: on React Native the heading keeps the default heading font.
   *
   * @default false
   */
  isSerif?: boolean;
};

/**
 * Compile-time check for the common case: when `isSerif` is written as `true` directly on
 * `<Heading>`, TypeScript also requires `size="2xlarge"` and only allows `weight="regular"`.
 *
 * It can't see through a computed value (`isSerif={isHero}`) or props spread in from a wrapper
 * typed with `HeadingProps`. Those are checked at runtime instead, like Text's size/variant check:
 * any other size or weight throws in dev, and the heading keeps the default font in production.
 */
type HeadingSerifGuard<T> = T extends { isSerif: true }
  ? { size: '2xlarge'; weight?: 'regular' }
  : unknown;

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
    // Invalid combinations are reachable through a computed `isSerif={...}`, which the types
    // can't catch. Fail loudly in dev, and degrade gracefully in production.
    if (__DEV__) {
      if (size !== '2xlarge') {
        throwBladeError({
          moduleName: 'Heading',
          message: `isSerif is only supported with size="2xlarge". Received size="${size}".`,
        });
      }
      if (weight && weight !== 'regular') {
        throwBladeError({
          moduleName: 'Heading',
          message: `isSerif only supports weight="regular", because PT Serif ships in regular weight only. Received weight="${weight}".`,
        });
      }
    }

    if (size !== '2xlarge') {
      // Production fallback: keep the default heading font.
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
    size = 'small',
    // No default here: getHeadingProps falls back to semibold, and needs to know whether a
    // weight was passed so it can reject non-regular weights with isSerif.
    weight,
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

// Plain forwardRef component that Storybook's docgen reads (it can't read the generic signature
// below). Exported only as HeadingBase, which ./index.ts keeps out of the public API.
const Heading = assignWithoutSideEffects(React.forwardRef(_Heading), {
  displayName: 'Heading',
});

// forwardRef drops generics, so the serif guard is added back on the public signature.
// Same object as the component above at runtime, so it shares the docgen info.
const GuardedHeading = Heading as (<T extends HeadingProps>(
  props: T & HeadingSerifGuard<T> & React.RefAttributes<BladeElementRef>,
) => ReactElement) &
  // Keep forwardRef's statics ($$typeof, displayName, ...) so React.ElementRef<typeof Heading>
  // and friends keep working. Pick drops only the loose call signature.
  Pick<typeof Heading, keyof typeof Heading>;

export { GuardedHeading as Heading, Heading as HeadingBase };
