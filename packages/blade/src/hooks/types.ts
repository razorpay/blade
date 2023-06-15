/* eslint-disable @typescript-eslint/no-explicit-any */
import type { View } from 'react-native';
import type { Platform } from '~utils';

type BladeElementRef = Platform.Select<{
  web:
    | Pick<HTMLElement, 'focus' | 'scrollIntoView' | 'getBoundingClientRect' | 'clientHeight'>
    | Pick<View, 'focus'>;
  native: React.MutableRefObject<any>;
}>;

export { BladeElementRef };
