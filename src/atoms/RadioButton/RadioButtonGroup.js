import React from 'react';
import PropTypes from 'prop-types';

const RadioButtonContext = React.createContext(null);

const RadioButtonGroup = ({ value, onValueChange, children }) => {
  return (
    <RadioButtonContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioButtonContext.Provider>
  );
};

RadioButtonGroup.propTypes = {
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  children: PropTypes.node,
};

export { RadioButtonContext };
export default RadioButtonGroup;
