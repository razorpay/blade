import styled from 'styled-components';
import { useListContext } from './ListContext';

type ListItemProps = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[]
    | React.ReactNode;
};

const getPaddingByLevel = (level: number): string => {
  if (level == 1) {
    return '4px';
  } else if (level == 2) {
    return '12px';
  } else if (level == 3) {
    return '16px';
  }
  return '0px';
};

const StyledListItem = styled.li<{ level: number }>(({ level }) => ({
  paddingLeft: getPaddingByLevel(level),
}));

const ListItem = ({ children }: ListItemProps): React.ReactElement => {
  const { level } = useListContext();
  return <StyledListItem level={level}>{children}</StyledListItem>;
};

export { ListItem };
export type { ListItemProps };
