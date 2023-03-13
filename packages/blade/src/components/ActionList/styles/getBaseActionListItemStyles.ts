import type React from 'react';
import type { CSSObject } from 'styled-components';
import type { TouchableOpacity } from 'react-native';
import type { ActionListItemProps } from '../ActionListItem';
import type { Theme } from '~components/BladeProvider';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { isReactNative, makeSize } from '~utils';

type StyledActionListItemProps = {
  selectionType: DropdownContextType['selectionType'];
  hasDescription: boolean;
  intent?: ActionListItemProps['intent'];
  onPress?: (e: React.TouchEvent<TouchableOpacity>) => void;
  isSelected?: boolean;
  isKeydownPressed: boolean;
};

const getBaseActionListItemStyles = (
  props: StyledActionListItemProps & { theme: Theme },
): CSSObject => {
  return {
    // @TODO: replace this with outline token when we add
    borderWidth: makeSize(props.theme.spacing[2]),
    borderStyle: 'solid',
    borderColor: 'transparent',
    textAlign: isReactNative() ? undefined : 'left',
    backgroundColor: 'transparent',
    padding: makeSize(props.theme.spacing[2]),
    borderRadius: makeSize(props.theme.border.radius.medium),
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
  };
};

export { getBaseActionListItemStyles, StyledActionListItemProps };
