import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const listItemPaddingLeft: Record<number, DotNotationSpacingStringToken> = {
  1: 'spacing.2',
  2: 'spacing.4',
  3: 'spacing.5',
};

const listItemPaddingBottom: DotNotationSpacingStringToken = 'spacing.3';

const ComponentIds = {
  List: 'List',
  ListItem: 'ListItem',
};

export { listItemPaddingLeft, ComponentIds, listItemPaddingBottom };
