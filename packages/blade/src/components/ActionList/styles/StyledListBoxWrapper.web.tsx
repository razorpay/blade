/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import type { SectionListProps } from 'react-native';
import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledListBoxWrapper: StyledComponent<
  typeof BaseBox,
  any,
  SectionListProps<any, any>
> = styled(BaseBox)<Partial<SectionListProps<any, any>> & { isInBottomSheet: boolean }>((props) => {
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
