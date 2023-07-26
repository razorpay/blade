import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';

const PressableIndicatorButton = styled(Pressable)<IndicatorButtonProps>(
  ({ theme, isActive, variant }) => {
    return getIndicatorButtonStyles({ theme, isActive, variant });
  },
);

const StyledIndicatorButton = (props: IndicatorButtonProps): React.ReactElement => {
  return <PressableIndicatorButton {...props} onPress={props.onClick} />;
};

export { StyledIndicatorButton };
