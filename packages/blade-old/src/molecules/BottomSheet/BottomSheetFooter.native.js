import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';
import Space from '../../atoms/Space';

const FooterContainer = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.background[300]};
`;

const BottomSheetFooter = ({ children }) => {
  return children ? (
    <FooterContainer>
      <Divider color="shade.920" direction="horizontal" />
      <Space padding={[1, 2, 1, 2]}>
        <View>{children}</View>
      </Space>
    </FooterContainer>
  ) : null;
};

BottomSheetFooter.displayName = 'BottomSheetFooter';

BottomSheetFooter.propTypes = {
  children: PropTypes.node,
};

export default BottomSheetFooter;
