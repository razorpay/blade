import styled from 'styled-components';
import React from 'react';
import { Text } from '../Typography';
import { useListContext } from './ListContext';
import { UnorderedItemIcon } from './ListItemIcons';
import { ListItemElement } from './ListItemElement';
import { bulletPadding } from './listTokens';
import Box from '~components/Box';
import { getIn } from '~utils';

type ListItemProps = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[]
    | React.ReactNode;
};

const StyledListItem = styled(ListItemElement)<{ level?: number }>(({ level, theme }) => ({
  paddingLeft: level ? getIn(theme, bulletPadding[level]) : 0,
}));

const ListItem = ({ children }: ListItemProps): React.ReactElement => {
  const { level } = useListContext();
  const childrenArray = React.Children.toArray(children);

  // const childItem = childrenArray.filter((child) =>
  //   child?.type?.displayName !== 'List' ? child : null,
  // );
  // const childList = childrenArray.filter((child) =>
  //   child?.type?.displayName === 'List' ? child : null,
  // );

  const childItem = childrenArray.filter((child) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    child?.props?._displayName !== 'List' ? child : null,
  );
  const childList = childrenArray.filter((child) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    child?.props?._displayName === 'List' ? child : null,
  );

  return (
    <StyledListItem level={level}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box paddingRight="spacing.3" display="flex">
          <UnorderedItemIcon level={level} />
        </Box>
        <Text variant="body" size="medium">
          {childItem}
        </Text>
      </Box>
      {childList}
    </StyledListItem>
  );
};

export { ListItem };
export type { ListItemProps };
