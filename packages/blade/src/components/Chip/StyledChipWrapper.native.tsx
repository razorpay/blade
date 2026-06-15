import styled from 'styled-components/native';
import type { StyledChipWrapperProps } from './types';
import { chipBorderRadiusTokens } from './chipTokens';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';
import BaseBox from '~components/Box/BaseBox';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, size = 'small' }) => {
    const borderRadius = chipBorderRadiusTokens[size];
    const outerRadius = theme.border.radius[borderRadius];
    const isSmallSize = size === 'xsmall' || size === 'small';
    const outerBorderWidth = getIn(theme, isSmallSize ? 'border.width.thick' : 'border.width.thicker') as number;
    return {
      display: 'flex',
      borderColor: getIn(theme.colors, borderColor),
      borderWidth: outerBorderWidth,
      borderRadius: makeBorderSize(outerRadius - outerBorderWidth),
      // Clipping is handled by AnimatedChip's overflow:hidden; avoid double-clip artifact.
      overflow: 'visible',
    };
  },
);

export { StyledChipWrapper };
