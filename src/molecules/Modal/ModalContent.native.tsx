import React from 'react';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import View from '../../atoms/View';

const ModalContent = ({ children }) => (
  <Space padding={[2]}>
    <View>{children}</View>
  </Space>
);

ModalContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalContent;
