import styled from 'styled-components';
import Animated from 'react-native-reanimated';
import type { HoverlayProps } from './types';
import { getHoverlayStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';

const AnimatedBox = Animated.createAnimatedComponent(BaseBox);

const Hoverlay = styled(AnimatedBox)<HoverlayProps>((props) => {
  return getHoverlayStyles(props);
});

export { Hoverlay };
