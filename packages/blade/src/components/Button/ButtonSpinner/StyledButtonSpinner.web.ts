/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import styled from 'styled-components';
import getButtonSpinnerStyles from './getButtonSpinnerStyles';

const StyledButtonSpinner = styled.div(({ theme }) => getButtonSpinnerStyles(theme));

export default StyledButtonSpinner;
