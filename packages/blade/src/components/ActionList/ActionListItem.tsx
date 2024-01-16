/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import styled from 'styled-components';
import { StyledActionListItem } from './styles/StyledActionListItem';
import { componentIds } from './componentIds';
import type { StyledActionListItemProps } from './styles/getBaseActionListItemStyles';
import { validateActionListItemProps, getNormalTextColor } from './actionListUtils';
import { getActionListItemRole, getActionListSectionRole, isRoleMenu } from './getA11yRoles';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { FeedbackColors } from '~tokens/theme/theme';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { Checkbox } from '~components/Checkbox';
import { size } from '~tokens/global';
import type { DropdownProps } from '~components/Dropdown';
import type { StringChildrenType, TestID } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';
import type { BadgeProps } from '~components/Badge';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';

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
   * HTML target of the link
   */
  target?: string;
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
   * Item that goes immediately next to the title.
   *
   * Valid elements - `<ActionListItemBadge />`, `<ActionListItemBadgeGroup />`
   *
   */
  titleSuffix?: React.ReactElement;
  isDisabled?: boolean;
  intent?: Extract<FeedbackColors, 'negative'>;
  /**
   * Can be used in combination of `onClick` to highlight item as selected in Button Triggers.
   *
   * When trigger is SelectInput, Use `value` prop on SelectInput instead to make dropdown controlled.
   */
  isSelected?: boolean;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   *
   * @private
   */
  _index?: number;
} & TestID;

const ActionListItemContext = React.createContext<{
  intent?: ActionListItemProps['intent'];
  isDisabled?: ActionListItemProps['isDisabled'];
}>({});

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
  /**
   * Internally used to hide / show section in AutoComplete
   *
   * @private
   */
  _sectionChildValues?: string[];
} & TestID;
const _ActionListSection = ({
  title,
  children,
  testID,
  _hideDivider,
  _sectionChildValues,
}: ActionListSectionProps): React.ReactElement => {
  const { hasAutoCompleteInBottomSheetHeader, dropdownTriggerer, filteredValues } = useDropdown();
  const hasAutoComplete =
    hasAutoCompleteInBottomSheetHeader ||
    dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;

  const isSectionVisible = React.useMemo(() => {
    if (hasAutoComplete) {
      const visibleActionListItemInSection = _sectionChildValues?.find((actionItemValue) =>
        filteredValues.includes(actionItemValue),
      );

      return Boolean(visibleActionListItemInSection);
    }

    return true;
  }, [_sectionChildValues, hasAutoComplete, filteredValues]);

  const showDividerInRN = !(_hideDivider && isReactNative());
  const showDividerInAutoComplete = hasAutoComplete
    ? isSectionVisible && filteredValues.length > 1
    : true;

  return (
    <BaseBox
      {...makeAccessible({
        role: getActionListSectionRole(),
        label: title,
      })}
      {...metaAttribute({ name: MetaConstants.ActionListSection, testID })}
    >
      {/* We're announcing title as group label so we can hide this */}
      {isSectionVisible ? (
        <StyledActionListSectionTitle {...makeAccessible({ hidden: true })}>
          <Text color="surface.text.gray.muted" size="small" weight="semibold">
            {title}
          </Text>
        </StyledActionListSectionTitle>
      ) : null}
      <BaseBox
        {...makeAccessible({
          // On web, we just wrap it in another listbox to announce item count properly for particular group.
          // On React Native, we ignore it since `menu` + `group` role will take care of accessibility
          role: isReactNative() ? undefined : 'listbox',
        })}
      >
        {children}
      </BaseBox>
      {showDividerInAutoComplete && showDividerInRN ? (
        <Divider marginX="spacing.3" marginY="spacing.1" />
      ) : null}
    </BaseBox>
  );
};

const ActionListSection = assignWithoutSideEffects(_ActionListSection, {
  componentId: componentIds.ActionListSection,
});

const _ActionListItemIcon = ({ icon }: { icon: IconComponent }): React.ReactElement => {
  const Icon = icon;
  const { intent, isDisabled } = React.useContext(ActionListItemContext);
  const iconState = isDisabled ? 'disabled' : 'muted';
  return (
    <Icon
      color={
        intent === 'negative'
          ? 'feedback.icon.negative.intense'
          : `interactive.icon.gray.${iconState}`
      }
      size="medium"
    />
  );
};

const ActionListItemIcon = assignWithoutSideEffects(_ActionListItemIcon, {
  componentId: componentIds.ActionListItemIcon,
});

const _ActionListItemBadgeGroup = ({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}): React.ReactElement => {
  return (
    <Box display="flex" alignItems="center" flexDirection="row">
      {children}
    </Box>
  );
};

const ActionListItemBadgeGroup = assignWithoutSideEffects(_ActionListItemBadgeGroup, {
  componentId: componentIds.ActionListItemBadgeGroup,
});

const _ActionListItemBadge = (props: BadgeProps): React.ReactElement => {
  return <Badge size="medium" marginLeft="spacing.3" {...props} />;
};

const ActionListItemBadge = assignWithoutSideEffects(_ActionListItemBadge, {
  componentId: componentIds.ActionListItemBadge,
});

const _ActionListItemText = ({
  children,
}: {
  children: StringChildrenType;
}): React.ReactElement => {
  const { isDisabled } = React.useContext(ActionListItemContext);

  return (
    <Text variant="caption" color={getNormalTextColor(isDisabled, { isMuted: true })}>
      {children}
    </Text>
  );
};

const ActionListItemText = assignWithoutSideEffects(_ActionListItemText, {
  componentId: componentIds.ActionListItemText,
});

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

const _ActionListItemBody = ({
  selectionType,
  intent,
  description,
  isDisabled,
  leading,
  trailing,
  title,
  titleSuffix,
  isSelected,
}: Pick<
  ActionListItemProps,
  'intent' | 'isDisabled' | 'description' | 'trailing' | 'leading' | 'title' | 'titleSuffix'
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
        maxHeight={isReactNative() ? undefined : makeSize(size[20])}
      >
        <BaseBox display="flex" justifyContent="center" alignItems="center">
          {selectionType === 'multiple' ? (
            // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
            <BaseBox
              pointerEvents="none"
              paddingRight="spacing.2"
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
            </BaseBox>
          ) : (
            leading
          )}
        </BaseBox>
        <BaseBox
          paddingLeft={selectionType === 'multiple' || !leading ? 'spacing.0' : 'spacing.3'}
          paddingRight="spacing.3"
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <Text
            truncateAfterLines={1}
            color={
              intent === 'negative'
                ? 'feedback.text.negative.intense'
                : getNormalTextColor(isDisabled)
            }
          >
            {title}
          </Text>
          {titleSuffix}
        </BaseBox>
        <BaseBox marginLeft="auto">{trailing}</BaseBox>
      </BaseBox>
      <BaseBox paddingLeft={leading || selectionType === 'multiple' ? 'spacing.7' : undefined}>
        {description ? (
          <Text color={getNormalTextColor(isDisabled, { isMuted: true })} size="small">
            {description}
          </Text>
        ) : null}
      </BaseBox>
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
const _ActionListItem = (props: ActionListItemProps): React.ReactElement => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlurAnimation,
    selectionType,
    dropdownTriggerer,
    isKeydownPressed,
    filteredValues,
    hasAutoCompleteInBottomSheetHeader,
  } = useDropdown();

  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';
  const hasAutoComplete =
    hasAutoCompleteInBottomSheetHeader ||
    dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;

  const renderOnWebAs = props.href ? 'a' : 'button';

  /**
   * In SelectInput, returns the isSelected according to selected indexes in the state
   *
   * In Other Triggers (Menu Usecase), returns `props.isSelected` since passing the
   * isSelected prop explicitly is the only way to select item in menu
   */
  const getIsSelected = (): boolean | undefined => {
    if (dropdownTriggerer === dropdownComponentIds.triggers.SelectInput || hasAutoComplete) {
      if (typeof props._index === 'number') {
        return selectedIndices.includes(props._index);
      }

      return undefined;
    }

    return props.isSelected;
  };

  const isSelected = getIsSelected();

  React.useEffect(() => {
    validateActionListItemProps({
      leading: props.leading,
      trailing: props.trailing,
      titleSuffix: props.titleSuffix,
    });
  }, [props.leading, props.trailing, props.titleSuffix]);

  React.useEffect(() => {
    if (__DEV__) {
      if (
        dropdownTriggerer === dropdownComponentIds.triggers.SelectInput &&
        props.intent === 'negative'
      ) {
        throwBladeError({
          message:
            'negative intent ActionListItem cannot be used inside Dropdown with SelectInput trigger',
          moduleName: 'ActionListItem',
        });
      }
    }
  }, [props.intent, dropdownTriggerer]);

  return (
    <ActionListItemContext.Provider value={{ intent: props.intent, isDisabled: props.isDisabled }}>
      <StyledActionListItem
        isVisible={hasAutoComplete && filteredValues ? filteredValues.includes(props.value) : true}
        as={!isReactNative() ? renderOnWebAs : undefined}
        id={`${dropdownBaseId}-${props._index}`}
        type="button"
        tabIndex={-1}
        href={props.href}
        target={props.target}
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
            props.onClick?.({ name: props.value, value: isSelected });
          }
        })}
        {...metaAttribute({ name: MetaConstants.ActionListItem, testID: props.testID })}
        onMouseDown={() => {
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
        isMobile={isMobile}
      >
        <ActionListItemBody
          selectionType={selectionType}
          intent={props.intent}
          description={props.description}
          isDisabled={props.isDisabled}
          leading={props.leading}
          trailing={props.trailing}
          title={props.title}
          titleSuffix={props.titleSuffix}
          isSelected={isSelected}
        />
      </StyledActionListItem>
    </ActionListItemContext.Provider>
  );
};

const ActionListItem = assignWithoutSideEffects(React.memo(_ActionListItem), {
  componentId: componentIds.ActionListItem,
  displayName: componentIds.ActionListItem,
});

export type { ActionListItemProps, ActionListSectionProps };
export {
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
  ActionListItemBadge,
  ActionListItemBadgeGroup,
  ActionListSection,
};
