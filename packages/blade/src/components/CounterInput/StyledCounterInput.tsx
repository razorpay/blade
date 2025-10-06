import styled, { keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

// Keyframes for slide animations
const slideUp = keyframes`
  0% {
    transform: translateY(30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  0% {
    transform: translateY(-30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledCounterInput = styled(BaseBox)`
  &.__blade-counter-input .focus-ring-wrapper {
    outline: none;
  }

  &.__blade-counter-input .__blade-base-input-wrapper {
    box-shadow: none;
    background-color: transparent !important;
  }

  /* Animation classes */
  &.__blade-counter-input .animate-slide-up {
    animation: ${slideUp} 0.3s ease-out;
  }

  &.__blade-counter-input .animate-slide-down {
    animation: ${slideDown} 0.3s ease-out;
  }

  /* Hide number input arrows */
  /* stylelint-disable property-no-vendor-prefix, no-descending-specificity */
  &.__blade-counter-input input[type='number']::-webkit-inner-spin-button,
  &.__blade-counter-input input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &.__blade-counter-input input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
  /* stylelint-enable property-no-vendor-prefix, no-descending-specificity */

  /* Remove ProgressBar background */
  &.__blade-counter-input [data-blade-component='progress-bar'] .__progress-bar {
    background-color: transparent !important;
  }
`;

export { StyledCounterInput };
