import styled from 'styled-components';
import { classes, NAV_ITEM_HEIGHT, useSideNavTransition } from '../tokens';
import type { SideNavItemProps } from '../types';
import { TooltipifyNavItem } from './TooltipifyNavItem';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize, makeSpace } from '~utils';

const StyledNavItem = styled(BaseBox)((props) => {
  const { collapseItemPadding } = useSideNavTransition();
  return {
    transition: collapseItemPadding,
    [`.${classes.COLLAPSED} &`]: {
      padding: `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[3])}`,
      transition: collapseItemPadding,
    },
  };
});

const SideNavItem = ({
  leading,
  trailing,
  title,
  backgroundColor,
  tooltip,
  as = 'div',
}: SideNavItemProps): React.ReactElement => {
  return (
    <TooltipifyNavItem tooltip={tooltip}>
      <StyledNavItem
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX="spacing.4"
        height={makeSize(NAV_ITEM_HEIGHT)}
        backgroundColor={backgroundColor}
        borderRadius="medium"
        as={as}
      >
        <Box display="inline-flex" alignItems="center" gap="spacing.3">
          {leading}
          <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>
            <Text
              truncateAfterLines={1}
              weight="medium"
              size="medium"
              color="surface.text.gray.subtle"
            >
              {title}
            </Text>
          </BaseBox>
        </Box>
        <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>{trailing}</BaseBox>
      </StyledNavItem>
    </TooltipifyNavItem>
  );
};

export { SideNavItem };
