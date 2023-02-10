import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';

// It's not really styled here but have to keep name same since we have to style this with overflowY and maxWidth in web
const StyledListBoxWrapper = styled(ScrollView)((props) => ({
  ...getBaseListBoxWrapperStyles({ theme: props.theme }),
}));
export { StyledListBoxWrapper };
