import styled from 'styled-components';
import { ListItem } from './ListItem';
import type { ListItemProps } from './ListItem';
import { ListProvider, useListContext } from './ListContext';

type ListProps = {
  variant?: 'unordered' | 'ordered';
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
};

const removeNativeListStyles = {
  listStyleType: 'none',
  padding: '0px',
  margin: '0px',
};

const UnorderedList = styled.ul(removeNativeListStyles);

const OrderedList = styled.ol(removeNativeListStyles);

const List = ({ variant = 'unordered', children }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? UnorderedList : OrderedList;
  const { level } = useListContext();
  // console.log('🚀 ~ file: List.tsx:24 ~ List ~ level', level);
  return (
    <ListProvider value={{ level: level ? level + 1 : 1 }}>
      <ListElement>{children}</ListElement>
    </ListProvider>
  );
};

List.ListItem = ListItem;

export { List };
export type { ListProps, ListItemProps };
