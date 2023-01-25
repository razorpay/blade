import type { ListProps } from './List';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const listItemPaddingLeft: Record<
  NonNullable<ListProps['variant']>,
  Record<number, DotNotationSpacingStringToken>
> = {
  unordered: {
    1: 'spacing.2',
    2: 'spacing.4',
    3: 'spacing.5',
  },
  ordered: {
    1: 'spacing.2',
    2: 'spacing.5',
    3: 'spacing.5',
  },
};

const listItemBulletPaddingRight: Record<
  NonNullable<ListProps['variant']>,
  DotNotationSpacingStringToken
> = {
  unordered: 'spacing.3',
  ordered: 'spacing.2',
};

const listItemBulletPaddingTop: Record<
  NonNullable<
    Exclude<ListProps['variant'], 'unordered'> | 'unorderedWithIcon' | 'unorderedWithoutIcon'
  >,
  Record<
    TypographyPlatforms,
    Record<NonNullable<ListProps['size']>, number | DotNotationSpacingStringToken>
  >
> = {
  unorderedWithoutIcon: {
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
    // TODO: fix these
    onDesktop: {
      small: 0,
      medium: 0,
    },
    onMobile: {
      small: 0,
      medium: 0,
    },
  },
};

const listItemUnorderedBulletSize: Record<
  TypographyPlatforms,
  Record<NonNullable<ListProps['size']>, string>
> = {
  onDesktop: {
    small: '6px',
    medium: '6px',
  },
  onMobile: {
    small: '5px',
    medium: '6px',
  },
};

const listItemPaddingBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

export {
  listItemPaddingLeft,
  ComponentIds,
  listItemPaddingBottom,
  listItemBulletPaddingRight,
  listItemBulletPaddingTop,
  listItemUnorderedBulletSize,
};
