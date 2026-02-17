import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

type StyledQuickFilterWrapperProps = {
  isSelected?: boolean;
};

const quickFilterColorTokens = {
  background: {
    default: 'transparent',
    selected: 'interactive.background.gray.fadedHighlighted',
    hover: 'interactive.background.gray.faded',
  },
} as const;

const StyledQuickFilterWrapper = styled(BaseBox)<StyledQuickFilterWrapperProps>(
  ({ theme, isSelected }) => {
    const easing = getIn(theme.motion, 'easing.standard');
    const duration = castWebType(makeMotionTime(getIn(theme.motion, 'duration.xquick')));

    const defaultBackgroundColor = getIn(
      theme.colors,
      isSelected
        ? quickFilterColorTokens.background.selected
        : quickFilterColorTokens.background.default,
    );

    const hoverBackgroundColor = getIn(
      theme.colors,
      isSelected
        ? quickFilterColorTokens.background.selected
        : quickFilterColorTokens.background.hover,
    );

    return {
      cursor: 'pointer',
      backgroundColor: defaultBackgroundColor,
      transitionProperty: 'background-color',
      transitionTimingFunction: easing,
      transitionDuration: duration,
      '&:hover': {
        backgroundColor: hoverBackgroundColor,
      },
      '&:has(:focus-visible)': {
        backgroundColor: hoverBackgroundColor,
        ...getFocusRingStyles({ theme }),
      },
      // Remove focus ring from inner Checkbox/Radio since the wrapper handles it
      '& input:focus-visible + div': {
        outline: 'none !important',
      },
    };
  },
);

export { StyledQuickFilterWrapper };
