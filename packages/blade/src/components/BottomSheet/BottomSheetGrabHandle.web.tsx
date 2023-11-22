import styled from 'styled-components';
import { getBottomSheetGrabHandleStyles } from './getBottomSheetGrabHandleStyles';

const BottomSheetGrabHandle = styled.div<{ isHeaderFloating?: boolean }>(
  ({ theme, isHeaderFloating }) => {
    return {
      all: 'unset',
      ...getBottomSheetGrabHandleStyles({ theme, isHeaderFloating }),
    };
  },
);

export { BottomSheetGrabHandle };
