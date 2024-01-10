import styled from 'styled-components';
import { getListStyleResetter } from './getListStyleResetter';

const UnorderedList = styled.ul(getListStyleResetter());

export { UnorderedList };
