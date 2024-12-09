import styled from 'styled-components';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavItemProps } from '../types';
import { TooltipifyNavItem } from './TooltipifyNavItem';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const SideNavItemContainer = styled(BaseBox)((props) => {
  return {
    transition: getNavItemTransition(props.theme),
  };
});

const SideNavItem = ({
  leading,
  trailing,
  title,
  backgroundColor,
  tooltip,
  as = 'div',
  ...rest
}: SideNavItemProps): React.ReactElement => {
  return (
    <TooltipifyNavItem tooltip={tooltip}>
      <SideNavItemContainer
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX="spacing.3"
        height={makeSize(NAV_ITEM_HEIGHT)}
        backgroundColor={backgroundColor}
        borderRadius="medium"
        as={as}
        cursor={as === 'label' ? 'pointer' : undefined}
        {...makeAnalyticsAttribute(rest)}
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
      </SideNavItemContainer>
    </TooltipifyNavItem>
  );
};

export { SideNavItem };
