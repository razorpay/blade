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
    // Keep buttons content-sized on the cross axis. Default RN `alignItems:
    // 'stretch'` plus Dropdown's inner `height: '100%'` was blowing the group
    // up to the full screen height in Storybook.
    alignItems: 'center',
    // Match web `width: 100%` — `alignSelf: stretch` alone is not enough inside
    // ScrollView / column parents that don't stretch their content width.
    ...(isFullWidth
      ? { alignSelf: 'stretch' as const, width: '100%' as const }
      : { alignSelf: 'flex-start' as const }),
    borderRadius,
    // Do not clip here — DropdownOverlay is absolutely positioned inside the
    // group. Outer rounding is handled per-button via borderRadii instead.
    overflow: 'visible',
    ...styledPropsCSSObject,
  };
});

export { StyledButtonGroup };
