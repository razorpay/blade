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

const styles = ({ type, theme }) => {
  if (type === 'centered') {
    return {
      'background-color': theme.colors.background[200],
      'border-radius': theme.spacings.xsmall,
    };
  }
  if (type === 'fullscreen') {
    return {
      'background-color': theme.colors.background[400],
    };
  }
  if (type === 'bottomsheet') {
    return {
      'background-color': theme.colors.background[200],
      'border-top-left-radius': '8px',
      'border-top-right-radius': '8px',
      'shadow-color': theme.colors.primary[930],
      'shadow-offset': '0px -4px',
      'shadow-opacity': '1',
      'shadow-radius': '15px',
      elevation: '2',
    };
  }
  return null;
};

const ModalContentContainer = styled(View)(({ type, theme }) => styles({ type, theme }));

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

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
  const theme = useTheme();

  const renderModal = () => {
    if (type === 'centered') {
      return (
        <Space margin={[3]}>
          <RNModal
            isVisible={visible}
            onBackdropPress={onBackdropClick}
            onBackButtonPress={onBackButtonPress}
            backdropColor={theme.colors.shade[970]}
          >
            <ModalContentContainer type="centered">
              {onClose ? (
                <Flex alignSelf="flex-end">
                  <Space padding={[0.5, 1, 0, 0]}>
                    <View>
                      <Button
                        testID="close-button"
                        variant="tertiary"
                        variantColor="tone"
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
            </ModalContentContainer>
          </RNModal>
        </Space>
      );
    }
    if (type === 'fullscreen') {
      return (
        <Space margin={[`${getStatusBarHeight(true)}px`, 0, 0, 0]}>
          <RNModal isVisible={visible} hasBackdrop={false} onBackButtonPress={onBackButtonPress}>
            <Flex flex={1}>
              <ModalContentContainer type="fullscreen">
                {React.Children.map(children, (child) => {
                  return React.cloneElement(child, { ...child.props, type, onClose });
                })}
              </ModalContentContainer>
            </Flex>
          </RNModal>
        </Space>
      );
    }
    if (type === 'bottomsheet') {
      return (
        <Space margin={[0]}>
          <Flex justifyContent="flex-end">
            <RNModal
              isVisible={visible}
              swipeDirection={['down']}
              onBackdropPress={onBackdropClick}
              onSwipeComplete={onSwipeComplete}
              onBackButtonPress={onBackButtonPress}
              avoidKeyboard={true}
              backdropColor={theme.colors.background[200]}
            >
              <ModalContentContainer type="bottomsheet">
                {showDragBar ? (
                  <Flex alignItems="center">
                    <Space padding={[1, 0, 1.5, 0]}>
                      <View>
                        <Size height={0.5} width={8}>
                          <BottomSheetDragBar />
                        </Size>
                      </View>
                    </Space>
                  </Flex>
                ) : null}
                {React.Children.map(children, (child) => {
                  return React.cloneElement(child, { ...child.props, type });
                })}
              </ModalContentContainer>
            </RNModal>
          </Flex>
        </Space>
      );
    }
    return null;
  };

  return renderModal();
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

export default Modal;
