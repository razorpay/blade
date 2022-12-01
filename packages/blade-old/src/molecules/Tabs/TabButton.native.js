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
  title: {
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
  border-top-left-radius: ${(props) => props.theme.bladeOld.spacings.xxsmall};
  border-top-right-radius: ${(props) => props.theme.bladeOld.spacings.xxsmall};
`;

const Title = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: ${styles.title.borderBottomColor};
`;

const TabButton = ({ title, active, icon, onPress, disabled, testID, scrollEnabled }) => {
  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => {
    setPressed(true);
  }, []);

  const onPressOut = useCallback(() => {
    setPressed(false);
  }, []);

  const titleColor = styles.title.color({
    active,
    disabled,
    pressed,
  });

  return (
    <Flex
      flex={1}
      flexShrink={scrollEnabled ? 0 : undefined}
      flexBasis={scrollEnabled ? 'auto' : undefined}
      justifyContent="center"
    >
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
          <Space padding={[1, 0, 1, 0]}>
            <Title active={active} disabled={disabled}>
              {!isEmpty(icon) ? (
                <Space margin={[0, 0.5, 0, 0]}>
                  <View>
                    <Icon name={icon} fill={titleColor} size="small" testID="tab-button-icon" />
                  </View>
                </Space>
              ) : null}
              <Text
                color={titleColor}
                //@ts-expect-error
                numberOfLines={1}
                size="medium"
              >
                {title}
              </Text>
            </Title>
          </Space>
        </Flex>
      </StyledTabButton>
    </Flex>
  );
};

TabButton.propTypes = {
  active: PropTypes.bool,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(getIconNames()),
  testID: PropTypes.string,
  scrollEnabled: PropTypes.bool,
};

TabButton.defaultProps = {
  active: false,
  onPress: () => {},
  disabled: false,
  testID: 'ds-tab-button',
};

export default TabButton;
