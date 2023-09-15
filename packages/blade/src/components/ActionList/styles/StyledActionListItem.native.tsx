import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import { getBaseActionListItemStyles } from './getBaseActionListItemStyles';

const StyledActionListItem = styled(TouchableOpacity)<StyledActionListItemProps>((props) => {
  return {
    ...getBaseActionListItemStyles(props),
    display: props.isVisible ? 'flex' : 'none',
    // React Native specific styles
    backgroundColor:
      props.isSelected && props.selectionType === 'single'
        ? props.theme.colors.brand.primary[300]
        : undefined,
  };
});

export { StyledActionListItem };
