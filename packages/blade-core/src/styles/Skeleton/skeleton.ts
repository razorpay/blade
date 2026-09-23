import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './skeleton.module.css';
import { getSpacingValue } from '~utils/styledProps/spacingUtils';

export type SkeletonBorderRadius =
  | 'none'
  | '2xsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | 'max'
  | 'round';

export type SkeletonVariants = {
  borderRadius?: SkeletonBorderRadius;
};

export const skeletonStyles = cva(styles.skeleton, {
  variants: {
    borderRadius: {
      none: styles['radius-none'],
      '2xsmall': styles['radius-2xsmall'],
      xsmall: styles['radius-xsmall'],
      small: styles['radius-small'],
      medium: styles['radius-medium'],
      large: styles['radius-large'],
      xlarge: styles['radius-xlarge'],
      '2xlarge': styles['radius-2xlarge'],
      max: styles['radius-max'],
      round: styles['radius-round'],
    },
  },
});

export const skeletonClass = styles.skeleton;

export type SkeletonFlexProps = {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  placeSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
};

const alignItemsToUtility: Record<NonNullable<SkeletonFlexProps['alignItems']>, string> = {
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const justifyContentToUtility: Record<NonNullable<SkeletonFlexProps['justifyContent']>, string> = {
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  center: 'justify-center',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
  stretch: 'justify-stretch',
};

const alignSelfToUtility: Record<NonNullable<SkeletonFlexProps['alignSelf']>, string> = {
  auto: 'align-self-auto',
  'flex-start': 'align-self-start',
  'flex-end': 'align-self-end',
  center: 'align-self-center',
  baseline: 'align-self-baseline',
  stretch: 'align-self-stretch',
};

const justifySelfToUtility: Record<NonNullable<SkeletonFlexProps['justifySelf']>, string> = {
  auto: 'justify-self-auto',
  start: 'justify-self-start',
  end: 'justify-self-end',
  center: 'justify-self-center',
  stretch: 'justify-self-stretch',
};

const placeSelfToUtility: Record<NonNullable<SkeletonFlexProps['placeSelf']>, string> = {
  auto: 'place-self-auto',
  start: 'place-self-start',
  end: 'place-self-end',
  center: 'place-self-center',
  stretch: 'place-self-stretch',
};

/**
 * Build the class string for a Skeleton element. Combines the base/keyframe class,
 * the borderRadius CVA variant, and any flex enum utility classes that have a
 * predefined utility match.
 */
export function getSkeletonClasses(
  props: SkeletonVariants & SkeletonFlexProps & { className?: string },
): string {
  const {
    borderRadius,
    flexDirection,
    flexWrap,
    alignItems,
    justifyContent,
    alignSelf,
    justifySelf,
    placeSelf,
    className,
  } = props;

  const cvaClasses = skeletonStyles({ borderRadius });
  const utilities: string[] = [];

  if (flexDirection) {
    utilities.push(
      utilityClasses[`flex-direction-${flexDirection}` as keyof typeof utilityClasses],
    );
  }
  if (flexWrap) {
    utilities.push(utilityClasses[`flex-wrap-${flexWrap}` as keyof typeof utilityClasses]);
  }
  if (alignItems) {
    utilities.push(utilityClasses[alignItemsToUtility[alignItems] as keyof typeof utilityClasses]);
  }
  if (justifyContent) {
    utilities.push(
      utilityClasses[justifyContentToUtility[justifyContent] as keyof typeof utilityClasses],
    );
  }
  if (alignSelf) {
    utilities.push(utilityClasses[alignSelfToUtility[alignSelf] as keyof typeof utilityClasses]);
  }
  if (justifySelf) {
    utilities.push(
      utilityClasses[justifySelfToUtility[justifySelf] as keyof typeof utilityClasses],
    );
  }
  if (placeSelf) {
    utilities.push(utilityClasses[placeSelfToUtility[placeSelf] as keyof typeof utilityClasses]);
  }

  return [cvaClasses, ...utilities, className].filter(Boolean).join(' ');
}

export type SkeletonInlineStyleProps = {
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  alignContent?: string;
  justifyItems?: string;
  placeItems?: string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  order?: number;
};

/**
 * Resolve Skeleton's own style props into a prop → CSS value record (spacing
 * tokens resolved, unset props dropped). The caller feeds this record through
 * `getStyledProps('skeleton', …)` to build the `--skeleton-*` custom-property
 * style string consumed by `skeleton.module.css` — no raw inline declarations.
 */
export function getSkeletonStyleProps(
  props: SkeletonInlineStyleProps,
): Record<string, string | number> {
  const styleProps: Record<string, string | number> = {};

  const dimension = (key: string, value: string | undefined): void => {
    if (value === undefined) return;
    const resolved = getSpacingValue(value);
    if (resolved !== undefined) {
      styleProps[key] = resolved;
    }
  };

  dimension('width', props.width);
  dimension('maxWidth', props.maxWidth);
  dimension('minWidth', props.minWidth);
  dimension('height', props.height);
  dimension('maxHeight', props.maxHeight);
  dimension('minHeight', props.minHeight);

  if (props.alignContent !== undefined) {
    styleProps.alignContent = props.alignContent;
  }
  if (props.justifyItems !== undefined) {
    styleProps.justifyItems = props.justifyItems;
  }
  if (props.placeItems !== undefined) {
    styleProps.placeItems = props.placeItems;
  }
  if (props.flexGrow !== undefined) {
    styleProps.flexGrow = props.flexGrow;
  }
  if (props.flexShrink !== undefined) {
    styleProps.flexShrink = props.flexShrink;
  }
  if (props.flexBasis !== undefined) {
    const resolved = getSpacingValue(props.flexBasis);
    if (resolved !== undefined) {
      styleProps.flexBasis = resolved;
    }
  }
  if (props.order !== undefined) {
    styleProps.order = props.order;
  }

  return styleProps;
}
