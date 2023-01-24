import type { ListProps } from './List';
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

const listItemPaddingBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

export { listItemPaddingLeft, ComponentIds, listItemPaddingBottom, listItemBulletPaddingRight };
