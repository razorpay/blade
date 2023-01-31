import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { isValidAllowedChildren, makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';
import { Text } from '~components/Typography';

const StyledActionListHeader = styled(Box)((props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    margin: `-${makeSize(props.theme.spacing[3])} -${makeSize(props.theme.spacing[3])} ${makeSize(
      props.theme.spacing[3],
    )}`,
  };
});

type ActionListHeaderProps = {
  title: string;
  leading?: React.ReactNode;
};
const ActionListHeader: WithComponentId<ActionListHeaderProps> = (props): JSX.Element => {
  React.useEffect(() => {
    React.Children.map(props.leading, (child) => {
      if (!isValidAllowedChildren(child, componentIds.ActionListHeaderIcon)) {
        throw new Error(
          `[ActionListHeader]: Only ${componentIds.ActionListHeaderIcon} is allowed in leading prop`,
        );
      }
    });
  }, [props.leading]);

  return (
    <StyledActionListHeader
      {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListHeader)}
    >
      <Box>{props.leading}</Box>
      <Box paddingLeft="spacing.3" paddingRight="spacing.3">
        <Text variant="caption" color="surface.text.subdued.lowContrast">
          {props.title}
        </Text>
      </Box>
    </StyledActionListHeader>
  );
};

ActionListHeader.componentId = componentIds.ActionListHeader;

const ActionListHeaderIcon: WithComponentId<{ icon: IconComponent }> = ({ icon }) => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

ActionListHeaderIcon.componentId = componentIds.ActionListHeaderIcon;

export { ActionListHeader, ActionListHeaderIcon, ActionListHeaderProps };
