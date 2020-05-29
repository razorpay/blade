import React from 'react';
import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import Flex from '../../atoms/Flex';
import Size from '../../atoms/Size';
import View from '../../atoms/View';
import Button from '../../atoms/Button';

const CenteredModalBody = styled(View)`
  background-color: ${(props) => props.theme.colors.background[100]};
  border-radius: ${(props) => props.theme.spacings.xsmall};
`;

const FullscreenModalBody = styled(View)`
  background-color: ${(props) => props.theme.colors.background[400]};
`;

const BottomsheetModalBody = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  shadow-color: rgba(11, 112, 231, 0.1); /**TODO: confirm color from theme */
  shadow-offset: 0px -4px;
  shadow-opacity: 1;
  shadow-radius: 15px;
  elevation: 2;
`;

const FullScreenModalHeader = styled(View)`
  background-color: ${(props) => props.theme.colors.background[100]};
  shadow-color: rgba(11, 112, 231, 0.1); /**TODO: confirm color from theme */
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 15px;
  elevation: 2;
`;

const FullScreenDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const Divider = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  height: 1px;
  width: 100%;
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
            testID="fullscreen-cross"
            variant="tertiary"
            variantColor="shade" /**TODO: button uses shade of 800 but Figma is showing 980*/
            icon="close"
            size="medium"
            onClick={onClose}
          />
        </FullScreenModalHeader>
      </Space>
    </Flex>
  ) : type === 'bottomsheet' ? (
    /**TODO: header paddings not clear */
    <React.Fragment>
      <Space padding={[0, 0, 1, 0]}>
        <View>{children}</View>
      </Space>
      <Divider />
    </React.Fragment>
  ) : null;
};

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

const ModalFooter = ({ children, type }) => {
  return type === 'centered' ? (
    <Space padding={[2, 3]}>
      <View>{children}</View>
    </Space>
  ) : type === 'fullscreen' ? null : type === 'bottomsheet' ? (
    /**TODO: footer paddings not clear */
    <React.Fragment>
      <Divider />
      <Space padding={[2]}>
        <View>{children}</View>
      </Space>
    </React.Fragment>
  ) : null;
};

const Modal = ({
  children,
  type,
  visible,
  onClose,
  onBackdropClick,
  showDragBar,
  onSwipeComplete,
  onBackButtonPress,
}) => {
  return type === 'centered' ? (
    <Space margin={[3]}>
      <RNModal
        isVisible={visible}
        onBackdropPress={onBackdropClick}
        onBackButtonPress={onBackButtonPress}
      >
        <CenteredModalBody>
          {onClose ? (
            <Flex alignSelf="flex-end">
              <Space padding={[0.5, 1, 0, 0]}>
                <View>
                  <Button
                    testID="centered-cross"
                    variant="tertiary"
                    variantColor="tone" /**TODO: button uses shade of 800 but Figma is showing 980*/
                    icon="close"
                    size="medium"
                    onClick={onClose}
                  />
                </View>
              </Space>
            </Flex>
          ) : null}
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, { ...child.props, type });
          })}
        </CenteredModalBody>
      </RNModal>
    </Space>
  ) : type === 'fullscreen' ? (
    <Space margin={[3, 0, 0, 0]}>
      <RNModal isVisible={visible} hasBackdrop={false} onBackButtonPress={onBackButtonPress}>
        <Flex flex={1}>
          <FullscreenModalBody>
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, { ...child.props, type, onClose });
            })}
          </FullscreenModalBody>
        </Flex>
      </RNModal>
    </Space>
  ) : type === 'bottomsheet' ? (
    <Space margin={[0]}>
      <Flex justifyContent="flex-end">
        {/**TODO: confirm backdrop for bottomsheetModal */}
        <RNModal
          isVisible={visible}
          swipeDirection={['down']}
          onBackdropPress={onBackdropClick}
          onSwipeComplete={onSwipeComplete}
          onBackButtonPress={onBackButtonPress}
        >
          <BottomsheetModalBody>
            {showDragBar ? (
              <Flex alignItems="center">
                <Space padding={[1, 0, 1.5, 0]}>
                  <View>
                    <Size height={0.5} width={8}>
                      <FullScreenDragBar />
                    </Size>
                  </View>
                </Space>
              </Flex>
            ) : null}
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, { ...child.props, type });
            })}
          </BottomsheetModalBody>
        </RNModal>
      </Flex>
    </Space>
  ) : null;
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onBackdropClick: PropTypes.func,
  onSwipeComplete: PropTypes.func,
  onBackButtonPress: PropTypes.func,
  showDragBar: PropTypes.bool,
};

Modal.defaultProps = {
  type: 'centered',
  visible: false,
  showDragBar: false,
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

ModalContent.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
};

ModalContent.defaultProps = {
  type: 'centered',
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
};

ModalFooter.defaultProps = {
  type: 'centered',
};

export default Modal;
