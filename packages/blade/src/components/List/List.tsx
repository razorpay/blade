import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { ComponentIds } from './listTokens';
import type { ListItemProps } from './ListItem';
import { metaAttribute, MetaConstants } from '~utils';

type ListProps = {
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
  variant?: 'unordered' | 'ordered';
  size?: 'small' | 'medium';
};

const List = ({ variant = 'unordered', size, children }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? UnorderedList : OrderedList;
  const { level, size: listContextSize } = useListContext();

  return (
    <ListProvider value={{ level: level ? level + 1 : 1, size: size ?? listContextSize }}>
      <ListElement {...metaAttribute(MetaConstants.Component, MetaConstants.List)}>
        {children}
      </ListElement>
    </ListProvider>
  );
};

List.componentId = ComponentIds.List;

export { List };
export type { ListProps };
