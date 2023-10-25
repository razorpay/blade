import styled from 'styled-components';
import type { StyledAlertProps } from './types';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';

export const StyledAlert = styled(BaseBox)<StyledAlertProps>((props) => {
  if (isReactNative()) {
    return getCommonStyles(props);
  }
  return {
    '&&&&&': {
      ...getCommonStyles(props),
    },
  };
});
