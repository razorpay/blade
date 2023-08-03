import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';
import { makeAccessible } from '~utils/makeAccessible';

const PressableIndicatorButton = styled(Pressable)<IndicatorButtonProps>(
  ({ theme, isActive, variant }) => {
    return getIndicatorButtonStyles({ theme, isActive, variant });
  },
);

const StyledIndicatorButton = ({
  accessibilityLabel,
  ...props
}: IndicatorButtonProps & { accessibilityLabel: string }): React.ReactElement => {
  return (
    <PressableIndicatorButton
      {...props}
      {...makeAccessible({ label: accessibilityLabel })}
      onPress={props.onClick}
    />
  );
};

export { StyledIndicatorButton };
