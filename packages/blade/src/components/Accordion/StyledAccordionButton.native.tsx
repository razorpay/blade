import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { getCommonAccordionButtonStyles } from './commonStyles';

import type { StyledAccordionButtonProps } from './types';

const StyledAccordionButton = styled(
  Animated.createAnimatedComponent(Pressable),
)<StyledAccordionButtonProps>(getCommonAccordionButtonStyles);

export { StyledAccordionButton };
