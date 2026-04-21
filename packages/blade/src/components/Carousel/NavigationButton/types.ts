import type { GestureResponderEvent } from 'react-native';
import type { Platform } from '~utils';

type NavigationButtonProps = {
  type: 'next' | 'previous';
  variant: 'filled' | 'stroked';
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
};

export type { NavigationButtonProps };
