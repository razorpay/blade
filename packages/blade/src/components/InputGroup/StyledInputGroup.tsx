import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledInputGroup = styled(BaseBox)`
  ${({ theme }) => {
    const radius = makeBorderSize(theme.border.radius.medium);
    return `
      /* Reset all inputs and their focus ring wrappers */
      & .input-row .base-input-wrapper,
      & .input-row .focus-ring-wrapper {
        border-radius: 0;
      }

      /* Multi-row: First row, first column */
      & .input-row:first-child > div:first-child .base-input-wrapper,
      & .input-row:first-child > div:first-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
      }

      /* Multi-row: First row, last column */
      & .input-row:first-child > div:last-child .base-input-wrapper,
      & .input-row:first-child > div:last-child .focus-ring-wrapper {
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row, first column */
      & .input-row:last-child > div:first-child .base-input-wrapper,
      & .input-row:last-child > div:first-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
      }

      /* Multi-row: Last row, last column */
      & .input-row:last-child > div:last-child .base-input-wrapper,
      & .input-row:last-child > div:last-child .focus-ring-wrapper {
        border-bottom-right-radius: ${radius};
      }

      /* Multi-row: First row with only one column */
      & .input-row:first-child > div:only-child .base-input-wrapper,
      & .input-row:first-child > div:only-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row with only one column */
      & .input-row:last-child > div:only-child .base-input-wrapper,
      & .input-row:last-child > div:only-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Single column */
      & .input-row:only-child > div:only-child .base-input-wrapper,
      & .input-row:only-child > div:only-child .focus-ring-wrapper {
        border-radius: ${radius};
      }

      /* Single row: First column */
      & .input-row:only-child > div:first-child:not(:only-child) .base-input-wrapper,
      & .input-row:only-child > div:first-child:not(:only-child) .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-bottom-left-radius: ${radius};
      }

      /* Single row: Last column */
      & .input-row:only-child > div:last-child:not(:only-child) .base-input-wrapper,
      & .input-row:only-child > div:last-child:not(:only-child) .focus-ring-wrapper {
        border-top-right-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Middle columns */
      & .input-row:only-child > div:not(:first-child):not(:last-child) .base-input-wrapper,
      & .input-row:only-child > div:not(:first-child):not(:last-child) .focus-ring-wrapper {
        border-radius: 0;
      }
    `;
  }}
`;

export { StyledInputGroup };
