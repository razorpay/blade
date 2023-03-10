/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import styled from 'styled-components';
import { StyledActionListItem } from './styles/StyledActionListItem';
import { componentIds } from './componentIds';
import type { StyledActionListItemProps } from './styles/getBaseActionListItemStyles';
import { validateActionListItemProps, getNormalTextColor } from './actionListUtils';
import {
  getActionListItemRole,
  getActionListSectionRole,
  getSeparatorRole,
  isRoleMenu,
} from './getA11yRoles';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { Feedback } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import { isReactNative, makeAccessible, makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';
import { Checkbox } from '~components/Checkbox';
import size from '~tokens/global/size';
import type { StringChildrenType } from '~src/_helpers/types';
import type { DropdownProps } from '~components/Dropdown';

type ActionListItemProps = {
  title: string;
  description?: string;
  onClick?: (clickProps: { name: string; value?: boolean }) => void;
  /**
   * value that you get from `onChange` event on SelectInput or in form submissions.
   */
  value: string;
  /**
   * Link to open when item is clicked.
   */
  href?: string;
  /**
   * Item that goes on left-side of item.
   *
   * Valid elements - `<ActionListItemIcon />`, `<ActionListItemAsset />`
   *
   * Will be overriden in multiselect
   */
  leading?: React.ReactNode;
  /**
   * Item that goes on right-side of item.
   *
   * Valid elements - `<ActionListItemText />`, `<ActionListItemIcon />`
   */
  trailing?: React.ReactNode;
  /**
   * If item is selected on page load
   */
  isDefaultSelected?: boolean;
  isDisabled?: boolean;
  intent?: Extract<Feedback, 'negative'>;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   *
   * @private
   */
  _index?: number;
};

const ActionListItemContext = React.createContext<{
  intent?: ActionListItemProps['intent'];
  isDisabled?: ActionListItemProps['isDisabled'];
}>({});

const StyledSectionDivider = styled(BaseBox)((props) => ({
  height: makeSize(size[1]),
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

const StyledActionListSectionTitle = styled(BaseBox)((props) => ({
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
    <BaseBox
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
      <BaseBox
        {...makeAccessible({
          // On web, we just wrap it in another listbox to announce item count properly for particular group.
          // On React Native, we ignore it since `menu` + `group` role will take care of accessibility
          role: isReactNative() ? undefined : 'listbox',
        })}
      >
        {children}
      </BaseBox>
      {_hideDivider && isReactNative() ? null : <ActionListSectionDivider />}
    </BaseBox>
  );
};

ActionListSection.componentId = componentIds.ActionListSection;

const ActionListItemIcon: WithComponentId<{ icon: IconComponent }> = ({ icon }): JSX.Element => {
  const Icon = icon;
  const { intent, isDisabled } = React.useContext(ActionListItemContext);
  return (
    <Icon
      color={
        intent === 'negative'
          ? 'feedback.icon.negative.lowContrast'
          : getNormalTextColor(isDisabled, { isMuted: true })
      }
      size="medium"
    />
  );
};

ActionListItemIcon.componentId = componentIds.ActionListItemIcon;

const ActionListItemText: WithComponentId<{ children: StringChildrenType }> = ({ children }) => {
  const { isDisabled } = React.useContext(ActionListItemContext);

  return (
    <Text variant="caption" color={getNormalTextColor(isDisabled, { isMuted: true })}>
      {children}
    </Text>
  );
};

ActionListItemText.componentId = componentIds.ActionListItemText;

const ActionListCheckboxWrapper = styled(BaseBox)<{ hasDescription: boolean }>((_props) => ({
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

const ActionListItemDescription = ({
  leading,
  selectionType,
  isDisabled,
  description,
}: Pick<ActionListItemProps, 'leading' | 'description' | 'isDisabled'> & {
  selectionType: 'single' | 'multiple';
}): React.ReactElement => {
  return (
    <BaseBox paddingLeft={leading || selectionType === 'multiple' ? 'spacing.7' : undefined}>
      {description ? (
        <Text color={getNormalTextColor(isDisabled, { isMuted: true })} size="small">
          {description}
        </Text>
      ) : null}
    </BaseBox>
  );
};

const _ActionListItemLeading = ({
  selectionType,
  isSelected,
  description,
  isDisabled,
  leading,
}: Pick<ActionListItemProps, 'description' | 'isDisabled' | 'leading'> & {
  selectionType: DropdownProps['selectionType'];
  isSelected?: boolean;
}): React.ReactElement => {
  return (
    <BaseBox display="flex" justifyContent="center" alignItems="center">
      {selectionType === 'multiple' ? (
        // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
        <ActionListCheckboxWrapper
          hasDescription={Boolean(description)}
          {...makeAccessible({
            hidden: true,
          })}
        >
          <Checkbox isChecked={isSelected} tabIndex={-1} isDisabled={isDisabled}>
            {/* 
              Checkbox requires children. Didn't want to make it optional because its helpful for consumers
              But for this case in particular, we just want to use Text separately so that we can control spacing and color and keep it consistent with non-multiselect dropdowns
            */}
            {null}
          </Checkbox>
        </ActionListCheckboxWrapper>
      ) : (
        leading
      )}
    </BaseBox>
  );
};
const ActionListItemLeading = React.memo(_ActionListItemLeading);

const _ActionListItemTitle = ({
  selectionType,
  intent,
  leading,
  isDisabled,
  title,
}: Pick<ActionListItemProps, 'intent' | 'isDisabled' | 'leading' | 'title'> &
  Pick<DropdownProps, 'selectionType'>): React.ReactElement => {
  // console.log('rerender _ActionListItemTitle');
  return (
    <BaseBox
      paddingLeft={selectionType === 'multiple' || !leading ? 'spacing.0' : 'spacing.3'}
      paddingRight="spacing.3"
    >
      <Text
        truncateAfterLines={1}
        color={
          intent === 'negative'
            ? 'feedback.text.negative.lowContrast'
            : getNormalTextColor(isDisabled)
        }
      >
        {title}
      </Text>
    </BaseBox>
  );
};

const ActionListItemTitle = React.memo(_ActionListItemTitle);

const _ActionListItemBody = ({
  selectionType,
  intent,
  description,
  isDisabled,
  leading,
  trailing,
  title,
  isSelected,
}: Pick<
  ActionListItemProps,
  'intent' | 'isDisabled' | 'description' | 'trailing' | 'leading' | 'title'
> & {
  selectionType: DropdownProps['selectionType'];
  isSelected?: boolean;
}): React.ReactElement => {
  return (
    <>
      <BaseBox
        display="flex"
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        maxHeight={isReactNative() ? undefined : size[20]}
      >
        <ActionListItemLeading
          selectionType={selectionType}
          description={description}
          isSelected={isSelected}
          isDisabled={isDisabled}
          leading={leading}
        />
        <ActionListItemTitle
          selectionType={selectionType}
          intent={intent}
          leading={leading}
          isDisabled={isDisabled}
          title={title}
        />
        <BaseBox marginLeft="auto">{trailing}</BaseBox>
      </BaseBox>
      <ActionListItemDescription
        description={description}
        isDisabled={isDisabled}
        leading={leading}
        selectionType="multiple"
      />
    </>
  );
};

const ActionListItemBody = React.memo(_ActionListItemBody);

/**
 * ### ActionListItem
 *
 * Creates option inside `ActionList`.
 *
 * #### Usage
 *
 * ```jsx
 * <ActionList>
 *  <ActionListItem
 *    title="Home"
 *    value="home"
 *    leading={<ActionListItemIcon icon={HomeIcon} />}
 *    trailing={<ActionListItemText>⌘ + S</ActionListItemText>}
 *  />
 * </ActionList>
 * ```
 */
const _ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
    setShouldIgnoreBlurAnimation,
    selectionType,
    dropdownTriggerer,
    isKeydownPressed,
  } = useDropdown();
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

  console.log('item', props._index);
  return (
    <ActionListItemContext.Provider value={{ intent: props.intent, isDisabled: props.isDisabled }}>
      <StyledActionListItem
        as={!isReactNative() ? renderOnWebAs : undefined}
        id={`${dropdownBaseId}-${props._index}`}
        type="button"
        tabIndex={-1}
        href={props.href}
        className={activeIndex === props._index ? 'active-focus' : ''}
        {...makeAccessible({
          selected: isSelected,
          current: isRoleMenu(dropdownTriggerer) ? isSelected : undefined,
          role: getActionListItemRole(dropdownTriggerer, props.href),
          disabled: props.isDisabled,
        })}
        {...makeActionListItemClickable((e: React.MouseEvent<HTMLButtonElement>): void => {
          if (typeof props._index === 'number') {
            onOptionClick(e, props._index);
          }
          props.onClick?.({ name: props.value, value: isSelected });
        })}
        {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListItem)}
        onMouseDown={() => {
          setShouldIgnoreBlur(true);
          // We want to keep focus on Dropdown's trigger while option is being clicked
          // So We set this flag that ignores the blur animation to avoid the flicker between focus out + focus in
          setShouldIgnoreBlurAnimation(true);
        }}
        onMouseUp={() => {
          // (Contd from above comment...) We set this flag back to false since blur of SelectInput is done calling by this time
          setShouldIgnoreBlurAnimation(false);
        }}
        data-value={props.value}
        data-index={props._index}
        // Custom props for changes in styles
        selectionType={selectionType}
        hasDescription={Boolean(props.description)}
        intent={props.intent}
        isSelected={isSelected}
        isKeydownPressed={isKeydownPressed}
      >
        <ActionListItemBody
          selectionType={selectionType}
          intent={props.intent}
          description={props.description}
          isDisabled={props.isDisabled}
          leading={props.leading}
          trailing={props.trailing}
          title={props.title}
          isSelected={isSelected}
        />
      </StyledActionListItem>
    </ActionListItemContext.Provider>
  );
};

const ActionListItem = React.memo(_ActionListItem);
// @ts-expect-error
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
