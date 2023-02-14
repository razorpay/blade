import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { isValidAllowedChildren, makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';
import { Text } from '~components/Typography';

const StyledActionListHeader = styled(BaseBox)((props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
  };
});

type ActionListHeaderProps = {
  title: string;
  /**
   * Asset to be added on left side of Header.
   *
   * Valid children - `ActionListHeaderIcon`
   */
  leading?: React.ReactNode;
};
/**
 * ### ActionListHeader
 *
 * To be used inside `ActionList`
 *
 * #### Usage
 *
 * ```jsx
 * <ActionListHeader
 *  title="Search Tips"
 *  leading={
 *    <ActionListHeaderIcon
 *      title="Recent Searches"
 *      icon={HistoryIcon}
 *    />
 *  }
 * />
 * ```
 */
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
      <BaseBox>{props.leading}</BaseBox>
      <BaseBox paddingLeft="spacing.3" paddingRight="spacing.3">
        <Text variant="caption" color="surface.text.subdued.lowContrast">
          {props.title}
        </Text>
      </BaseBox>
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
