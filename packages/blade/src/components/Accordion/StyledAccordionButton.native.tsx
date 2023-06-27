import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Pressable } from 'react-native';
import type { StyledAccordionButtonProps } from './types';
import { getCommonAccordionButtonStyles } from './commonStyles';

const StyledAccordionButton = styled(
  Animated.createAnimatedComponent(Pressable),
)<StyledAccordionButtonProps>(getCommonAccordionButtonStyles);

export { StyledAccordionButton };
