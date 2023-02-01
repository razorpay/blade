import React from 'react';
import styled from 'styled-components';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import { getActionListProperties } from './actionListUtils';
import Box from '~components/Box';
import { useDropdown } from '~components/Dropdown/useDropdown';
import {
  isReactNative,
  makeAccessible,
  makeSize,
  isAndroid,
  metaAttribute,
  MetaConstants,
} from '~utils';
import { useTheme } from '~components/BladeProvider';

type ActionListProps = {
  children: React.ReactNode[];
  surfaceLevel?: 2 | 3;
};

const getReactNativeShadow = ({
  offsetX,
  offsetY,
  shadowColor,
  blur,
}: {
  offsetX: number;
  offsetY: number;
  shadowColor: string;
  blur: number;
}): {
  shadowOpacity?: '1';
  shadowRadius?: number;
  shadowColor?: string;
  shadowOffset?: string;
} => {
  if (isReactNative()) {
    return {
      shadowOpacity: '1',
      shadowRadius: isReactNative() ? undefined : blur,
      shadowColor: isAndroid() ? undefined : shadowColor,
      shadowOffset: `${makeSize(offsetX)} ${makeSize(offsetY)}`,
    };
  }

  return {};
};

const StyledActionList = styled(Box)<{
  surfaceLevel: ActionListProps['surfaceLevel'];
  elevation?: number;
}>((props) => {
  const { theme, surfaceLevel = 2 } = props;

  const shadowColor = theme.shadows.color.level[1];

  // @TODO: tokenize shadows and replace the logic here
  const elevation200 = `${makeSize(theme.shadows.offsetX.level[1])} ${makeSize(0)} ${makeSize(
    theme.shadows.blurRadius.level[1],
  )} 0px ${shadowColor}, ${makeSize(theme.shadows.offsetX.level[1])} ${makeSize(
    theme.shadows.offsetY.level[2],
  )} ${makeSize(theme.shadows.blurRadius.level[2])} 0px ${shadowColor}`;

  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    backgroundColor,
    borderWidth: theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderRadius: makeSize(theme.border.radius.medium),
    padding: makeSize(theme.spacing[3]),
    boxShadow: isReactNative() ? undefined : elevation200,

    // For react native. Ignored in web
    ...getReactNativeShadow({
      offsetX: theme.shadows.offsetX.level[1],
      offsetY: 0,
      shadowColor,
      blur: theme.shadows.blurRadius.level[1],
    }),
  };
});

const StyledListBoxWrapper = styled(Box)((_props) => {
  if (!isReactNative()) {
    return {
      [`& [role=group]:last-child > [role=separator]:last-child`]: {
        display: 'none',
      },
    };
  }

  return {};
});

const ActionList = ({ children, surfaceLevel = 2 }: ActionListProps): JSX.Element => {
  const {
    setOptions,
    actionListRef,
    selectionType,
    dropdownBaseId,
    setSelectedIndices,
    dropdownTriggerer,
    hasFooterAction,
  } = useDropdown();

  const { theme } = useTheme();

  const {
    childrenWithId,
    actionListOptions,
    defaultSelectedIndices,
    actionListHeaderChild,
    actionListFooterChild,
  } = React.useMemo(() => getActionListProperties(children), [children]);

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionListOptions]);

  React.useEffect(() => {
    setSelectedIndices(defaultSelectedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionListContainerRole = getActionListContainerRole(hasFooterAction, dropdownTriggerer);
  const actionListItemWrapperRole = getActionListItemWrapperRole(
    hasFooterAction,
    dropdownTriggerer,
  );
  const isMultiSelectable = selectionType === 'multiple';

  return (
    <StyledActionList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      surfaceLevel={surfaceLevel}
      elevation={theme.shadows.androidElevation.level[2]}
      id={`${dropdownBaseId}-actionlist`}
      {...makeAccessible({
        role: actionListContainerRole,
        multiSelectable: actionListContainerRole === 'listbox' ? isMultiSelectable : undefined,
        labelledBy: `${dropdownBaseId}-label`,
      })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.ActionList)}
    >
      {actionListHeaderChild}
      <StyledListBoxWrapper
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      >
        {childrenWithId}
      </StyledListBoxWrapper>
      {actionListFooterChild}
    </StyledActionList>
  );
};

export { ActionList };
