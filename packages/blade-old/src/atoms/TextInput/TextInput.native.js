import React, { useState, useCallback, useEffect } from 'react';
import { TextInput as NativeTextInput, Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
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

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  textInput: {
    padding({ variant, hasLeftIcon, hasPrefix, hasText, _isMultiline }) {
      let [paddingTop, paddingRight, paddingBottom, paddingLeft] = [0, 0, 0, 0];

      if (IS_ANDROID) {
        if (variant === 'outlined') {
          paddingTop = 1;
        }
      } else if (hasText) {
        paddingBottom = 0.5;
      } else {
        paddingBottom = 0.25;
      }

      if (_isMultiline) {
        paddingTop = IS_ANDROID ? 0 : 0.385;
      }

      paddingRight = 0;
      paddingLeft = variant === 'outlined' || hasLeftIcon || hasPrefix ? 0 : 1;
      // iOS & Android need different paddings
      return [paddingTop, paddingRight, paddingBottom, paddingLeft];
    },
    fontSize({ theme }) {
      return theme.bladeOld.fonts.size.medium;
    },
    lineHeight({ theme }) {
      return getLineHeight(theme, 'medium');
    },
    fontFamily({ theme }) {
      return theme.bladeOld.fonts.family.lato.regular;
    },
    color({ theme, disabled }) {
      if (disabled) {
        return theme.bladeOld.colors.shade[940];
      } else {
        return theme.bladeOld.colors.shade[980];
      }
    },

    height({ _isMultiline, variant }) {
      if (!_isMultiline) {
        if (variant === 'filled') {
          return '36px';
        } else {
          return '40px';
        }
      } else {
        return 'auto';
      }
    },
    minHeight({ _isMultiline }) {
      if (_isMultiline) {
        return '30px';
      } else {
        return 'auto';
      }
    },
    maxHeight({ _isMultiline }) {
      if (_isMultiline) {
        return '80px';
      } else {
        return 'auto';
      }
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outlined') {
        return 'transparent';
      } else if (disabled) {
        return theme.bladeOld.colors.tone[930];
      } else if (isFocused) {
        return theme.bladeOld.colors.tone[940];
      } else {
        return theme.bladeOld.colors.tone[930];
      }
    },
    marginTop({ _isMultiline, variant }) {
      if (_isMultiline && variant === 'outlined') {
        return '10px';
      } else {
        return 'auto';
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

const StyledInput = styled(NativeTextInput)`
  font-size: ${styles.textInput.fontSize};
  line-height: ${styles.textInput.lineHeight};
  font-family: ${styles.textInput.fontFamily};
  color: ${styles.textInput.color};
`;

const FillContainer = styled(View)`
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: ${styles.fillContainer.marginTop};
`;

const getAccessoryConfig = ({ errorText, prefix, suffix, iconLeft, iconRight }) => {
  const hasError = !isEmpty(errorText);
  const hasPrefix = !isEmpty(prefix);
  const hasSuffix = !isEmpty(suffix);
  const hasLeftIcon = !hasPrefix && !isEmpty(iconLeft);
  const hasRightIcon = !hasSuffix && !isEmpty(iconRight);
  return {
    hasError,
    hasPrefix,
    hasSuffix,
    hasLeftIcon,
    hasRightIcon,
  };
};

const getPlaceholderTextColor = ({ theme, disabled, isPlaceholderVisible, hasAnimatedLabel }) => {
  if (isPlaceholderVisible || !hasAnimatedLabel) {
    if (disabled) {
      return theme.bladeOld.colors.shade[930];
    } else {
      return theme.bladeOld.colors.shade[940];
    }
  } else {
    return 'transparent';
  }
};

const TextInput = React.forwardRef(
  (
    {
      placeholder,
      autoFocus,
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
      keyboardType,
      returnKeyType,
      autoCapitalize,
      onSubmitEditing,
      onFocus,
      onBlur,
      _isMultiline,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [input, setInput] = useState(value || '');
    // Used for storing layout value of TextInput
    const [layoutDimensions, setLayoutDimensions] = useState(null);
    // Used to hide placeholder while label is inside the TextInput
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);

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

    const hasText = !!(input && input.length > 0);
    const onTextInputFocus = useCallback(() => {
      setIsFocused(true);
      onFocus();
      /* Wait for 90ms to show the placeholder since it takes 100ms for Label to animate from inside to top of the TextInput.
       Otherwise they both overlap */
      /* Don't have any delay if label is on left of TextInput */

      setTimeout(() => {
        setIsPlaceholderVisible(true);
      }, 90);
    }, [onFocus]);

    const onTextInputBlur = useCallback(
      (event) => {
        setIsFocused(false);
        onBlur(event);
        setIsPlaceholderVisible(false);
      },
      [onBlur],
    );

    const onChangeText = useCallback(
      (text) => {
        // Store entered value in state
        setInput(text);
        if (onChange) {
          // Send entered value to the consumer
          onChange(text);
        }
      },
      [onChange, setInput],
    );

    const onTextInputLayout = useCallback(
      ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        // Set layout values only once
        if (isEmpty(layoutDimensions)) setLayoutDimensions(layout);
      },
      [layoutDimensions, setLayoutDimensions],
    );

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
      <Flex justifyContent="flex-end">
        <View>
          {!hasAnimatedLabel && !isEmpty(layoutDimensions) && labelPosition === 'top' ? (
            <Label.Regular
              position={labelPosition}
              disabled={disabled}
              inputLayoutDimensions={layoutDimensions}
              _isMultiline={_isMultiline}
            >
              {label}
            </Label.Regular>
          ) : null}
          {/* Animated Label */}
          {!isEmpty(layoutDimensions) && hasAnimatedLabel ? (
            <Label.Animated
              isFocused={isFocused}
              hasText={hasText}
              disabled={disabled}
              layoutDimensions={layoutDimensions}
              variant={variant}
              hasError={hasError}
              _isMultiline={_isMultiline}
            >
              {label}
            </Label.Animated>
          ) : null}

          {/* Text Input Container */}
          <Flex flexDirection="row" alignItems="flex-start">
            <View>
              {/* Fixed Left Label */}
              {!hasAnimatedLabel && !isEmpty(layoutDimensions) && labelPosition === 'left' ? (
                <Label.Regular
                  inputLayoutDimensions={layoutDimensions}
                  position={labelPosition}
                  disabled={disabled}
                  _isMultiline={_isMultiline}
                >
                  {label}
                </Label.Regular>
              ) : null}
              {/* Text Input */}
              <Flex flexDirection="column" flex={width === 'auto' ? 1 : 0}>
                <View>
                  <FillContainer
                    _isMultiline={_isMultiline}
                    variant={variant}
                    isFocused={isFocused}
                    disabled={disabled}
                  >
                    <Flex flexDirection="row" alignItems="center">
                      <Size
                        width={styles.inputContainer.width({
                          width,
                        })}
                      >
                        <InputContainer>
                          {hasPrefix ? (
                            <AccessoryText
                              variant={variant}
                              disabled={disabled}
                              _isMultiline={_isMultiline}
                            >
                              {prefix}
                            </AccessoryText>
                          ) : null}
                          {hasLeftIcon ? (
                            <AccessoryIcon
                              variant={variant}
                              name={iconLeft}
                              disabled={disabled}
                              hasError={hasError}
                              _isMultiline={_isMultiline}
                            />
                          ) : null}

                          <Flex flex={1}>
                            <Space
                              padding={styles.textInput.padding({
                                variant,
                                hasLeftIcon,
                                hasPrefix,
                                hasText,
                                _isMultiline,
                              })}
                            >
                              <Size
                                height={styles.textInput.height({
                                  _isMultiline,
                                  variant,
                                })}
                                maxHeight={styles.textInput.maxHeight({
                                  _isMultiline,
                                })}
                                minHeight={styles.textInput.minHeight({
                                  _isMultiline,
                                })}
                              >
                                <StyledInput
                                  ref={ref}
                                  autoFocus={autoFocus}
                                  placeholder={placeholder}
                                  placeholderTextColor={placeholderTextColor}
                                  onFocus={onTextInputFocus}
                                  onBlur={onTextInputBlur}
                                  onChangeText={onChangeText}
                                  hasText={hasText}
                                  selectionColor={theme.bladeOld.colors.shade[980]} // not able to change this for Android
                                  editable={!disabled}
                                  disabled={disabled}
                                  variant={variant}
                                  hasPrefix={hasPrefix}
                                  hasLeftIcon={hasLeftIcon}
                                  maxLength={maxLength}
                                  onLayout={onTextInputLayout}
                                  value={input}
                                  multiline={_isMultiline}
                                  secureTextEntry={type === 'password'}
                                  keyboardType={keyboardType}
                                  returnKeyType={returnKeyType}
                                  autoCapitalize={autoCapitalize}
                                  onSubmitEditing={onSubmitEditing}
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
                            currentLength={input.length}
                          />
                        ) : null}
                      </View>
                    </Flex>
                  ) : null}
                </View>
              </Flex>
            </View>
          </Flex>
        </View>
      </Flex>
    );
  },
);

TextInput.propTypes = {
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
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
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  width: PropTypes.oneOf(['small', 'medium', 'auto']),
  type: PropTypes.oneOf(['text', 'password']),
  keyboardType: PropTypes.oneOf([
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  _isMultiline: PropTypes.bool,
};

TextInput.defaultProps = {
  onChange: () => {},
  placeholder: '',
  disabled: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  width: 'medium',
  type: 'text',
  onFocus: () => {},
  onBlur: () => {},
};

export default TextInput;
