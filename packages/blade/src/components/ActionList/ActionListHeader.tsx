import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { isValidAllowedChildren, makeSize, metaAttribute, MetaConstants } from '~utils';
import { Text } from '~components/Typography';
import type { TestID } from '~src/_helpers/types';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

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
} & TestID;
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
const _ActionListHeader = (props: ActionListHeaderProps): JSX.Element => {
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
      {...metaAttribute({ name: MetaConstants.ActionListHeader, testID: props.testID })}
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

const ActionListHeader = assignWithoutSideEffects(_ActionListHeader, {
  componentId: componentIds.ActionListHeader,
});

const _ActionListHeaderIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

const ActionListHeaderIcon = assignWithoutSideEffects(_ActionListHeaderIcon, {
  componentId: componentIds.ActionListHeaderIcon,
});

export { ActionListHeader, ActionListHeaderIcon, ActionListHeaderProps };
