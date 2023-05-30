/* eslint-disable @typescript-eslint/explicit-function-return-type */
import isNumber from 'lodash/isNumber';
import getIn from 'lodash/get';
import styled from 'styled-components';
import type { ThumbProps } from './types';
import { switchSizes } from './switchTokens';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';

const Thumb = styled(BaseBox)<ThumbProps>(({ theme, size = 'medium', deviceType }) => {
  const width = switchSizes.thumb[deviceType][size].width;
  const height = switchSizes.thumb[deviceType][size].height;

  const finalWidth = isNumber(width) ? makeSize(width) : makeSpace(getIn(theme, width));
  const finalHeight = isNumber(height) ? makeSize(height) : makeSpace(getIn(theme, height));

  const reactNativeStyles = {
    left: 0,
    margin: makeSpace(theme.spacing[1]),
  };

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: finalWidth,
    height: finalHeight,
    position: isReactNative() ? 'absolute' : 'relative',
    ...(isReactNative() && reactNativeStyles),
  };
});

export { Thumb };
