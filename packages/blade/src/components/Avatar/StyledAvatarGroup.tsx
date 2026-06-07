import styled from 'styled-components';
import type { AvatarGroupProps } from './types';
import { avatarSizeTokens, avatarGroupDensityOverlapTokens } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

const StyledAvatarGroup = styled(BaseBox)<{
  size: NonNullable<AvatarGroupProps['size']>;
  density: NonNullable<AvatarGroupProps['density']>;
}>(({ size, density }) => {
  const overlap =
    density === 'compact'
      ? avatarSizeTokens[size] / 2
      : avatarGroupDensityOverlapTokens[density][size];

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
