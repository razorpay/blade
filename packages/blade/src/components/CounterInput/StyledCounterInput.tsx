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
  &.__blade-counter-input [data-blade-component='progress-bar'] .__progress-bar {
    background-color: transparent !important;
  }

  &.__blade-counter-input .decrement-button,
  &.__blade-counter-input .increment-button {
    background-color: transparent !important;
    border: none !important;
  }

  /* Hover styles for subtle emphasis */
  &.__blade-counter-input[data-emphasis='subtle'] .decrement-button:hover:not(:disabled),
  &.__blade-counter-input[data-emphasis='subtle'] .increment-button:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surface.background.gray.subtle} !important;
  }

  /* Hover styles for intense emphasis */
  &.__blade-counter-input[data-emphasis='intense'] .decrement-button:hover:not(:disabled),
  &.__blade-counter-input[data-emphasis='intense'] .increment-button:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactive.background.primary.faded} !important;
  }
`;

export { StyledCounterInput };
