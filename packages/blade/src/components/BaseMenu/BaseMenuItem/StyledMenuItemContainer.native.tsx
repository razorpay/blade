import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
import type { StyledBaseMenuItemContainerProps } from '../types';
import { getBaseMenuItemStyles } from './getBaseMenuItemStyles';
import { makeSize } from '~utils';

const StyledMenuItemContainer = styled(TouchableOpacity)<StyledBaseMenuItemContainerProps>(
  (props) => {
    return {
      ...getBaseMenuItemStyles({ theme: props.theme }),
      padding: makeSize(props.theme.spacing[3]),
      display: props.isVisible ? 'flex' : 'none',
      // React Native specific styles
      // Match web's selected-item highlight which uses a neutral gray token
      // (see StyledMenuItemContainer.web.tsx aria-selected styles) instead of the primary/blue token.
      backgroundColor:
        props.isSelected && props.selectionType === 'single'
          ? props.theme.colors.interactive.background.gray.fadedHighlighted
          : undefined,
    };
  },
);

export { StyledMenuItemContainer };
