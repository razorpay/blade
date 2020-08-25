import React from 'react';

const RadioContext = React.createContext(null);

export const useRadioContext = () => {
  const radioContext = React.useContext(RadioContext);
  if (radioContext === undefined) {
    throw new Error('useRadioContext must be used within a RadioProvider');
  }
  return radioContext;
};

export default RadioContext;
