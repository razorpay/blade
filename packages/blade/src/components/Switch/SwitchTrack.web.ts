import styled from 'styled-components';
import type { TrackProps } from './types';
import { getTrackStyles } from './getTrackStyles';
import BaseBox from '~components/Box/BaseBox';

const SwitchTrack = styled(BaseBox)<TrackProps>(
  ({ theme, size, deviceType, isDisabled, isChecked }) => {
    return {
      ...getTrackStyles({ theme, size, deviceType, isDisabled, isChecked }),
    };
  },
);

export { SwitchTrack };
