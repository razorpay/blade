import React from 'react';
import RNModal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styled, { useTheme } from 'styled-components/native';
import PropTypes from 'prop-types';
import Space from '../../atoms/Space';
import Flex from '../../atoms/Flex';
import Size from '../../atoms/Size';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import ModalHeader from './ModalHeader.native';
import ModalContent from './ModalContent.native';
import ModalFooter from './ModalFooter.native';

const styles = ({ variant, theme }) => {
  if (variant === 'centered') {
    return {
      'background-color': theme.bladeOld.colors.background[300],
      'border-radius': theme.bladeOld.spacings.xsmall,
    };
  }
  if (variant === 'fullscreen') {
    return {
      'background-color': theme.bladeOld.colors.background[400],
    };
  }
  if (variant === 'bottomsheet') {
    return {
      'background-color': theme.bladeOld.colors.background[300],
      'border-top-left-radius': '8px',
      'border-top-right-radius': '8px',
      'shadow-color': theme.bladeOld.colors.primary[930],
      'shadow-offset': '0px -4px',
      'shadow-opacity': '1',
      'shadow-radius': '15px',
      elevation: '2',
    };
  }
  return null;
};

const ModalContainer = styled(View)(({ variant, theme }) =>
  styles({
    variant,
    theme,
  }),
);

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.overlay[50]};
  border-radius: 4px;
`;

const Modal = ({ children, variant, visible, onClose, onBackdropClick }) => {
  const theme = useTheme();

  if (variant === 'centered') {
    return (
      <Space margin={[3]}>
        <RNModal
          isVisible={visible}
          onBackdropPress={onBackdropClick}
          onBackButtonPress={onClose}
          backdropColor={theme.bladeOld.colors.overlay[200]}
          propagateSwipe
        >
          <ModalContainer variant="centered">
            {onClose ? (
              <Flex alignSelf="flex-end">
                <Space padding={[0.5, 1, 0, 0]}>
                  <View>
                    <Button
                      testID="close-button"
                      variant="tertiary"
                      variantColor="shade"
                      icon="close"
                      size="medium"
                      onClick={onClose}
                    />
                  </View>
                </Space>
              </Flex>
            ) : null}
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, {
                ...child.props,
                variant,
              });
            })}
          </ModalContainer>
        </RNModal>
      </Space>
    );
  }
  if (variant === 'fullscreen') {
    return (
      <Space margin={[`${getStatusBarHeight(true)}px`, 0, 0, 0]}>
        <RNModal isVisible={visible} hasBackdrop={false} onBackButtonPress={onClose} propagateSwipe>
          <Flex flex={1}>
            <ModalContainer variant="fullscreen">
              {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                  ...child.props,
                  variant,
                  onClose,
                });
              })}
            </ModalContainer>
          </Flex>
        </RNModal>
      </Space>
    );
  }
  if (variant === 'bottomsheet') {
    return (
      <Space margin={[0]}>
        <Flex justifyContent="flex-end">
          <RNModal
            isVisible={visible}
            swipeDirection={['down']}
            onBackdropPress={onBackdropClick}
            onSwipeComplete={onClose}
            onBackButtonPress={onClose}
            avoidKeyboard={true}
            backdropColor={theme.bladeOld.colors.overlay[200]}
            propagateSwipe
          >
            <ModalContainer variant="bottomsheet">
              <Flex alignItems="center">
                <Space padding={[1, 0, 1.5, 0]}>
                  <View>
                    <Size height={0.5} width={8}>
                      <BottomSheetDragBar />
                    </Size>
                  </View>
                </Space>
              </Flex>
              {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                  ...child.props,
                  variant,
                });
              })}
            </ModalContainer>
          </RNModal>
        </Flex>
      </Space>
    );
  }
  return null;
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['bottomsheet', 'centered', 'fullscreen']),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onBackdropClick: PropTypes.func,
};

Modal.defaultProps = {
  variant: 'centered',
  visible: false,
};

export default Modal;
