import React from 'react';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import View from '../../atoms/View';

const BottomSheetContent = ({ children }) => {
  return children ? (
    <Space padding={[1, 2, 1, 2]}>
      <View>{children}</View>
    </Space>
  ) : null;
};

BottomSheetContent.propTypes = {
  children: PropTypes.node,
};

BottomSheetContent.displayName = 'BottomSheetContent';

export default BottomSheetContent;
