import React from 'react';
import type { CounterInputContextType } from './types';

const CounterInputContext = React.createContext<CounterInputContextType>({
  isInsideCounterInput: false,
});
const CounterInputProvider = CounterInputContext.Provider;

const useCounterInputContext = (): CounterInputContextType => {
  return React.useContext(CounterInputContext);
};

export { useCounterInputContext, CounterInputProvider };
