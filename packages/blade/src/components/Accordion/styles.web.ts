import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const MAX_WIDTH: BoxProps['maxWidth'] = {
  // 100% of viewport width - 40px
  s: `calc(100vw - ${makeSize(size[40])})`,
  m: makeSize(size[640]),
  l: makeSize(size[800]),
};

export { MAX_WIDTH };
