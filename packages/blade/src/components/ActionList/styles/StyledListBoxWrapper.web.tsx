/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';

import type { SectionListProps } from 'react-native';

const StyledListBoxWrapper = styled(BaseBox)<
  Partial<SectionListProps<any, any>> & { isInBottomSheet: boolean }
>((props) => {
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
