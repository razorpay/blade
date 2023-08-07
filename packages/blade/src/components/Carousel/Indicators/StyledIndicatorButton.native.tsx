import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { getIndicatorButtonStyles } from './getIndicatorButtonStyles';
import type { IndicatorButtonProps } from './types';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';

const PressableIndicatorButton = styled(BaseBox)<
  Pick<IndicatorButtonProps, 'variant' | 'isActive'>
>(({ theme, isActive, variant }) => {
  return getIndicatorButtonStyles({ theme, isActive, variant });
});

const StyledIndicatorButton = ({
  onClick,
  accessibilityLabel,
  ...props
}: IndicatorButtonProps & { accessibilityLabel: string }): React.ReactElement => {
  return (
    <Pressable onPress={onClick} {...makeAccessible({ label: accessibilityLabel })}>
      <PressableIndicatorButton {...props} />
    </Pressable>
  );
};

export { StyledIndicatorButton };
