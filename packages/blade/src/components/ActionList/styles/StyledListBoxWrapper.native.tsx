/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { SectionList } from 'react-native';
import styled from 'styled-components/native';
import { getBaseListBoxWrapperStyles } from './getBaseListBoxWrapperStyles';
import { makeSize } from '~utils/makeSize';

// It's not really styled here but have to keep name same since we have to style this with overflowY and maxWidth in web
const StyledListBoxWrapper = styled(SectionList)<{
  isInBottomSheet: boolean;
  marginBottom: number;
}>((props) => ({
  ...getBaseListBoxWrapperStyles({
    theme: props.theme,
    isInBottomSheet: props.isInBottomSheet,
  }),
  // overriding padding on react-native, we always need it to be spacing.3
  // Because in BottomSheetBody we don't have any wrappers to add extra padding inbetween ActionList & BottomSheetBody
  padding: makeSize(props.theme.spacing[3]),
  marginBottom: makeSize(props.marginBottom),
}));

export { StyledListBoxWrapper };
