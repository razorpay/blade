import type { CodeProps } from '../Typography';
import type { ListProps } from './List';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const listItemMarginLeft: Record<
  NonNullable<ListProps['variant'] | 'unorderedWithIcon'>,
  Record<number, DotNotationSpacingStringToken>
> = {
  unordered: {
    1: 'spacing.2',
    2: 'spacing.5',
    3: 'spacing.5',
  },
  unorderedWithIcon: {
    1: 'spacing.0',
    2: 'spacing.5',
    3: 'spacing.5',
  },
  ordered: {
    1: 'spacing.0',
    2: 'spacing.6',
    3: 'spacing.6',
  },
  'ordered-filled': {
    1: 'spacing.0',
    2: 'spacing.6',
    3: 'spacing.6',
  },
};

const listItemBulletMarginRight: Record<
  NonNullable<ListProps['variant']>,
  DotNotationSpacingStringToken
> = {
  unordered: 'spacing.3',
  ordered: 'spacing.2',
  'ordered-filled': 'spacing.3',
};

const listItemBulletMarginTop: Record<
  NonNullable<ListProps['variant'] | 'unorderedWithIcon'>,
  Record<
    TypographyPlatforms,
    Record<NonNullable<ListProps['size']>, number | DotNotationSpacingStringToken>
  >
> = {
  // We need hard-coded non-tokenized spacing for bullet alignment in List
  unordered: {
    onDesktop: {
      small: 6,
      medium: 'spacing.3',
    },
    onMobile: {
      small: 6,
      medium: 10,
    },
  },
  unorderedWithIcon: {
    onDesktop: {
      small: 'spacing.2',
      medium: 'spacing.1',
    },
    onMobile: {
      small: 'spacing.2',
      medium: 6,
    },
  },
  ordered: {
    onDesktop: {
      small: 0,
      medium: 0,
    },
    onMobile: {
      small: 0,
      medium: 0,
    },
  },
  'ordered-filled': {
    // TODO: fix these
    onDesktop: {
      small: 0,
      medium: 0,
    },
    onMobile: {
      small: 0,
      medium: 'spacing.1',
    },
  },
};

const listItemUnorderedBulletSize: Record<
  TypographyPlatforms,
  Record<NonNullable<ListProps['size']>, string>
> = {
  // We need hard-coded non-tokenized spacing for bullet alignment in List
  onDesktop: {
    small: '6px',
    medium: '6px',
  },
  onMobile: {
    small: '5px',
    medium: '6px',
  },
};

const listItemMarginBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

const listItemOrderedBulletBoxSize = {
  // We need hard-coded non-tokenized box sizes for bullet alignment in List
  ordered: {
    onDesktop: {
      small: '16px',
      medium: '20px',
    },
    onMobile: {
      small: '16px',
      medium: '24px',
    },
  },
  'ordered-filled': {
    onDesktop: {
      small: '18px',
      medium: '20px',
    },
    onMobile: {
      small: '16px',
      medium: '20px',
    },
  },
};

const listItemCodeSize: Record<NonNullable<ListProps['size']>, NonNullable<CodeProps['size']>> = {
  small: 'small',
  medium: 'small',
};

export {
  listItemMarginLeft,
  ComponentIds,
  listItemMarginBottom,
  listItemBulletMarginRight,
  listItemBulletMarginTop,
  listItemUnorderedBulletSize,
  listItemOrderedBulletBoxSize,
  listItemCodeSize,
};
