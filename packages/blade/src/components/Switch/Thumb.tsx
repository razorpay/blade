/* eslint-disable @typescript-eslint/explicit-function-return-type */
import isNumber from 'lodash/isNumber';
import styled, { css } from 'styled-components';
import type { ThumbProps } from './types';
import { switchSizes } from './switchTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, makeSpace, getIn } from '~utils';

const Thumb = styled(BaseBox)<ThumbProps>(({ theme, size = 'medium', deviceType }) => {
  const width = switchSizes.thumb[deviceType][size].width;
  const height = switchSizes.thumb[deviceType][size].height;

  const finalWidth = isNumber(width) ? makeSize(width) : makeSpace(getIn(theme, width));
  const finalHeight = isNumber(height) ? makeSize(height) : makeSpace(getIn(theme, height));

  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${finalWidth};
    height: ${finalHeight};
    position: absolute;
    left: 0;
    margin: ${makeSpace(theme.spacing[1])};
  `;
});

export { Thumb };
