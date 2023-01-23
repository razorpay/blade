import React from 'react';
import styled from 'styled-components';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { Text } from '~components/Typography';
import { getPlatformType, makeSize } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { Checkbox } from '~components/Checkbox';

const ActionListItemIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="medium" />;
};

const ActionListItemText = ({ children }: { children: string }): JSX.Element => {
  return (
    <BaseText fontStyle="italic" fontSize={50} color="surface.text.muted.lowContrast">
      {children}
    </BaseText>
  );
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
   */
  index?: number;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  isDefaultSelected?: boolean;
};
const StyledActionListItem = styled(Box)<{
  selectionType: DropdownContextType['selectionType'];
  hasDescription: boolean;
}>((props) => ({
  // @TODO: use token for borderWidth (currently its not present)
  borderWidth: makeSize(3),
  borderStyle: 'solid',
  borderColor: 'transparent',
  textAlign: 'left',
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'row',
  alignItems: props.hasDescription ? 'start' : 'center',
  padding: makeSize(props.theme.spacing[3]),
  borderRadius: makeSize(props.theme.border.radius.medium),
  textDecoration: 'none',
  cursor: 'pointer',
  width: '100%',
  '&:hover': {
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
  },
  '&.active-focus': {
    // @TODO: ask designer for exact color here (couldn't figure out from figma)
    borderColor: props.theme.colors.brand.primary[300],
  },
  // @TODO: ask designer what happens on selected item's hover
  '&[aria-selected=true]': {
    backgroundColor:
      props.selectionType === 'single' ? props.theme.colors.brand.primary[300] : undefined,
  },
}));
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

  const platformType = getPlatformType();
  const renderOnWebAs = props.href ? 'a' : 'button';
  const isReactNative = platformType === 'react-native';
  const isSelected =
    typeof props.index === 'number'
      ? selectedIndices.includes(props.index)
      : props.isDefaultSelected;

  return (
    <StyledActionListItem
      as={!isReactNative ? renderOnWebAs : undefined}
      id={`${dropdownBaseId}-${props.index}`}
      role="option"
      tabIndex={-1}
      data-value={props.value}
      data-index={props.index}
      aria-selected={isSelected}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (typeof props.index === 'number') {
          onOptionClick(e, props.index);
        }
        props.onClick?.(e);
      }}
      onFocus={() => {
        // We don't want to keep the browser's focus on option item. We move it to selectInput
        selectInputRef.current?.focus();
      }}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      href={props.href}
      className={activeIndex === props.index ? 'active-focus' : ''}
      selectionType={selectionType}
      hasDescription={!!props.description}
    >
      <Box display="flex" marginTop={props.description ? 'spacing.2' : undefined}>
        {selectionType === 'multiple' ? (
          // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
          <Checkbox isChecked={isSelected} aria-hidden={true} tabIndex={-1}>
            {/* 
              Checkbox requires children. Didn't want to make it optional because its helpful for consumers
              But for this case in particular, we just want to use Text separately so that we can control spacing and color and keep it consistent with non-multiselect dropdowns
            */}
            {null}
          </Checkbox>
        ) : (
          props.leading
        )}
      </Box>
      <Box
        paddingLeft={selectionType === 'multiple' ? 'spacing.1' : 'spacing.3'}
        paddingRight="spacing.3"
      >
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Text color="surface.text.normal.lowContrast">{props.title}</Text>
          <Text color="surface.text.placeholder.lowContrast" size="small">
            {props.description}
          </Text>
        </Box>
      </Box>
      <Box display="flex" marginLeft="auto">
        {props.trailing}
      </Box>
    </StyledActionListItem>
  );
};

export { ActionListItem, ActionListItemIcon, ActionListItemText, ActionListItemProps };
