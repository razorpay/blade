import React from 'react';
import type { AvatarGroupContextType } from './types';

const AvatarGroupContext = React.createContext<AvatarGroupContextType>({});
const AvatarGroupProvider = AvatarGroupContext.Provider;

const useAvatarGroupContext = (): AvatarGroupContextType => {
  const context = React.useContext(AvatarGroupContext);
  return context;
};

export { useAvatarGroupContext, AvatarGroupProvider };
