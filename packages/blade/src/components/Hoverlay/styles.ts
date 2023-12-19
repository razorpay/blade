/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CSSObject } from 'styled-components';
import type { HoverlayProps } from './types';
import { colors as globalColors } from '~tokens/global';

const getHoverlayStyles = (props: HoverlayProps): CSSObject => {
  return {
    position: 'absolute',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    opacity: 0,
    zIndex: 0,
    backgroundColor:
      props.variant === 'subtle'
        ? globalColors.neutral.white[100]
        : globalColors.neutral.black[100],
  };
};

export { getHoverlayStyles };
