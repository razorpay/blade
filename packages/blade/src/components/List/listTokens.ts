import type { CodeProps } from '../Typography';
import type { ListProps } from './List';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import { makeSize } from '~utils';
import sizes from '~tokens/global/sizes';

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
  onDesktop: {
    small: makeSize(sizes[150]),
    medium: makeSize(sizes[150]),
  },
  onMobile: {
    small: makeSize(sizes[125]),
    medium: makeSize(sizes[150]),
  },
};

const listItemMarginBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

const listItemOrderedBulletBoxSize = {
  ordered: {
    onDesktop: {
      small: makeSize(sizes[400]),
      medium: makeSize(sizes[500]),
    },
    onMobile: {
      small: makeSize(sizes[400]),
      medium: makeSize(sizes[600]),
    },
  },
  'ordered-filled': {
    onDesktop: {
      small: makeSize(sizes[450]),
      medium: makeSize(sizes[500]),
    },
    onMobile: {
      small: makeSize(sizes[400]),
      medium: makeSize(sizes[500]),
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
