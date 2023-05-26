import styled from 'styled-components';
import { getBottomSheetGrabHandleStyles } from './getBottomSheetGrabHandleStyles';

const BottomSheetGrabHandle = styled.div(({ theme }) => {
  return getBottomSheetGrabHandleStyles({ theme });
});

export { BottomSheetGrabHandle };
