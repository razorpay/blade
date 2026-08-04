import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAnnouncementBannerProps } from './types';
import type { IconColors } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { makeSpace } from '~utils/makeSpace';

export const getBannerTextColor = (isDark: boolean): BaseTextProps['color'] =>
  isDark ? 'surface.text.staticWhite.subtle' : 'surface.text.gray.subtle';

export const getBannerIconColor = (isDark: boolean): IconColors =>
  isDark ? 'surface.icon.staticWhite.subtle' : 'surface.icon.gray.subtle';

export const getCommonStyles = (props: StyledProps<StyledAnnouncementBannerProps>): CSSObject => {
  const { theme, isDark, alignment } = props;

  const background = isDark
    ? theme.colors.interactive.background.staticBlack.fadedHighlighted
    : theme.colors.surface.background.gray.subtle;

  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: makeSpace(theme.spacing[2]),
    justifyContent: alignment === 'center' ? 'center' : 'flex-start',
    width: '100%',
    background,
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft: makeSpace(theme.spacing[5]),
    paddingRight: makeSpace(theme.spacing[5]),
    boxSizing: 'border-box',
  };
};
