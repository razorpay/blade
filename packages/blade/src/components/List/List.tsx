import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { ComponentIds } from './listTokens';
import type { ListItemProps } from './ListItem';
import { metaAttribute, MetaConstants } from '~utils';

type ListProps = {
  variant?: 'unordered' | 'ordered';
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
};

const List = ({ variant = 'unordered', children }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? UnorderedList : OrderedList;
  const { level } = useListContext();

  return (
    <ListProvider value={{ level: level ? level + 1 : 1 }}>
      <ListElement {...metaAttribute(MetaConstants.Component, MetaConstants.List)}>
        {children}
      </ListElement>
    </ListProvider>
  );
};

List.componentId = ComponentIds.List;

export { List };
export type { ListProps };
