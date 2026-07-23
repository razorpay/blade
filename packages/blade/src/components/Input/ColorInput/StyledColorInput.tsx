import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const CLASSNAME = '__blade-color-input-row';

const StyledColorInput = styled(BaseBox)`
  ${({ theme }) => {
    const radius = makeBorderSize(theme.border.radius.small);
    return `
      display: flex;
      flex-direction: row;
      align-items: stretch;

      /* Reset border-radius on all inputs */
      & .${CLASSNAME} .__blade-base-input-wrapper,
      & .${CLASSNAME} .focus-ring-wrapper {
        border-radius: 0;
      }

      /* Elevate hovered/focused input above siblings */
      & .${CLASSNAME} .__blade-base-input-wrapper {
        position: relative;
        z-index: 0;
      }

      & .${CLASSNAME} .__blade-base-input-wrapper:hover,
      & .${CLASSNAME} .__blade-base-input-wrapper:focus-within {
        z-index: 1;
      }

      /* First input: left border-radius */
      & .${CLASSNAME}:first-child .__blade-base-input-wrapper,
      & .${CLASSNAME}:first-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-bottom-left-radius: ${radius};
      }

      /* Last input: right border-radius */
      & .${CLASSNAME}:last-child .__blade-base-input-wrapper,
      & .${CLASSNAME}:last-child .focus-ring-wrapper {
        border-top-right-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Only child: full border-radius */
      & .${CLASSNAME}:only-child .__blade-base-input-wrapper,
      & .${CLASSNAME}:only-child .focus-ring-wrapper {
        border-radius: ${radius};
      }
    `;
  }}
`;

export { StyledColorInput, CLASSNAME as COLOR_INPUT_ROW_CLASSNAME };
