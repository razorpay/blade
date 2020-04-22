import React, { useContext, useState, useCallback, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import { getLineHeight } from '../../_helpers/theme';
import Flex from '../Flex';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import isEmpty from '../../_helpers/isEmpty';
import Size from '../Size';
import Space from '../Space';
import isDefined from '../../_helpers/isDefined';
import Label from './Label';
import CharacterCount from './CharacterCount';
import AccessoryIcon from './AccessoryIcon';
import AccessoryText from './AccessoryText';
import Text from './Text';
import Line from './Line';

const styles = {
  textInput: {
    padding({ variant }) {
      if (variant === 'filled') {
        return [0, 1, 0, 1];
      } else {
        return [0, 0, 0, 0];
      }
    },
    lineHeight({ theme }) {
      return getLineHeight(theme, 'medium');
    },
    color({ theme, disabled }) {
      if (disabled) {
        return theme.colors.shade[940];
      } else {
        return theme.colors.shade[980];
      }
    },

    height({ variant }) {
      if (variant === 'filled') {
        return '36px';
      } else {
        return '40px';
      }
    },
    textTransform({ autoCapitalize }) {
      if (autoCapitalize === 'words') {
        return 'capitalize';
      } else if (autoCapitalize === 'characters') {
        return 'uppercase';
      } else return 'none';
    },
    backgroundColor({ variant, theme, isFocused }) {
      if (variant === 'filled') {
        if (isFocused) {
          return theme.colors.tone[950];
        }
        return theme.colors.tone[930];
      }
      return 'initial';
    },
    hoverBackgroundColor({ variant, theme, disabled }) {
      if (variant === 'filled' && !disabled) {
        return theme.colors.tone[940];
      }
      return 'initial';
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outlined') {
        return 'transparent';
      } else if (disabled) {
        return theme.colors.tone[930];
      } else if (isFocused) {
        return theme.colors.tone[940];
      } else {
        return theme.colors.tone[930];
      }
    },
  },
  inputContainer: {
    width({ width }) {
      switch (width) {
        case 'auto':
          return '100%';
        case 'small':
          return '160px';
        case 'medium':
          return '240px';
        default:
          return '240px';
      }
    },
  },
};

const InputContainer = styled(View)`
  background-color: transparent;
`;

const StyledInput = styled.input`
  font-size: ${(props) => props.theme.fonts.size.medium};
  line-height: ${styles.textInput.lineHeight};
  font-family: ${(props) => props.theme.fonts.family.lato.regular};
  color: ${styles.textInput.color};
  border: none;
  text-transform: ${styles.textInput.textTransform};
  padding: ${styles.textInput.padding};
  background-color: ${styles.textInput.backgroundColor};
  &:hover {
    background-color: ${styles.textInput.hoverBackgroundColor};
  }
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.placeholderTextColor};
  }
  &::selection {
    background-color: ${(props) => props.onSelect};
  }
`;

const FillContainer = styled(View)`
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: auto;
`;

const RelativeContainer = styled(View)`
  position: relative;
  display: ${(props) => (props.direction ? 'flex' : 'initial')};
  flex-direction: ${(props) => (props.direction ? 'column' : 'row')};
`;

const getAccessoryConfig = ({ errorText, prefix, suffix, iconLeft, iconRight }) => {
  const hasError = !isEmpty(errorText);
  const hasPrefix = !isEmpty(prefix);
  const hasSuffix = !isEmpty(suffix);
  const hasLeftIcon = !hasPrefix && !isEmpty(iconLeft);
  const hasRightIcon = !hasSuffix && !isEmpty(iconRight);
  return { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon };
};

const getPlaceholderTextColor = ({ theme, disabled, isPlaceholderVisible, hasAnimatedLabel }) => {
  if (isPlaceholderVisible || !hasAnimatedLabel) {
    if (disabled) {
      return theme.colors.shade[930];
    } else {
      return theme.colors.shade[940];
    }
  } else {
    return 'transparent';
  }
};

const TextInput = ({
  placeholder,
  onChange,
  helpText,
  errorText,
  variant,
  prefix,
  suffix,
  disabled,
  value,
  iconLeft,
  iconRight,
  maxLength,
  label,
  testID,
  labelPosition,
  width,
  type,
  autoCapitalize,
}) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(value || undefined);
  // Used for storing layout value of TextInput
  // Used to hide placeholder while label is inside the TextInput
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);
  // // Used to change selected color of the text input
  // const [isSelected, setIsSelected] = useState(false);

  const hasAnimatedLabel = variant === 'outlined';

  const placeholderTextColor = getPlaceholderTextColor({
    theme,
    disabled,
    isPlaceholderVisible,
    hasAnimatedLabel,
  });

  // Derive accessory conditions based on props
  const { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon } = getAccessoryConfig({
    errorText,
    prefix,
    suffix,
    iconLeft,
    iconRight,
  });

  if (labelPosition === 'left' && variant === 'outlined') {
    // Outlined Text Input has only a top label
    throw Error('Cannot have a left label on an outlined Text Input');
  }

  const hasText = !!(isDefined(input) && input.length > 0);
  const onFocus = useCallback(() => {
    setIsFocused(true);

    /* Wait for 90ms to show the placeholder since it takes 100ms for Label to animate from inside to top of the TextInput.
       Otherwise they both overlap */
    /* Don't have any delay if label is on left of TextInput */

    setTimeout(() => {
      setIsPlaceholderVisible(true);
    }, 90);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocused(false);
    setIsPlaceholderVisible(false);
  }, [setIsFocused, setIsPlaceholderVisible]);

  const onChangeText = useCallback(
    (event) => {
      const text = event.target.value;
      // Store entered value in state
      setInput(text);
      if (onChange) {
        // Send entered value to the consumer
        onChange(text);
      }
    },
    [onChange, setInput],
  );

  const onSelectText = () => {
    return theme.colors.shade[980];
  };

  useEffect(() => {
    if (isDefined(value)) {
      setInput(value);
    }
  }, [value]);

  if (!isEmpty(prefix) && !isEmpty(iconLeft)) {
    throw Error('Cannot have prefix and left icon together');
  }

  if (!isEmpty(suffix) && !isEmpty(iconRight)) {
    throw Error('Cannot have suffix and right icon together');
  }

  return (
    <Flex
      justifyContent="flex-end"
      flexDirection={variant === 'filled' && labelPosition !== 'left' ? 'column' : 'row'}
    >
      <RelativeContainer direction={variant === 'filled'}>
        {!hasAnimatedLabel ? (
          <Label
            Animated={hasAnimatedLabel}
            position={labelPosition}
            disabled={disabled}
            isFocused={isFocused}
            hasText={hasText}
            variant={variant}
            hasError={hasError}
            iconLeft={iconLeft}
            prefix={prefix}
            value={input}
          >
            {label}
          </Label>
        ) : null}

        {/* Text Input Container */}
        <Flex flexDirection="row" alignItems="flex-start">
          <View>
            {/* Fixed Left Label */}
            {hasAnimatedLabel ? (
              <Label
                animated={hasAnimatedLabel}
                position={labelPosition}
                disabled={disabled}
                isFocused={isFocused}
                hasText={hasText}
                variant={variant}
                hasError={hasError}
                iconLeft={iconLeft}
                prefix={prefix}
                value={input}
              >
                {label}
              </Label>
            ) : null}
            {/* Text Input */}
            <Flex flexDirection="column" flex={width === 'auto' ? 1 : 0}>
              <View>
                <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
                  <Flex flexDirection="row" alignItems="center">
                    <Size width={styles.inputContainer.width({ width })}>
                      <InputContainer>
                        {hasPrefix ? (
                          <AccessoryText variant={variant} disabled={disabled}>
                            {prefix}
                          </AccessoryText>
                        ) : null}
                        {hasLeftIcon ? (
                          <AccessoryIcon
                            variant={variant}
                            name={iconLeft}
                            disabled={disabled}
                            hasError={hasError}
                          />
                        ) : null}

                        <Flex flex={1}>
                          <Space
                            padding={styles.textInput.padding({
                              variant,
                              hasLeftIcon,
                              hasPrefix,
                              hasText,
                            })}
                          >
                            <Size height={styles.textInput.height({ variant })} minHeight="auto">
                              <StyledInput
                                id={label}
                                type={type}
                                placeholder={placeholder}
                                placeholderTextColor={placeholderTextColor}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={onChangeText}
                                hasText={hasText}
                                onSelect={onSelectText}
                                readonly={disabled}
                                disabled={disabled}
                                variant={variant}
                                hasPrefix={hasPrefix}
                                hasLeftIcon={hasLeftIcon}
                                maxLength={maxLength}
                                value={input}
                                autoCapitalize={autoCapitalize}
                                {...automation(testID)}
                              />
                            </Size>
                          </Space>
                        </Flex>
                        {hasSuffix ? (
                          <AccessoryText variant={variant} disabled={disabled}>
                            {suffix}
                          </AccessoryText>
                        ) : null}
                        {hasRightIcon ? (
                          <AccessoryIcon
                            variant={variant}
                            name={iconRight}
                            disabled={disabled}
                            hasError={hasError}
                            size="xsmall"
                          />
                        ) : null}
                      </InputContainer>
                    </Size>
                  </Flex>
                  <Line isFocused={isFocused} hasError={hasError} disabled={disabled} />
                </FillContainer>

                {/* Bottom texts */}
                {hasError || helpText ? (
                  <Flex flexDirection="row" justifyContent="space-between">
                    <View>
                      <Text errorText={errorText} helpText={helpText} disabled={disabled} />
                      {maxLength !== undefined ? (
                        <CharacterCount
                          disabled={disabled}
                          maxLength={maxLength}
                          currentLength={isDefined(input) && input.length}
                        />
                      ) : null}
                    </View>
                  </Flex>
                ) : null}
              </View>
            </Flex>
          </View>
        </Flex>
      </RelativeContainer>
    </Flex>
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  maxLength: PropTypes.number,
  direction: PropTypes.bool,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  width: PropTypes.oneOf(['small', 'medium', 'auto']),
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  helpText: undefined,
  errorText: undefined,
  onChange: () => {},
  prefix: undefined,
  suffix: undefined,
  disabled: false,
  value: undefined,
  iconLeft: undefined,
  iconRight: undefined,
  maxLength: undefined,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  width: 'medium',
  type: 'text',
  autoCapitalize: undefined,
};

export default TextInput;
