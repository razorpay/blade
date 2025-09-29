import BaseBox from '~components/Box/BaseBox';
import styled from 'styled-components';

const StyledCounterInput = styled(BaseBox)`
  &.__blade-counter-input .focus-ring-wrapper {
    outline: none;
  }

  &.__blade-counter-input .__blade-base-input-wrapper {
    box-shadow: none;
    background-color: transparent !important;
  }

  /* Hide number input arrows */
  &.__blade-counter-input input[type='number']::-webkit-inner-spin-button,
  &.__blade-counter-input input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &.__blade-counter-input input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }

  /* Remove ProgressBar background */
  &.__blade-counter-input [data-blade-component='progress-bar'] > div > div > div {
    background-color: transparent !important;
  }
`;

export { StyledCounterInput };
