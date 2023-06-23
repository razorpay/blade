import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Pressable } from 'react-native';
import type { StyledAccordionButtonProps } from './types';

const StyledAccordionButton = styled(
  Animated.createAnimatedComponent(Pressable),
)<StyledAccordionButtonProps>((props) => {
  const { theme } = props;

  return {
    padding: theme.spacing[5],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
});

export { StyledAccordionButton };
