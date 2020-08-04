import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RadioButtonContext from './RadioContext';
import RadioOption from './RadioOption';

const RadioGroup = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
`;

const Radio = ({ value, onChange, defaultValue, children }) => {
  const [selected, setSelected] = useState(value || defaultValue);

  const onValueChange = useCallback(
    (newValue) => {
      if (!value) {
        setSelected(newValue);
      }
      if (onChange) onChange(newValue);
    },
    [onChange, value],
  );

  const contextValue = useMemo(() => ({ value: selected, onChange: onValueChange }), [
    onValueChange,
    selected,
  ]);

  return (
    <RadioButtonContext.Provider value={contextValue}>
      <RadioGroup>{children}</RadioGroup>
    </RadioButtonContext.Provider>
  );
};

Radio.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

Radio.defaultProps = {
  onChange: () => {},
};

Radio.Option = RadioOption;

export default Radio;
