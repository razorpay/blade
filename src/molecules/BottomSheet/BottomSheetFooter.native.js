import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';
import Space from '../../atoms/Space';

const FooterContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
`;

const BottomSheetFooter = ({ children }) => {
  return children ? (
    <FooterContainer>
      <Divider color="shade.920" horizontal />
      {children ? (
        <Space padding={[1, 2, 1, 2]}>
          <View>{children}</View>
        </Space>
      ) : null}
    </FooterContainer>
  ) : null;
};

BottomSheetFooter.displayName = 'BottomSheetFooter';

BottomSheetFooter.propTypes = {
  children: PropTypes.node,
};

export default BottomSheetFooter;
