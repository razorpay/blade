import React, { useCallback } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Text from '../../atoms/Text';
import Flex from '../../atoms/Flex';
import Size from '../../atoms/Size';
import Space from '../../atoms/Space';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import { getColor } from '../../_helpers/theme';

const SNACKBAR_WIDTH = Dimensions.get('window').width - 32;

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

const SnackbarContainer = styled(View)`
  border-radius: 2px;
  background-color: ${styles.backgroundColor};
`;

const Snackbar = ({
  variant,
  text,
  actionText,
  onAction,
  showDismissButton,
  onDismiss,
  maxLines,
}) => {
  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  return (
    <Size width={`${SNACKBAR_WIDTH}px`}>
      <Space padding={[1.5]}>
        <Flex flexDirection="row" alignItems="center">
          <SnackbarContainer variant={variant}>
            <Space padding={[0, 1, 0, 0]}>
              <View>
                <Icon name="info" size="medium" fill="light.100" />
              </View>
            </Space>
            <Space padding={[0, 2, 0, 0]}>
              <Flex flex={1}>
                <View>
                  <Text size="medium" color="light.100" maxLines={maxLines}>
                    {text}
                  </Text>
                </View>
              </Flex>
            </Space>
            {actionText ? (
              <Space padding={[0, 0.75, 0, 0]}>
                <View>
                  <Button
                    variant="secondary"
                    size="xsmall"
                    variantColor="shade"
                    onClick={onAction}
                    testID="ds-snackbar-action-button"
                  >
                    {actionText}
                  </Button>
                </View>
              </Space>
            ) : null}
            {showDismissButton ? (
              <Space padding={[0, 0.75, 0, 0]}>
                <View>
                  <Button
                    variant="tertiary"
                    size="xsmall"
                    icon="close"
                    variantColor="shade"
                    onClick={handleDismiss}
                    testID="ds-snackbar-dismiss-button"
                  />
                </View>
              </Space>
            ) : null}
          </SnackbarContainer>
        </Flex>
      </Space>
    </Size>
  );
};

Snackbar.propTypes = {
  variant: PropTypes.oneOf(['positive', 'negative', 'warning', 'neutral']),
  text: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  showDismissButton: PropTypes.bool,
  onDismiss: PropTypes.func,
  maxLines: PropTypes.number,
};

Snackbar.defaultProps = {
  variant: 'positive',
};

export default Snackbar;
