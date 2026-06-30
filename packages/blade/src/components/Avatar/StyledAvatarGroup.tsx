import styled from 'styled-components';
import type { AvatarGroupProps } from './types';
import { avatarGroupDensityOverlapTokens } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

const StyledAvatarGroup = styled(BaseBox)<{
  size: NonNullable<AvatarGroupProps['size']>;
  density: NonNullable<AvatarGroupProps['density']>;
}>(({ size, density }) => {
  const overlap = avatarGroupDensityOverlapTokens[density][size];

  return {
    display: 'inline-flex',
    flexDirection: 'row',

    [`> *:not(:first-child)`]: {
      marginLeft: `-${makeSize(overlap)}`,
      zIndex: 2,
    },
  };
});

export { StyledAvatarGroup };
