import React from 'react';
import { MIXED_BG_COLOR } from './TabNav/utils';
import type { BoxProps } from '~components/Box';

type TopNavContextProps = {
  backgroundColor: BoxProps['backgroundColor'];
};
const TopNavContext = React.createContext<TopNavContextProps | null>({
  backgroundColor: MIXED_BG_COLOR as never,
});

const useTopNavContext = (): TopNavContextProps => {
  const context = React.useContext(TopNavContext);
  return context!;
};

export { TopNavContext, useTopNavContext };
