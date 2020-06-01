import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';

const FullScreenModalHeader = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  shadow-color: ${(props) => props.theme.colors.primary[930]};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 15px;
  elevation: 2;
`;

const Divider = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
`;

const ModalHeader = ({ children, type, onClose }) => {
  return type === 'centered' ? (
    <Space padding={[1.5, 2, 0.5, 2]}>
      <View>{children}</View>
    </Space>
  ) : type === 'fullscreen' ? (
    <Flex flexDirection="row" justifyContent="space-between">
      <Space padding={[1, 2]}>
        <FullScreenModalHeader>
          {children}
          <Button
            testID="close-button"
            variant="tertiary"
            variantColor="shade"
            icon="close"
            size="medium"
            onClick={onClose}
          />
        </FullScreenModalHeader>
      </Space>
    </Flex>
  ) : type === 'bottomsheet' ? (
    <React.Fragment>
      <Space>
        <View>{children}</View>
      </Space>
      <Size height="1px" width="100%">
        <Divider />
      </Size>
    </React.Fragment>
  ) : null;
};

ModalHeader.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
  onClose: PropTypes.func,
};

ModalHeader.defaultProps = {
  type: 'centered',
  onClose: () => {},
};

export default ModalHeader;
