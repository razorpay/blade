import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Chevron } from './Chevron';

import type { SelectChevronIconProps } from './types';

const StyledChevronIconContainer = styled(TouchableOpacity)((_props) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: 'auto',
}));

const InputChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
  return (
    <StyledChevronIconContainer accessibilityLabel="Chevron Icon" onPress={props.onClick}>
      <Chevron isDisabled={props.isDisabled} isOpen={props.isOpen} />
    </StyledChevronIconContainer>
  );
};

export { InputChevronIcon };
