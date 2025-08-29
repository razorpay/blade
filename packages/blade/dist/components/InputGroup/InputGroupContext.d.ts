import { default as React } from 'react';
import { InputGroupContextType } from './types';
declare const InputGroupProvider: React.Provider<InputGroupContextType>;
declare const useInputGroupContext: () => InputGroupContextType;
export { useInputGroupContext, InputGroupProvider };
