import React from 'react';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import View from '../../atoms/View';

const ModalContent = ({ children, type }) => {
  return type === 'centered' ? (
    <Space padding={[2]}>
      <View>{children}</View>
    </Space>
  ) : type === 'fullscreen' ? (
    children
  ) : type === 'bottomsheet' ? (
    children
  ) : null;
};

ModalContent.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
};

ModalContent.defaultProps = {
  type: 'centered',
};

export default ModalContent;
