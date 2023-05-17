/* eslint-disable react/jsx-no-useless-fragment */
// import styled from 'styled-components/native';
// import { getBottomSheetGrabHandleStyles } from './getBottomSheetGrabHandleStyles';

import styled from 'styled-components/native';
import {
  getBottomSheetGrabHandleStyles,
  getHandlePartStyles,
} from './getBottomSheetGrabHandleStyles';
import BaseBox from '~components/Box/BaseBox';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

const StyledGrabHandle = styled(BaseBox)(({ theme }) => {
  return getBottomSheetGrabHandleStyles({ theme });
});

const StyledHandlePart = styled(BaseBox)(({ theme }) => {
  return getHandlePartStyles({ theme });
});

const BottomSheetGrabHandle = (): React.ReactElement => {
  return (
    <StyledGrabHandle>
      <StyledHandlePart />
    </StyledGrabHandle>
  );
};

export { BottomSheetGrabHandle };
