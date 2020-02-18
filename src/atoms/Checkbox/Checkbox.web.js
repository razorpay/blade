import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ checked }) => {
  return (
    <div>
      <input type="checkbox" id="scales" name="scales" checked={checked} />
      <label htmlFor="scales">Checkbox label</label>
    </div>
  );
};

Checkbox.propTypes = {
  // onClick: PropTypes.func,
  checked: PropTypes.bool,
  //size: PropTypes.oneOf(['l', 'm', 's']),
  //title: PropTypes.string,
  //helpText: PropTypes.string,
  //disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  // onClick: () => {},
  checked: false,
  // size: 'm',
  //title: '',
  // helpText: '',
  // disabled: false,
  // testID: 'checkbox',
};

export default Checkbox;
