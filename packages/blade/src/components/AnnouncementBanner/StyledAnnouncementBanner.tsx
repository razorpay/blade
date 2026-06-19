import styled from 'styled-components';
import type { StyledAnnouncementBannerProps } from './types';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';

export const StyledAnnouncementBanner = styled(BaseBox)<StyledAnnouncementBannerProps>(
  getCommonStyles,
);
