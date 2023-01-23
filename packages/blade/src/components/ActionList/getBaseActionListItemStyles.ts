import type React from 'react';
import type { CSSObject } from 'styled-components';
import type { TouchableOpacity } from 'react-native';
import type { ActionListItemProps } from './ActionListItem';
import type { Theme } from '~components/BladeProvider';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { isReactNative, makeSize } from '~utils';

type StyledActionListItemProps = {
  selectionType: DropdownContextType['selectionType'];
  hasDescription: boolean;
  intent?: ActionListItemProps['intent'];
  onPress: (e: React.TouchEvent<TouchableOpacity>) => void;
  isSelected?: boolean;
};

const getBaseActionListItemStyles = (
  props: StyledActionListItemProps & { theme: Theme },
): CSSObject => {
  return {
    // @TODO: use token for borderWidth (currently its not present)
    borderWidth: makeSize(3),
    borderStyle: 'solid',
    borderColor: 'transparent',
    textAlign: isReactNative() ? undefined : 'left',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: props.hasDescription ? 'flex-start' : 'center',
    padding: makeSize(props.theme.spacing[3]),
    borderRadius: makeSize(props.theme.border.radius.medium),
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
  };
};

export { getBaseActionListItemStyles, StyledActionListItemProps };
