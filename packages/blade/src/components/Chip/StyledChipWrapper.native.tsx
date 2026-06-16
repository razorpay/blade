import styled from 'styled-components/native';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { StyledChipWrapperProps } from './types';
import { chipBorderRadiusTokens } from './chipTokens';
import BaseBox from '~components/Box/BaseBox';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, isChecked, size = 'small' }) => {
    const borderRadius = chipBorderRadiusTokens[size];
    const outerRadius = theme.border.radius[borderRadius];
    // medium & large show a single border owned by AnimatedChip; drop the wrapper's own
    // border so the two don't stack into a double. xsmall/small keep their original border.
    const isMediumOrLarge = size === 'medium' || size === 'large';
    const outerBorderWidth = getIn(theme, 'border.width.thin') as number;
    return {
      display: 'flex',
      borderColor: isChecked && !isMediumOrLarge ? getIn(theme.colors, borderColor) : 'transparent',
      ...(isMediumOrLarge && { borderWidth: 0 }),
      borderRadius: makeBorderSize(outerRadius - outerBorderWidth),
      // Clipping is handled by AnimatedChip's overflow:hidden; avoid double-clip artifact.
      overflow: 'visible',
    };
  },
);

export { StyledChipWrapper };
