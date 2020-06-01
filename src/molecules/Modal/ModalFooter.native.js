import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import View from '../../atoms/View';

const Divider = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
`;

const ModalFooter = ({ children, type }) => {
  return type === 'centered' ? (
    <Space padding={[2, 3]}>
      <View>{children}</View>
    </Space>
  ) : type === 'fullscreen' ? null : type === 'bottomsheet' ? (
    <React.Fragment>
      <Size height="1px" width="100%">
        <Divider />
      </Size>
      <Space padding={[2, 3, 3, 3]}>
        <View>{children}</View>
      </Space>
    </React.Fragment>
  ) : null;
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
};

ModalFooter.defaultProps = {
  type: 'centered',
};

export default ModalFooter;
