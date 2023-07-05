import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const MAX_WIDTH: BoxProps['maxWidth'] = {
  s: `calc(100vw - ${makeSize(size[40])})`,
  m: makeSize(size[640]),
  l: makeSize(size[1136]),
};

const MAX_WIDTH_NO_RESTRICTIONS = 'none';

export { MAX_WIDTH, MAX_WIDTH_NO_RESTRICTIONS };
