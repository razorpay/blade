import styled from 'styled-components';

import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

import { avatarSizeTokens } from './avatarTokens';

import type { AvatarGroupProps } from './types';

const StyledAvatarGroup = styled(BaseBox)<{ size: NonNullable<AvatarGroupProps['size']> }>(
  ({ size }) => {
    return {
      display: 'inline-flex',
      flexDirection: 'row',

      [`> *:not(:first-child)`]: {
        marginLeft: `-${makeSize(avatarSizeTokens[size] / 2)}`,
        zIndex: 2,
      },
    };
  },
);

export { StyledAvatarGroup };
