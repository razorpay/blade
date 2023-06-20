import { Dimensions, StyleSheet } from 'react-native';
import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

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

export { MAX_WIDTH, nativeStyles };
