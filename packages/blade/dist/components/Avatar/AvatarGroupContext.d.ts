import { default as React } from 'react';
import { AvatarGroupContextType } from './types';
declare const AvatarGroupProvider: React.Provider<AvatarGroupContextType>;
declare const useAvatarGroupContext: () => AvatarGroupContextType;
export { useAvatarGroupContext, AvatarGroupProvider };
