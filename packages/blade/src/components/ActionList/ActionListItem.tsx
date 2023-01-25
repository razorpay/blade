import React from 'react';
import styled from 'styled-components';
import { StyledActionListItem } from './StyledActionListItem';
import { componentIds } from './componentIds';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { Text } from '~components/Typography';
import { isReactNative, makeAccessible, makeSize } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { Checkbox } from '~components/Checkbox';

const ActionListItemContext = React.createContext<{
  intent?: ActionListItemProps['intent'];
}>({});

const SectionDivider = styled(Box)((props) => ({
  height: makeSize(1),
  backgroundColor: props.theme.colors.surface.border.normal.lowContrast,
  marginLeft: makeSize(props.theme.spacing[3]),
  marginRight: makeSize(props.theme.spacing[3]),
}));

const StyledActionListSectionTitle = styled(Box)((props) => ({
  padding: makeSize(props.theme.spacing[3]),
}));

const ActionListSection = ({
  title,
  children,
  hideDivider,
}: {
  title: string;
  children: React.ReactNode[] | React.ReactNode;
  hideDivider?: boolean;
}): JSX.Element => {
  return (
    <Box>
      <StyledActionListSectionTitle>
        <Text color="surface.text.muted.lowContrast" size="small" weight="bold">
          {title}
        </Text>
      </StyledActionListSectionTitle>
      {children}
      {hideDivider ? null : <SectionDivider />}
    </Box>
  );
};

ActionListSection.componentId = componentIds.ActionListSection;

const ActionListItemIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
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

const ActionListItemText = ({ children }: { children: string }): JSX.Element => {
  return (
    <BaseText fontStyle="italic" fontSize={50} color="surface.text.muted.lowContrast">
      {children}
    </BaseText>
  );
};

const ActionListCheckboxWrapper = styled(Box)((_props) => ({
  pointerEvents: 'none',
}));

const getActionListItemRole = (href?: string): 'link' | 'menuitem' | 'option' => {
  if (href) {
    return 'link';
  }

  if (isReactNative()) {
    return 'menuitem';
  }

  return 'option';
};

/**
 *
 * ActionListItem
 *
 *
 */
type ActionListItemProps = {
  title: string;
  description?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  intent?: 'negative';
};

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

const ActionListItem = (props: ActionListItemProps): JSX.Element => {
  const {
    activeIndex,
    dropdownBaseId,
    onOptionClick,
    selectedIndices,
    setShouldIgnoreBlur,
    selectionType,
    selectInputRef,
  } = useDropdown();

  const renderOnWebAs = props.href ? 'a' : 'button';
  const isSelected =
    typeof props._index === 'number'
      ? selectedIndices.includes(props._index)
      : props.isDefaultSelected;

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
          role: getActionListItemRole(props.href),
        })}
        {...makeActionListItemClickable((e: React.MouseEvent<HTMLButtonElement>): void => {
          if (typeof props._index === 'number') {
            onOptionClick(e, props._index);
          }
          props.onClick?.(e);
        })}
        onFocus={() => {
          // We don't want to keep the browser's focus on option item. We move it to selectInput
          if (!isReactNative()) {
            selectInputRef.current?.focus();
          }
        }}
        onMouseDown={() => {
          setShouldIgnoreBlur(true);
        }}
        data-value={props.value}
        data-index={props._index}
        // Custom props for changes in styles
        selectionType={selectionType}
        hasDescription={!!props.description}
        intent={props.intent}
        isSelected={isSelected}
      >
        <Box display="flex" marginTop={props.description ? 'spacing.2' : undefined}>
          {selectionType === 'multiple' ? (
            // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
            <ActionListCheckboxWrapper
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
          paddingLeft={selectionType === 'multiple' ? 'spacing.1' : 'spacing.3'}
          paddingRight="spacing.3"
        >
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Text
              color={
                props.intent === 'negative'
                  ? 'feedback.text.negative.lowContrast'
                  : 'surface.text.normal.lowContrast'
              }
            >
              {props.title}
            </Text>
            {props.description ? (
              <Text color="surface.text.placeholder.lowContrast" size="small">
                {props.description}
              </Text>
            ) : null}
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          {props.trailing}
        </Box>
      </StyledActionListItem>
    </ActionListItemContext.Provider>
  );
};

ActionListItem.componentId = componentIds.ActionListItem;

export {
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
  ActionListItemProps,
  ActionListSection,
};
