import styled, { keyframes, css, CSSObject } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

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
  /* Hide focus ring by default */
  &.__blade-counter-input .focus-ring-wrapper:focus-within {
    outline: none;
  }

  /* Show focus ring only during keyboard navigation */
  &.__blade-counter-input.counter-input-keyboard-focus .focus-ring-wrapper:focus-within {
    ${({ theme }) => css(getFocusRingStyles({ theme, negativeOffset: true }) as CSSObject)};
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
`;

export { StyledCounterInput };
