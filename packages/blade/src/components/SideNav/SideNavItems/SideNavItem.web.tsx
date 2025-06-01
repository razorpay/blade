import styled from 'styled-components';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavItemProps } from '../types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';

const SideNavItemContainer = styled(BaseBox)((props) => {
  return {
    transition: getNavItemTransition(props.theme),
  };
});

const LeadingContainer = styled(Box)((props) => {
  return {
    transition: `all ${props.theme.motion.duration['2xquick']} ${props.theme.motion.easing.standard}`,
    willChange: 'transform',
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
    <TooltipifyComponent tooltip={tooltip}>
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
          <LeadingContainer>{leading}</LeadingContainer>
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
    </TooltipifyComponent>
  );
};

export { SideNavItem };
