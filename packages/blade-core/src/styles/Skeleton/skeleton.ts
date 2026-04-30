import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
import { getSpacingValue } from '~utils/styledProps/spacingUtils';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './skeleton.module.css';

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
 * Build the inline style string for a Skeleton element. Covers arbitrary dimension
 * values and the flex/grid props that don't have a matching utility class.
 *
 * Returns `undefined` when no inline style is needed so the consumer can omit the
 * `style` attribute entirely.
 */
export function getSkeletonInlineStyle(props: SkeletonInlineStyleProps): string | undefined {
  const declarations: string[] = [];

  const dimension = (key: string, value: string | undefined): void => {
    if (value === undefined) return;
    const resolved = getSpacingValue(value);
    if (resolved !== undefined) {
      declarations.push(`${key}: ${resolved}`);
    }
  };

  dimension('width', props.width);
  dimension('max-width', props.maxWidth);
  dimension('min-width', props.minWidth);
  dimension('height', props.height);
  dimension('max-height', props.maxHeight);
  dimension('min-height', props.minHeight);

  if (props.alignContent !== undefined) {
    declarations.push(`align-content: ${props.alignContent}`);
  }
  if (props.justifyItems !== undefined) {
    declarations.push(`justify-items: ${props.justifyItems}`);
  }
  if (props.placeItems !== undefined) {
    declarations.push(`place-items: ${props.placeItems}`);
  }
  if (props.flexGrow !== undefined) {
    declarations.push(`flex-grow: ${props.flexGrow}`);
  }
  if (props.flexShrink !== undefined) {
    declarations.push(`flex-shrink: ${props.flexShrink}`);
  }
  if (props.flexBasis !== undefined) {
    const resolved = getSpacingValue(props.flexBasis);
    if (resolved !== undefined) {
      declarations.push(`flex-basis: ${resolved}`);
    }
  }
  if (props.order !== undefined) {
    declarations.push(`order: ${props.order}`);
  }

  return declarations.length > 0 ? declarations.join('; ') : undefined;
}
