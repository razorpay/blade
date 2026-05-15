import { Dimensions, StyleSheet } from 'react-native';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

import type { BoxProps } from '~components/Box';

const MAX_WIDTH: BoxProps['maxWidth'] = {
  s: makeSize(Dimensions.get('window').width - size[40]),
  m: makeSize(size[640]),
  l: makeSize(size[1136]),
};

const nativeStyles = StyleSheet.create({
  collapsibleBodyExpanded: {
    position: 'relative',
  },
  collapsibleBodyCollapsed: {
    position: 'absolute',
  },
});

const MAX_WIDTH_NO_RESTRICTIONS = undefined;

export { MAX_WIDTH, nativeStyles, MAX_WIDTH_NO_RESTRICTIONS };
