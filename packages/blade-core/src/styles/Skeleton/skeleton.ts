import { cva } from 'class-variance-authority';
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

/**
 * CVA-based Skeleton styles (Tailwind). The base (`.blade-skeleton`) carries the dual-keyframe
 * fade-in + pulse animation from the plugin; border radius maps to `rounded-*` utilities.
 */
export const skeletonStyles = cva('blade-skeleton', {
  variants: {
    borderRadius: {
      none: 'rounded-none',
      '2xsmall': 'rounded-2xsmall',
      xsmall: 'rounded-xsmall',
      small: 'rounded-small',
      medium: 'rounded-medium',
      large: 'rounded-large',
      xlarge: 'rounded-xlarge',
      '2xlarge': 'rounded-2xlarge',
      max: 'rounded-max',
      round: 'rounded-round',
    },
  },
});

export const skeletonClass = 'blade-skeleton';

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

const flexDirectionToUtility: Record<NonNullable<SkeletonFlexProps['flexDirection']>, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
};

const flexWrapToUtility: Record<NonNullable<SkeletonFlexProps['flexWrap']>, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
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
  auto: 'self-auto',
  'flex-start': 'self-start',
  'flex-end': 'self-end',
  center: 'self-center',
  baseline: 'self-baseline',
  stretch: 'self-stretch',
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
    utilities.push(flexDirectionToUtility[flexDirection]);
  }
  if (flexWrap) {
    utilities.push(flexWrapToUtility[flexWrap]);
  }
  if (alignItems) {
    utilities.push(alignItemsToUtility[alignItems]);
  }
  if (justifyContent) {
    utilities.push(justifyContentToUtility[justifyContent]);
  }
  if (alignSelf) {
    utilities.push(alignSelfToUtility[alignSelf]);
  }
  if (justifySelf) {
    utilities.push(justifySelfToUtility[justifySelf]);
  }
  if (placeSelf) {
    utilities.push(placeSelfToUtility[placeSelf]);
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
