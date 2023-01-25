import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { makeSize } from '~utils';
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

const ActionListHeader = (props: { title: string; leading?: React.ReactNode }): JSX.Element => {
  return (
    <StyledActionListHeader>
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

const ActionListHeaderIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

export { ActionListHeader, ActionListHeaderIcon };
