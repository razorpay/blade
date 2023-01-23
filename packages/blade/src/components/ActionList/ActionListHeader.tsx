import React from 'react';
import styled from 'styled-components';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { makeSize } from '~utils';
import { BaseText } from '~components/Typography/BaseText';

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
        <BaseText color="surface.text.subdued.lowContrast" fontStyle="italic" fontSize={50}>
          {props.title}
        </BaseText>
      </Box>
    </StyledActionListHeader>
  );
};

const ActionListHeaderIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

export { ActionListHeader, ActionListHeaderIcon };
