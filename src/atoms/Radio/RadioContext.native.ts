import React from 'react';

const RadioButtonContext = React.createContext(null);

export const useRadioButtonContext = () => {
  const radioButtonContext = React.useContext(RadioButtonContext);
  if (radioButtonContext === undefined) {
    throw new Error('useRadioButtonContext must be used within a RadioButtonProvider');
  }
  return radioButtonContext;
};

export default RadioButtonContext;
