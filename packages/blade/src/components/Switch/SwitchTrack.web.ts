import type { DefaultTheme, StyledComponent } from 'styled-components';
import styled from 'styled-components';
import type { TrackProps } from './types';
import { getTrackStyles } from './getTrackStyles';
import BaseBox from '~components/Box/BaseBox';

const SwitchTrack: StyledComponent<typeof BaseBox, DefaultTheme, TrackProps, never> = styled(
  BaseBox,
)<TrackProps>(({ theme, size, deviceType, isDisabled, isChecked }) => {
  return {
    ...getTrackStyles({ theme, size, deviceType, isDisabled, isChecked }),
  };
});

export { SwitchTrack };
