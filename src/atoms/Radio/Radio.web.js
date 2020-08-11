import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getVariantColorKeys } from '../../_helpers/theme';
import RadioButtonContext from './RadioContext';
import RadioOption from './RadioOption';
import Fieldset from './Fieldset';

const Radio = ({ value, onChange, defaultValue, variantColor, size, children }) => {
  const [selected, setSelected] = useState(value || defaultValue);

  const onValueChange = useCallback(
    (newValue) => {
      if (!value) {
        setSelected(newValue);
      }
      onChange(newValue);
    },
    [onChange, value],
  );

  const contextValue = useMemo(
    () => ({ value: selected, onChange: onValueChange, variantColor, size }),
    [onValueChange, selected, variantColor, size],
  );

  return (
    <RadioButtonContext.Provider value={contextValue}>
      <Fieldset>{children}</Fieldset>
    </RadioButtonContext.Provider>
  );
};

Radio.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Radio.defaultProps = {
  onChange: () => {},
  variantColor: 'primary',
  size: 'medium',
};

Radio.Option = RadioOption;

export default Radio;
