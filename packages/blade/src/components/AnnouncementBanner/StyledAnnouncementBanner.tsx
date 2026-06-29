import styled from 'styled-components';
import type { StyledAnnouncementBannerProps } from './types';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

export const StyledAnnouncementBanner = styled(BaseBox)
  .withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) =>
      (prop as string) !== 'isDark' &&
      (prop as string) !== 'alignment' &&
      omitPropsFromHTML(prop as never, defaultValidatorFn as never),
    displayName: 'StyledAnnouncementBanner',
  })<StyledAnnouncementBannerProps>(getCommonStyles);
