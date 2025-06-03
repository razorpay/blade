import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledInputGroup = styled(BaseBox)`
  ${({ theme }) => {
    const radius = makeBorderSize(theme.border.radius.medium);
    return `
      /* Reset all inputs and their focus ring wrappers */
      & .__blade-input-row .__blade-base-input-wrapper,
      & .__blade-input-row .focus-ring-wrapper {
        border-radius: 0;
      }

      /* Multi-row: First row, first column */
      & .__blade-input-row:first-child > div:first-child .__blade-base-input-wrapper,
      & .__blade-input-row:first-child > div:first-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
      }

      /* Multi-row: First row, last column */
      & .__blade-input-row:first-child > div:last-child .__blade-base-input-wrapper,
      & .__blade-input-row:first-child > div:last-child .focus-ring-wrapper {
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row, first column */
      & .__blade-input-row:last-child > div:first-child .__blade-base-input-wrapper,
      & .__blade-input-row:last-child > div:first-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
      }

      /* Multi-row: Last row, last column */
      & .__blade-input-row:last-child > div:last-child .__blade-base-input-wrapper,
      & .__blade-input-row:last-child > div:last-child .focus-ring-wrapper {
        border-bottom-right-radius: ${radius};
      }

      /* Multi-row: First row with only one column */
      & .__blade-input-row:first-child > div:only-child .__blade-base-input-wrapper,
      & .__blade-input-row:first-child > div:only-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row with only one column */
      & .__blade-input-row:last-child > div:only-child .__blade-base-input-wrapper,
      & .__blade-input-row:last-child > div:only-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Single column */
      & .__blade-input-row:only-child > div:only-child .__blade-base-input-wrapper,
      & .__blade-input-row:only-child > div:only-child .focus-ring-wrapper {
        border-radius: ${radius};
      }

      /* Single row: First column */
      & .__blade-input-row:only-child > div:first-child:not(:only-child) .__blade-base-input-wrapper,
      & .__blade-input-row:only-child > div:first-child:not(:only-child) .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-bottom-left-radius: ${radius};
      }

      /* Single row: Last column */
      & .__blade-input-row:only-child > div:last-child:not(:only-child) .__blade-base-input-wrapper,
      & .__blade-input-row:only-child > div:last-child:not(:only-child) .focus-ring-wrapper {
        border-top-right-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Middle columns */
      & .__blade-input-row:only-child > div:not(:first-child):not(:last-child) .__blade-base-input-wrapper,
      & .__blade-input-row:only-child > div:not(:first-child):not(:last-child) .focus-ring-wrapper {
        border-radius: 0;
      }
    `;
  }}
`;

export { StyledInputGroup };
