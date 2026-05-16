import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

import { makeSize } from '~utils';

import { getBaseMenuItemStyles } from './getBaseMenuItemStyles';

import type { StyledBaseMenuItemContainerProps } from '../types';

const StyledMenuItemContainer = styled(TouchableOpacity)<StyledBaseMenuItemContainerProps>(
  (props) => {
    return {
      ...getBaseMenuItemStyles({ theme: props.theme }),
      padding: makeSize(props.theme.spacing[3]),
      display: props.isVisible ? 'flex' : 'none',
      // React Native specific styles
      backgroundColor:
        props.isSelected && props.selectionType === 'single'
          ? props.theme.colors.interactive.background.primary.faded
          : undefined,
    };
  },
);

export { StyledMenuItemContainer };
