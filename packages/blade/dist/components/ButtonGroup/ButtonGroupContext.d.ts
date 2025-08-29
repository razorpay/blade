import { default as React } from 'react';
import { ButtonGroupContextType } from './types';
declare const ButtonGroupProvider: React.Provider<ButtonGroupContextType>;
declare const useButtonGroupContext: () => ButtonGroupContextType;
export { useButtonGroupContext, ButtonGroupProvider };
