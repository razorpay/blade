import React from 'react';
import styled from 'styled-components';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavItemProps } from '../types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';
import type { IconComponent } from '~components/Icons';

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
  const isIcon = typeof leading === 'function' && leading.name?.endsWith('Icon');
  const Icon: IconComponent | undefined = isIcon ? leading : undefined;

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
          {Icon ? (
            <BaseBox display="flex" alignItems="center" paddingX="spacing.2">
              <Icon size="medium" color="interactive.icon.gray.subtle" />
            </BaseBox>
          ) : (
            (leading as React.ReactNode)
          )}
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
