import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledColorInput = styled(BaseBox)`
  ${({ theme }) => {
    const radius = makeBorderSize(theme.border.radius.small);
    return `
      display: flex;
      flex-direction: row;
      align-items: stretch;

      /* Reset border-radius on all inputs */
      & .__blade-base-input-wrapper,
      & .focus-ring-wrapper {
        border-radius: 0;
      }

      /* Elevate hovered/focused input above siblings */
      & .__blade-base-input-wrapper {
        position: relative;
        z-index: 0;
      }

      & .__blade-base-input-wrapper:hover,
      & .__blade-base-input-wrapper:focus-within {
        z-index: 1;
      }

      /* First input: left border-radius */
      & > div:first-child .__blade-base-input-wrapper,
      & > div:first-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-bottom-left-radius: ${radius};
      }

      /* Last input: right border-radius */
      & > div:last-child .__blade-base-input-wrapper,
      & > div:last-child .focus-ring-wrapper {
        border-top-right-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Only child: full border-radius */
      & > div:only-child .__blade-base-input-wrapper,
      & > div:only-child .focus-ring-wrapper {
        border-radius: ${radius};
      }
    `;
  }}
`;

export { StyledColorInput };
