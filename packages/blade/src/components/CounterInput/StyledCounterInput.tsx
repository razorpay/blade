import styled, { keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';
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

  &.__blade-counter-input .decrement-button,
  &.__blade-counter-input .increment-button {
    background-color: transparent !important;
    border: none !important;
    transition-property: background-color, color, outline-width;
    transition-duration: ${({ theme }) =>
      castWebType(makeMotionTime(getIn(theme.motion, 'duration.xquick')))};
    transition-timing-function: ${({ theme }) => getIn(theme.motion, 'easing.standard')};
  }

  /* Focus ring styles - Standard Blade focus ring with negative offset to exclude margin */
  &.__blade-counter-input .decrement-button:focus-visible,
  &.__blade-counter-input .increment-button:focus-visible {
    ${({ theme }) => getFocusRingStyles({ theme, negativeOffset: true })}
  }

  /* Hover styles for subtle emphasis */
  &.__blade-counter-input[data-emphasis='subtle'] .decrement-button:hover:not(:disabled),
  &.__blade-counter-input[data-emphasis='subtle'] .increment-button:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactive.background.gray.fadedHighlighted} !important;
    color: ${({ theme }) => theme.colors.interactive.icon.gray.normal} !important;
  }

  /* Hover styles for intense emphasis */
  &.__blade-counter-input[data-emphasis='intense'] .decrement-button:hover:not(:disabled),
  &.__blade-counter-input[data-emphasis='intense'] .increment-button:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactive.background.primary.fadedHighlighted} !important;
    color: ${({ theme }) => theme.colors.interactive.icon.primary.normal} !important;
  }
`;

export { StyledCounterInput };
