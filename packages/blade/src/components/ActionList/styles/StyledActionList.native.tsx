import styled from 'styled-components/native';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType } from '~utils';

const StyledActionList = styled(BaseBox).attrs<StyledActionListProps>((props) => ({
  elevation: props.isInBottomSheet
    ? undefined
    : castNativeType(props.theme.shadows.midRaised).elevation,
}))<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
    ...(props.isInBottomSheet ? undefined : castNativeType(props.theme.shadows.midRaised)),
  };
});

export { StyledActionList };
