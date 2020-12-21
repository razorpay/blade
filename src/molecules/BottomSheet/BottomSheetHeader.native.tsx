import React from 'react';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import View from '../../atoms/View';

const BottomSheetHeader = ({ children }) => {
  return children ? (
    <Space padding={[1, 2, 1, 2]}>
      <View>{children}</View>
    </Space>
  ) : null;
};

BottomSheetHeader.displayName = 'BottomSheetHeader';

BottomSheetHeader.propTypes = {
  children: PropTypes.node,
};

export default BottomSheetHeader;
