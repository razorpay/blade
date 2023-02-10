import styled from 'styled-components';
import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';
import Box from '~components/Box';

const StyledListBoxWrapper = styled(Box)((props) => {
  return {
    // Hides the last Divider (we don't want divider on last section)
    [`& [role=group]:last-child > [role=separator]:last-child`]: {
      display: 'none',
    },
    overflowY: 'auto',
    ...getBaseListBoxWrapperStyles({ theme: props.theme }),
  };
});

export { StyledListBoxWrapper };
