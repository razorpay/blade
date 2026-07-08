import styled from 'styled-components/native';
import { View } from 'react-native';
import type { StyledButtonGroupProps } from './types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useStyledProps } from '~components/Box/styledProps';
import { makeBorderSize } from '~utils';
import { buttonBorderRadius } from '~components/Button/BaseButton/buttonTokens';

const StyledButtonGroup = styled(View)<StyledButtonGroupProps & StyledPropsBlade>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  const { theme, isFullWidth, size = 'medium' } = props;
  const borderRadiusToken = buttonBorderRadius[size];
  const borderRadius = makeBorderSize(theme.border.radius[borderRadiusToken]);

  return {
    flexDirection: 'row',
    alignSelf: isFullWidth ? 'stretch' : 'flex-start',
    borderRadius,
    overflow: 'hidden',
    ...styledPropsCSSObject,
  };
});

export { StyledButtonGroup };
