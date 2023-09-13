import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { SelectChevronIconProps } from './types';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';

const StyledChevronIconContainer = styled(TouchableOpacity)((_props) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: 'auto',
}));

const InputChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
  return (
    <StyledChevronIconContainer accessibilityLabel="Chevron Icon" onPress={props.onClick}>
      <ChevronDownIcon
        display={props.isOpen ? 'none' : 'flex'}
        color="surface.text.normal.lowContrast"
        size="medium"
      />
      <ChevronUpIcon
        display={props.isOpen ? 'flex' : 'none'}
        color="surface.text.normal.lowContrast"
        size="medium"
      />
    </StyledChevronIconContainer>
  );
};

export { InputChevronIcon };
