import React, { useCallback, useContext } from 'react';
import { TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import Text from '../Text';
import isDefined from '../../_helpers/isDefined';
import Flex from '../Flex';
import Icon from '../Icon';
import View from '../View';
import Space from '../Space';
import { getColor, makePxValue } from '../../_helpers/theme';
import { getIconNames } from '../../_helpers/icon';
import Size from '../Size';
import automation from '../../_helpers/automation-attributes';
import { useSegmentControlContext } from './SegmentControlContext';

const styles = {
  option: {
    backgroundColor({ theme, variant, selected }) {
      switch (variant) {
        case 'filled':
          if (selected) {
            return getColor(theme, 'primary.920');
          }
          return getColor(theme, 'tone.930');
        case 'outlined':
          if (selected) {
            return getColor(theme, 'primary.930');
          }
          return 'transparent';
        default:
          return 'transparent';
      }
    },
    underlayColor({ theme, selected }) {
      if (selected) {
        return getColor(theme, 'primary.950');
      }
      return getColor(theme, 'tone.950');
    },
    borderBottomWidth({ variant }) {
      if (variant === 'filled') {
        return makePxValue(0.125);
      }
      return '0px';
    },
    borderColor({ theme, variant, selected, disabled }) {
      if (variant === 'filled') {
        if (selected && disabled) {
          return getColor(theme, 'primary.400');
        } else if (disabled) {
          return getColor(theme, 'shade.920');
        } else if (selected) {
          return getColor(theme, 'primary.800');
        } else {
          return getColor(theme, 'shade.930');
        }
      }
      return 'transparent';
    },
  },
  text: {
    color({ selected, disabled }) {
      if (selected && disabled) {
        return 'primary.500';
      } else if (disabled) {
        return 'shade.940';
      } else if (selected) {
        return 'primary.800';
      } else {
        return 'shade.960';
      }
    },
    size({ size }) {
      if (size === 'small') {
        return 'small';
      } else {
        return 'medium';
      }
    },
    weight({ variant }) {
      if (variant === 'outlined') {
        return 'bold';
      } else {
        return 'regular';
      }
    },
  },
  subText: {
    color({ selected, disabled }) {
      if (selected && disabled) {
        return 'primary.400';
      } else if (disabled) {
        return 'shade.930';
      } else if (selected) {
        return 'primary.700';
      } else {
        return 'shade.950';
      }
    },
  },
  divider: {
    backgroundColor({ theme, hide }) {
      return hide ? 'transparent' : theme.colors.shade[930];
    },
  },
  icon: {
    size({ size }) {
      if (size === 'small') {
        return 'xsmall';
      } else {
        return 'small';
      }
    },
  },
};

const StyledOption = styled(TouchableHighlight)`
  background-color: ${styles.option.backgroundColor};
  border-bottom-width: ${styles.option.borderBottomWidth};
  border-color: ${styles.option.borderColor};
`;

const Divider = styled(View)`
  position: absolute;
  right: 0px;
  top: ${makePxValue(1)};
  bottom: ${makePxValue(1)};
  width: ${makePxValue(0.125)};
  background-color: ${styles.divider.backgroundColor};
`;

const isSelected = ({ context, value }) => {
  return context && isDefined(context.value) && context.value === value;
};

const SegmentControlOption = ({ value, subText, hideDivider, icon, disabled, testID }) => {
  const context = useSegmentControlContext();
  const theme = useContext(ThemeContext);
  const size = context.size;

  const selected = isSelected({ context, value });

  const onPress = useCallback(() => {
    if (isDefined(context.onChange)) {
      context.onChange(value);
    }
  }, [context, value]);

  if (size === 'small' && isDefined(subText)) {
    throw new Error(`SegmentControl\n \`subText\` cannot be used with \`size='small'\``);
  }

  if (size === 'small' && isDefined(icon)) {
    throw new Error(`SegmentControl\n \`icon\` cannot be used with \`size='small'\``);
  }

  return (
    <Flex flex={1} alignItems="center" justifyContent="center">
      <Space padding={[1, 1, 1, 1]}>
        <Size minWidth={makePxValue(6)}>
          <StyledOption
            onPress={onPress}
            underlayColor={styles.option.underlayColor({ theme, selected })}
            variant={context.variant}
            selected={selected}
            disabled={disabled}
            {...automation(testID)}
          >
            <React.Fragment>
              <Flex flexDirection="column">
                <View>
                  <Flex flexDirection="row" alignItems="center">
                    <View>
                      {isDefined(icon) && size !== 'small' ? (
                        <Space margin={[0, 0.5, 0, 0]}>
                          <View>
                            <Icon
                              name={icon}
                              fill={styles.text.color({ selected, disabled })}
                              size={styles.icon.size({ size })}
                            />
                          </View>
                        </Space>
                      ) : null}
                      <Text
                        size={styles.text.size({ size })}
                        color={styles.text.color({ selected, disabled })}
                        maxLines={1}
                        _weight={styles.text.weight({ variant: context.variant })}
                      >
                        {value}
                      </Text>
                    </View>
                  </Flex>
                  {isDefined(subText) && size !== 'small' ? (
                    <View>
                      <Space padding={isDefined(icon) ? [0, 0, 0, 2.5] : [0, 0, 0, 0]}>
                        <View>
                          <Text
                            size="xsmall"
                            color={styles.subText.color({ selected, disabled })}
                            maxLines={1}
                          >
                            {subText}
                          </Text>
                        </View>
                      </Space>
                    </View>
                  ) : null}
                </View>
              </Flex>
              <Divider hide={hideDivider} />
            </React.Fragment>
          </StyledOption>
        </Size>
      </Space>
    </Flex>
  );
};

SegmentControlOption.propTypes = {
  value: PropTypes.string.isRequired,
  subText: PropTypes.string,
  hideDivider: PropTypes.bool,
  icon: PropTypes.oneOf(getIconNames()),
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

SegmentControlOption.defaultProps = {
  subText: undefined,
  hideDivider: true,
  icon: undefined,
  disabled: false,
  testID: 'ds-segment-control-option',
};

export default SegmentControlOption;
