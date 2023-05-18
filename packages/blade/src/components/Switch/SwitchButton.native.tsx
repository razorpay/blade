import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import styled from 'styled-components';
import { makeSpace } from '~utils';

const StyledSwitchButton = styled(Pressable)(({ theme }) => {
  return {
    appearance: 'none',
    border: 'none',
    backgroundColor: 'none',
    borderRadius: theme.border.radius.max,
    padding: 0,
    margin: makeSpace(theme.spacing[1]),
  };
});

type SwitchButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
} & PressableProps;

const SwitchButton = ({ children, onClick, ...props }: SwitchButtonProps): React.ReactElement => {
  return (
    <StyledSwitchButton onPress={onClick} {...props}>
      {children}
    </StyledSwitchButton>
  );
};

export { SwitchButton };
