import React from 'react';
import styled from 'styled-components';
import { StyledActionListItem } from './StyledActionListItem';
import { componentIds } from './componentIds';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import { validateActionListItemProps } from './actionListUtils';
import {
  getActionListItemRole,
  getActionListSectionRole,
  getSeparatorRole,
  isRoleMenu,
} from './getA11yRoles';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { Feedback } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import { isReactNative, makeAccessible, makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';
import { Checkbox } from '~components/Checkbox';
import { useTheme } from '~components/BladeProvider';

type ActionListItemProps = {
  title: string;
  description?: string;
  onClick?: (clickProps: { name: string; value?: boolean }) => void;
  value: string;
  href?: string;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   *
   * @private
   */
  _index?: number;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  isDefaultSelected?: boolean;
  intent?: Extract<Feedback, 'negative'>;
};

const ActionListItemContext = React.createContext<{
  intent?: ActionListItemProps['intent'];
}>({});

const StyledSectionDivider = styled(Box)((props) => ({
  // @TODO: replace this with token value if we add 1px token
  height: makeSize(1),
  backgroundColor: props.theme.colors.surface.border.normal.lowContrast,
  margin: `${makeSize(props.theme.spacing[1])} ${makeSize(props.theme.spacing[3])}`,
}));

const ActionListSectionDivider = (): JSX.Element => (
  <StyledSectionDivider
    {...makeAccessible({
      role: getSeparatorRole(),
    })}
  />
);

const StyledActionListSectionTitle = styled(Box)((props) => ({
  // @TODO: replace this styled-component with new layout box when we have padding shorthand
  padding: makeSize(props.theme.spacing[3]),
}));

type ActionListSectionProps = {
  title: string;
  children: React.ReactNode[] | React.ReactNode;
  /**
   * Internally used to hide the divider on final item in React Native.
   *
   * Should not be used by consumers (also won't work on web)
   *
   * @private
   */
  _hideDivider?: boolean;
};
const ActionListSection: WithComponentId<ActionListSectionProps> = ({
  title,
  children,
  _hideDivider,
}): JSX.Element => {
  return (
    <Box
      {...makeAccessible({
        role: getActionListSectionRole(),
        label: title,
      })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListSection)}
    >
      {/* We're announcing title as group label so we can hide this */}
      <StyledActionListSectionTitle {...makeAccessible({ hidden: true })}>
        <Text color="surface.text.muted.lowContrast" size="small" weight="bold">
          {title}
        </Text>
      </StyledActionListSectionTitle>
      <Box
        {...makeAccessible({
          // On web, we just wrap it in another listbox to announce item count properly for particular group.
          // On React Native, we ignore it since `menu` + `group` role will take care of accessibility
          role: isReactNative() ? undefined : 'listbox',
        })}
      >
        {children}
      </Box>
      {_hideDivider && isReactNative() ? null : <ActionListSectionDivider />}
    </Box>
  );
};

ActionListSection.componentId = componentIds.ActionListSection;

const ActionListItemIcon: WithComponentId<{ icon: IconComponent }> = ({ icon }): JSX.Element => {
  const Icon = icon;
  const { intent } = React.useContext(ActionListItemContext);
  return (
    <Icon
      color={
        intent === 'negative'
          ? 'feedback.icon.negative.lowContrast'
          : 'surface.text.muted.lowContrast'
      }
      size="medium"
    />
  );
};

ActionListItemIcon.componentId = componentIds.ActionListItemIcon;

const ActionListItemText: WithComponentId<{ children: string }> = ({ children }) => {
  return (
    <Text variant="caption" color="surface.text.muted.lowContrast">
      {children}
    </Text>
  );
};

ActionListItemText.componentId = componentIds.ActionListItemText;

const ActionListCheckboxWrapper = styled(Box)<{ hasDescription: boolean }>((_props) => ({
  pointerEvents: 'none',
}));

type ClickHandlerType = (e: React.MouseEvent<HTMLButtonElement>) => void;

const makeActionListItemClickable = (
  clickHandler: ClickHandlerType,
): { onPress?: StyledActionListItemProps['onPress']; onClick?: ClickHandlerType } => {
  if (isReactNative()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore: ignoring ReactNative press type for the peace of mind
    return { onPress: clickHandler };
  }

  return {
    onClick: clickHandler,
  };
};

const ActionListItem: WithComponentId<ActionListItemProps> = (props): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
    selectionType,
    triggererRef,
    dropdownTriggerer,
  } = useDropdown();

  const { theme } = useTheme();

  const renderOnWebAs = props.href ? 'a' : 'button';
  const isSelected =
    typeof props._index === 'number'
      ? selectedIndices.includes(props._index)
      : props.isDefaultSelected;

  React.useEffect(() => {
    validateActionListItemProps({
      leading: props.leading,
      trailing: props.trailing,
    });
  }, [props.leading, props.trailing]);

  React.useEffect(() => {
    if (dropdownTriggerer === 'SelectInput' && props.intent === 'negative') {
      throw new Error(
        '[ActionListItem]: negative intent ActionListItem cannot be used inside Dropdown with SelectInput trigger',
      );
    }
  }, [props.intent, dropdownTriggerer]);

  return (
    <ActionListItemContext.Provider value={{ intent: props.intent }}>
      <StyledActionListItem
        as={!isReactNative() ? renderOnWebAs : undefined}
        id={`${dropdownBaseId}-${props._index}`}
        tabIndex={-1}
        href={props.href}
        className={activeIndex === props._index ? 'active-focus' : ''}
        {...makeAccessible({
          selected: isSelected,
          current: isRoleMenu(dropdownTriggerer) ? isSelected : undefined,
          role: getActionListItemRole(dropdownTriggerer, props.href),
        })}
        {...makeActionListItemClickable((e: React.MouseEvent<HTMLButtonElement>): void => {
          if (typeof props._index === 'number') {
            onOptionClick(e, props._index);
          }
          props.onClick?.({ name: props.value, value: isSelected });
        })}
        {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListItem)}
        onFocus={() => {
          // We don't want to keep the browser's focus on option item. We move it to selectInput
          if (!isReactNative()) {
            triggererRef.current?.focus();
          }
        }}
        onMouseDown={() => {
          setShouldIgnoreBlur(true);
        }}
        data-value={props.value}
        data-index={props._index}
        // Custom props for changes in styles
        selectionType={selectionType}
        hasDescription={Boolean(props.description)}
        intent={props.intent}
        isSelected={isSelected}
      >
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          alignItems="center"
          maxHeight={isReactNative() ? undefined : theme.spacing[6]}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            {selectionType === 'multiple' ? (
              // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
              <ActionListCheckboxWrapper
                hasDescription={Boolean(props.description)}
                {...makeAccessible({
                  hidden: true,
                })}
              >
                <Checkbox isChecked={isSelected} tabIndex={-1}>
                  {/* 
                      Checkbox requires children. Didn't want to make it optional because its helpful for consumers
                      But for this case in particular, we just want to use Text separately so that we can control spacing and color and keep it consistent with non-multiselect dropdowns
                    */}
                  {null}
                </Checkbox>
              </ActionListCheckboxWrapper>
            ) : (
              props.leading
            )}
          </Box>
          <Box
            paddingLeft={selectionType === 'multiple' ? 'spacing.0' : 'spacing.3'}
            paddingRight="spacing.3"
          >
            <Text
              truncateAfterLines={1}
              color={
                props.intent === 'negative'
                  ? 'feedback.text.negative.lowContrast'
                  : 'surface.text.normal.lowContrast'
              }
            >
              {props.title}
            </Text>
          </Box>
          <Box marginLeft="auto">{props.trailing}</Box>
        </Box>
        <Box paddingLeft={props.leading || selectionType === 'multiple' ? 'spacing.7' : undefined}>
          {props.description ? (
            <Text color="surface.text.placeholder.lowContrast" size="small">
              {props.description}
            </Text>
          ) : null}
        </Box>
      </StyledActionListItem>
    </ActionListItemContext.Provider>
  );
};

ActionListItem.componentId = componentIds.ActionListItem;

export {
  ActionListItem,
  ActionListItemProps,
  ActionListItemIcon,
  ActionListItemText,
  ActionListSection,
  ActionListSectionProps,
  ActionListSectionDivider,
};
