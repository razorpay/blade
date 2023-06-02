import type { CodeProps } from '../Typography';
import type { ListProps } from './List';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size } from '~tokens/global';

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

const listItemBulletMarginRight: Record<NonNullable<ListProps['variant']>, SpacingValueType> = {
  unordered: 'spacing.3',
  ordered: 'spacing.2',
  'ordered-filled': 'spacing.3',
};

const listItemBulletMarginTop: Record<
  NonNullable<ListProps['variant'] | 'unorderedWithIcon'>,
  Record<TypographyPlatforms, Record<NonNullable<ListProps['size']>, SpacingValueType>>
> = {
  // We need hard-coded non-tokenized spacing for bullet alignment in List
  // These size mappings can be found in here:
  // figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=23239-466987&t=easqqrPtzgMwCEtn-0
  unordered: {
    onDesktop: {
      small: makeSize(6),
      medium: makeSize(7),
    },
    onMobile: {
      small: makeSize(6),
      medium: makeSize(7),
    },
  },
  unorderedWithIcon: {
    onDesktop: {
      small: 'spacing.2',
      medium: 'spacing.1',
    },
    onMobile: {
      small: 'spacing.2',
      medium: 'spacing.1',
    },
  },
  ordered: {
    onDesktop: {
      small: makeSize(0),
      medium: makeSize(0),
    },
    onMobile: {
      small: makeSize(0),
      medium: makeSize(0),
    },
  },
  'ordered-filled': {
    // TODO: fix these
    onDesktop: {
      small: makeSize(0),
      medium: makeSize(0),
    },
    onMobile: {
      small: makeSize(0),
      medium: makeSize(0),
    },
  },
};

const listItemUnorderedBulletSize: Record<
  TypographyPlatforms,
  Record<NonNullable<ListProps['size']>, SpacingValueType>
> = {
  onDesktop: {
    small: makeSize(size[6]),
    medium: makeSize(size[6]),
  },
  onMobile: {
    small: makeSize(size[5]),
    medium: makeSize(size[6]),
  },
};

const listItemMarginBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

const listItemOrderedBulletBoxSize: Record<
  string,
  Record<TypographyPlatforms, Record<NonNullable<ListProps['size']>, SpacingValueType>>
> = {
  // We need hard-coded non-tokenized box sizes for bullet alignment in List
  ordered: {
    onDesktop: {
      small: makeSize(size[16]),
      medium: makeSize(size[20]),
    },
    onMobile: {
      small: makeSize(size[16]),
      medium: makeSize(size[24]),
    },
  },
  'ordered-filled': {
    onDesktop: {
      small: makeSize(size[18]),
      medium: makeSize(size[20]),
    },
    onMobile: {
      small: makeSize(size[16]),
      medium: makeSize(size[20]),
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
