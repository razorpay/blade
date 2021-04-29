import React from 'react';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';

const ModalFooter = ({ children, variant }) => {
  if (variant === 'centered') {
    return (
      <Space padding={[2, 3]}>
        <View>{children}</View>
      </Space>
    );
  }
  if (variant === 'fullscreen') {
    return children;
  }
  if (variant === 'bottomsheet') {
    return (
      <React.Fragment>
        <Divider color="shade.920" />
        <Space padding={[2, 3, 3, 3]}>
          <View>{children}</View>
        </Space>
      </React.Fragment>
    );
  }
  return null;
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
};

ModalFooter.defaultProps = {
  variant: 'centered',
};

export default ModalFooter;
