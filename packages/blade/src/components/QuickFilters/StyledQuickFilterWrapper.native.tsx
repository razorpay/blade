import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';

type StyledQuickFilterWrapperProps = {
  isSelected?: boolean;
};

const quickFilterColorTokens = {
  background: {
    default: 'transparent',
    selected: 'interactive.background.gray.fadedHighlighted',
  },
} as const;

/**
 * On native the wrapper is a styled View inside a parent Pressable (see QuickFilter.native.tsx).
 * The Pressable owns the tap target; inner Radio/Checkbox are visual-only (pointerEvents="none").
 * Background color is driven by isSelected from context, mirroring web visual.
 *
 * Uses BaseBox (not View) so that styled-components/native can infer the DefaultTheme
 * from the provider — avoids TS7031 implicit-any on the theme binding.
 */
const StyledQuickFilterWrapper = styled(BaseBox)<StyledQuickFilterWrapperProps>(
  ({ theme, isSelected }) => {
    const backgroundColor = isSelected
      ? getIn(theme.colors, quickFilterColorTokens.background.selected)
      : quickFilterColorTokens.background.default;
    const borderRadius = makeBorderSize(theme.border.radius.small);

    return {
      backgroundColor,
      borderRadius,
      // flexDirection defaults to column in RN; row layout needed to match web
      flexDirection: 'row' as const,
      // overflow:hidden ensures borderRadius clips children on Android
      overflow: 'hidden' as const,
    };
  },
);

export { StyledQuickFilterWrapper };
export type { StyledQuickFilterWrapperProps };
