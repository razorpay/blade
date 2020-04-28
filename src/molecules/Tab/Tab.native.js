import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/Text';
import { getColor, makePxValue } from '../../_helpers/theme';
import Icon from '../../atoms/Icon';
import Space from '../../atoms/Space';
import automation from '../../_helpers/automation-attributes';
import isEmpty from '../../_helpers/isEmpty';
import { getIconNames } from '../../_helpers/icon';

const styles = {
  label: {
    borderBottomWidth({ active }) {
      if (active) {
        return '1px';
      }
      return '0px';
    },
    borderBottomColor({ active, theme, disabled }) {
      if (disabled) {
        if (active) {
          return getColor(theme, 'primary.930');
        }
      }
      if (active) {
        return getColor(theme, 'primary.800');
      }
      return 'transparent';
    },
    margin() {
      return [0, 0, 0, 0.5];
    },
    padding() {
      return [1, 0, 1, 0];
    },
    color({ active, disabled, pressed }) {
      if (pressed) {
        if (active) {
          return 'primary.900';
        }
        return 'shade.970';
      } else if (active) {
        return disabled ? 'primary.700' : 'primary.800';
      } else {
        return disabled ? 'shade.940' : 'shade.960';
      }
    },
  },
  tab: {
    backgroundColor({ theme, active, pressed }) {
      if (pressed) {
        if (active) {
          return getColor(theme, 'primary.920');
        }
        return getColor(theme, 'tone.940');
      }
      return 'transparent';
    },
  },
};

const StyledTabButton = styled(TouchableOpacity)`
  min-width: ${makePxValue(6)};
  background-color: ${styles.tab.backgroundColor};
  border-top-left-radius: ${(props) => props.theme.spacings.xxsmall};
  border-top-right-radius: ${(props) => props.theme.spacings.xxsmall};
`;

const Label = styled(View)`
  border-bottom-width: ${styles.label.borderBottomWidth};
  border-bottom-color: ${styles.label.borderBottomColor};
`;

const Tab = ({ label, active, icon, onPress, disabled, testID }) => {
  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => {
    setPressed(true);
  }, []);

  const onPressOut = useCallback(() => {
    setPressed(false);
  }, []);

  const labelColor = styles.label.color({ active, disabled, pressed });

  return (
    <Flex flex={1} justifyContent="center">
      <StyledTabButton
        activeOpacity={1}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        pressed={pressed}
        active={active}
        {...automation(testID)}
      >
        <Flex alignItems="center" alignSelf="center" flexDirection="row" flexWrap="wrap">
          <Space padding={styles.label.padding()}>
            <Label active={active} disabled={disabled}>
              {!isEmpty(icon) && <Icon name={icon} fill={labelColor} size="small" />}
              <Space margin={styles.label.margin()}>
                <View>
                  <Text color={labelColor} disabled={disabled} numberOfLines={1} size="medium">
                    {label}
                  </Text>
                </View>
              </Space>
            </Label>
          </Space>
        </Flex>
      </StyledTabButton>
    </Flex>
  );
};

Tab.propTypes = {
  active: PropTypes.bool,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(getIconNames()),
  testID: PropTypes.string,
};

Tab.defaultProps = {
  active: false,
  onPress: () => {},
  disabled: false,
  icon: undefined,
  testID: 'ds-tab',
};

export default Tab;
