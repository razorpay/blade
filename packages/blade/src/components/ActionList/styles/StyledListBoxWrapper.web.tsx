import styled from 'styled-components';
import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledListBoxWrapper = styled(BaseBox)<{ isInBottomSheet: boolean }>((props) => {
  return {
    // Hides the last Divider (we don't want divider on last section)
    [`& [role=group]:last-child > [role=separator]:last-child`]: {
      display: 'none',
    },
    overflowY: 'auto',
    ...getBaseListBoxWrapperStyles({
      theme: props.theme,
      isInBottomSheet: props.isInBottomSheet,
    }),
  };
});

export { StyledListBoxWrapper };
