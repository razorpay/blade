import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { SelectChevronIconProps } from './SelectChevronIcon.web';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';

const StyledChevronIconContainer = styled(TouchableOpacity)((_props) => ({
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
}));

const SelectChevronIcon = (props: SelectChevronIconProps): React.ReactElement => {
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
      />{' '}
    </StyledChevronIconContainer>
  );
};

export { SelectChevronIcon };
