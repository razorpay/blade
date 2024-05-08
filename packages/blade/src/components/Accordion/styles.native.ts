import { Dimensions } from 'react-native';
import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const MAX_WIDTH: BoxProps['maxWidth'] = {
  // 100% of viewport width - 40px
  s: makeSize(Dimensions.get('window').width - size[40]),
  m: makeSize(size[640]),
  l: makeSize(size[800]),
};

export { MAX_WIDTH };
