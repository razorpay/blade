import styled, { keyframes, css } from 'styled-components';
import type { CSSObject } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

// Per-digit slide animations for slot-machine style per-character transitions
const digitSlideUp = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const digitSlideDown = keyframes`
  0% {
    transform: translateY(-100%);
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
    /* Allow the wrapper to size to content instead of forcing 100% width */
    width: auto !important;
    flex: 1;
  }

  /* Hide number input arrows */
  &.__blade-counter-input input[type='number']::-webkit-inner-spin-button,
  &.__blade-counter-input input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &.__blade-counter-input input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
    font-variant-numeric: tabular-nums;
  }

  /* Remove ProgressBar background */
  &.__blade-counter-input [data-blade-component='progress-bar'] .__blade-progress-bar-track {
    background-color: transparent !important;
  }

  /* Hide real input text while per-digit overlay is animating */
  &.__blade-counter-input .__blade-counter-input-hide-text input[type='number'] {
    color: transparent !important;
    caret-color: transparent !important;
  }

  /* Per-digit animation overlay container */
  &.__blade-counter-input .__blade-counter-input-digit-overlay {
    pointer-events: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-variant-numeric: tabular-nums;
  }

  /* Individual digit slot — clips the sliding animation */
  &.__blade-counter-input .__blade-counter-input-digit-slot {
    overflow: hidden;
    display: inline-block;
    line-height: 1;
  }

  /* Per-digit slide-up animation (increment) */
  &.__blade-counter-input .__blade-counter-input-digit-animate-up {
    display: inline-block;
    animation: ${digitSlideUp} 0.2s ease-out;
  }

  /* Per-digit slide-down animation (decrement) */
  &.__blade-counter-input .__blade-counter-input-digit-animate-down {
    display: inline-block;
    animation: ${digitSlideDown} 0.2s ease-out;
  }
`;

export { StyledCounterInput };
