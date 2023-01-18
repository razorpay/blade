import { ListItem } from './ListItem';
import type { ListItemProps } from './ListItem';
import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { metaAttribute, MetaConstants } from '~utils';

type ListProps = {
  variant?: 'unordered' | 'ordered';
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
};

const List = ({ variant = 'unordered', children }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? UnorderedList : OrderedList;
  const { level } = useListContext();
  // console.log('🚀 ~ file: List.tsx:24 ~ List ~ level', level);
  return (
    <ListProvider value={{ level: level ? level + 1 : 1 }}>
      <ListElement {...metaAttribute(MetaConstants.Component, MetaConstants.List)}>
        {children}
      </ListElement>
    </ListProvider>
  );
};

List.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  _displayName: 'List',
};

List.ListItem = ListItem;

export { List };
export type { ListProps, ListItemProps };
