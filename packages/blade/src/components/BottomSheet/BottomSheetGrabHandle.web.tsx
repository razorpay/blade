import styled from 'styled-components';
import { getBottomSheetGrabHandleStyles } from './getBottomSheetGrabHandleStyles';

const BottomSheetGrabHandle = styled.div<{ isHeaderFloating?: boolean }>(
  ({ theme, isHeaderFloating }) => {
    return getBottomSheetGrabHandleStyles({ theme, isHeaderFloating });
  },
);

export { BottomSheetGrabHandle };
