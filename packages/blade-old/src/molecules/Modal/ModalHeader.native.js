import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import Divider from '../../atoms/Divider';

const FullScreenModalHeader = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.background[300]};
  shadow-color: ${(props) => props.theme.bladeOld.colors.primary[930]};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 15px;
  elevation: 2;
`;

const ModalHeader = ({ children, variant, onClose }) => {
  if (variant === 'centered') {
    return (
      <Space padding={[1.5, 2, 0.5, 2]}>
        <View>{children}</View>
      </Space>
    );
  }
  if (variant === 'fullscreen') {
    return (
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
    );
  }
  if (variant === 'bottomsheet') {
    return (
      <React.Fragment>
        <View>{children}</View>
        <Divider color="shade.920" />
      </React.Fragment>
    );
  }
  return null;
};

ModalHeader.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
  onClose: PropTypes.func,
};

ModalHeader.defaultProps = {
  variant: 'centered',
  onClose: () => {},
};

export default ModalHeader;
