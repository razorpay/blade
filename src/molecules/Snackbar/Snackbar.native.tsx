import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Text from '../../atoms/Text';
import Flex from '../../atoms/Flex';
import Size from '../../atoms/Size';
import Space from '../../atoms/Space';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import Position from '../../atoms/Position';
import { getColor } from '../../_helpers/theme';
import icons from '../../icons';
import { useSnackbar } from './SnackbarContext';

const SNACKBAR_WIDTH = Dimensions.get('window').width - 32;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = {
  backgroundColor({ variant, theme }) {
    switch (variant) {
      case 'positive':
        return getColor(theme, 'positive.900');
      case 'negative':
        return getColor(theme, 'negative.900');
      case 'warning':
        return getColor(theme, 'neutral.900');
      case 'neutral':
        return getColor(theme, 'shade.900');
      default:
        return getColor(theme, 'positive.900');
    }
  },
};

const SnackbarContainer = styled(View)<any>`
  border-radius: 2px;
  background-color: ${styles.backgroundColor};
`;

const Snackbar = ({ variant, title, action, onClose, maxLines, icon, position }) => {
  const { isVisible, close } = useSnackbar();
  const [bottomY, setBottomY] = useState(0);
  const animationConfig = {
    animationValue: {
      initial: 0,
      final: 1,
    },
    duration: 450,
  };
  const { current: visibility } = useRef(
    new Animated.Value(animationConfig.animationValue.initial),
  );

  const handleClose = () => {
    close();
    if (onClose) {
      onClose();
    }
  };

  const handleAction = () => {
    action.onClick();
  };

  const handleLayout = useCallback(({ nativeEvent }) => {
    setBottomY(nativeEvent.layout.y);
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(visibility, {
        toValue: animationConfig.animationValue.final,
        useNativeDriver: true,
        duration: animationConfig.duration,
      }).start();
    } else {
      Animated.timing(visibility, {
        toValue: animationConfig.animationValue.initial,
        useNativeDriver: true,
        duration: animationConfig.duration,
      }).start();
    }
  }, [isVisible]);

  return (
    <Position
      position="absolute"
      top={position?.top}
      bottom={position?.bottom}
      left={position?.left}
      right={position?.right}
    >
      <Animated.View
        style={{
          opacity: visibility.interpolate({
            inputRange: [0.5, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: visibility.interpolate({
                inputRange: [0, 1],
                outputRange: [SCREEN_HEIGHT - bottomY, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
        onLayout={handleLayout}
      >
        <Size width={`${SNACKBAR_WIDTH}px`}>
          <Space padding={[1.5]}>
            <Flex flexDirection="row" alignItems="center">
              <SnackbarContainer variant={variant}>
                {icon ? (
                  <Space padding={[0, 1, 0, 0]}>
                    <View>
                      <Icon name={icon} size="medium" fill="light.900" testID="snackbar-icon" />
                    </View>
                  </Space>
                ) : null}
                <Space padding={[0, 2, 0, 0]}>
                  <Flex flex={1}>
                    <View>
                      <Text size="medium" color="light.900" maxLines={maxLines}>
                        {title}
                      </Text>
                    </View>
                  </Flex>
                </Space>
                {action?.label ? (
                  <Space padding={[0, 0.75, 0, 0]}>
                    <View>
                      <Button
                        variant="secondary"
                        size="xsmall"
                        variantColor="light"
                        onClick={handleAction}
                        testID="ds-snackbar-action-button"
                      >
                        {action.label}
                      </Button>
                    </View>
                  </Space>
                ) : null}
                {onClose ? (
                  <Space padding={[0, 0.75, 0, 0]}>
                    <View>
                      <Button
                        variant="tertiary"
                        size="xsmall"
                        icon="close"
                        variantColor="light"
                        onClick={handleClose}
                        testID="ds-snackbar-close-button"
                      />
                    </View>
                  </Space>
                ) : null}
              </SnackbarContainer>
            </Flex>
          </Space>
        </Size>
      </Animated.View>
    </Position>
  );
};

Snackbar.propTypes = {
  variant: PropTypes.oneOf(['positive', 'negative', 'warning', 'neutral']),
  title: PropTypes.string,
  action: PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func }),
  onClose: PropTypes.func,
  maxLines: PropTypes.number,
  icon: PropTypes.oneOf(Object.keys(icons)),
  position: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
};

Snackbar.defaultProps = {
  variant: 'positive',
};

export default Snackbar;
