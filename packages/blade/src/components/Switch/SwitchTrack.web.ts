import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';

import { getTrackStyles } from './getTrackStyles';

import type { TrackProps } from './types';

const SwitchTrack = styled(BaseBox)<TrackProps>(
  ({ theme, size, deviceType, isDisabled, isChecked }) => {
    return {
      ...getTrackStyles({ theme, size, deviceType, isDisabled, isChecked }),
    };
  },
);

export { SwitchTrack };
