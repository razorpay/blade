import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import Line from './Line';
import Text from './Text';
import AccessoryText from './AccessoryText';
import AccessoryIcon from './AccessoryIcon';
import { getLineHeight } from '../../_helpers/theme';
import Flex from '../Flex';
import CharacterCount from './CharacterCount';
import Label from './Label';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import isEmpty from '../../_helpers/isEmpty';
import Size from '../Size';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  textInput: {
    padding({ variant, hasLeftIcon, hasPrefix, hasText }) {
      const paddingTop = IS_ANDROID ? '8px' : '0px';
      const paddingRight = '0px';
      const paddingBottom = IS_ANDROID ? '0px' : hasText ? '4px' : '2px';
      const paddingLeft = variant === 'outlined' || hasLeftIcon || hasPrefix ? '0px' : '8px';
      // iOS & Android need different paddings
      return `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
    },
    fontSize({ theme }) {
      return theme.fonts.size.medium;
    },
    lineHeight({ theme }) {
      return getLineHeight(theme, 'medium');
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
    color({ theme, disabled }) {
      if (disabled) {
        return theme.colors.shade[940];
      } else {
        return theme.colors.shade[980];
      }
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
    width({ size }) {
      switch (size) {
        case 'block':
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
  padding: ${styles.textInput.padding};
  font-size: ${styles.textInput.fontSize};
  line-height: ${styles.textInput.lineHeight};
  font-family: ${styles.textInput.fontFamily};
  color: ${styles.textInput.color};
`;

const FillContainer = styled(View)`
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;

const getAccessoryConfig = ({ errorText, prefix, suffix, iconLeft, iconRight }) => {
  const hasError = !isEmpty(errorText);
  const hasPrefix = !isEmpty(prefix);
  const hasSuffix = !isEmpty(suffix);
  const hasLeftIcon = !hasPrefix && !isEmpty(iconLeft);
  const hasRightIcon = !hasSuffix && !isEmpty(iconRight);
  return { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon };
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
  children,
  iconLeft,
  iconRight,
  maxLength,
  showCharacterCount,
  label,
  testID,
  labelPosition,
  size,
}) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(children || '');
  // Used for storing layout value of TextInput
  const [layoutDimensions, setLayoutDimensions] = useState(null);
  // Used to hide placeholder while label is inside the TextInput
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);

  const hasLeftLabel = labelPosition === 'left' && variant === 'filled';

  const placeholderTextColor = disabled ? theme.colors.shade[930] : theme.colors.shade[940];

  // Derive accessory conditions based on props
  const { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon } = getAccessoryConfig({
    errorText,
    prefix,
    suffix,
    iconLeft,
    iconRight,
  });

  const hasText = !!(input && input.length > 0);
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
      if (!layoutDimensions) setLayoutDimensions(layout);
    },
    [layoutDimensions, setLayoutDimensions],
  );

  return (
    <Flex justifyContent="flex-end">
      <View>
        {/* Animated Label */}
        {layoutDimensions && !hasLeftLabel ? (
          <Label.Animated
            isFocused={isFocused}
            hasText={hasText}
            disabled={disabled}
            layoutDimensions={layoutDimensions}
            variant={variant}
            hasError={hasError}
          >
            {label}
          </Label.Animated>
        ) : null}

        {/* Text Input Container */}
        <Flex flexDirection="row" alignItems="flex-start">
          <View>
            {/* Fixed Left Label */}
            {hasLeftLabel && layoutDimensions ? (
              <Label.Regular inputLayoutDimensions={layoutDimensions}>{label}</Label.Regular>
            ) : null}
            {/* Text Input */}
            <Flex flexDirection="column" flex={size === 'block' ? 1 : 0}>
              <View>
                <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
                  <Flex flexDirection="row" alignItems="center">
                    <Size width={styles.inputContainer.width({ size })}>
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
                          <Size height="40px">
                            <StyledInput
                              placeholder={isPlaceholderVisible || hasLeftLabel ? placeholder : ''}
                              placeholderTextColor={placeholderTextColor}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChangeText={onChangeText}
                              hasText={hasText}
                              selectionColor={theme.colors.shade[980]} // not able to change this for Android
                              editable={!disabled}
                              disabled={disabled}
                              variant={variant}
                              hasPrefix={hasPrefix}
                              hasLeftIcon={hasLeftIcon}
                              maxLength={maxLength}
                              onLayout={onTextInputLayout}
                              value={input}
                              {...automation(testID)}
                            />
                          </Size>
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
                      {showCharacterCount && maxLength !== undefined ? (
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
  children: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  maxLength: PropTypes.number,
  showCharacterCount: PropTypes.bool,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  size: PropTypes.oneOf(['small', 'medium', 'block']),
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  helpText: undefined,
  errorText: undefined,
  onChange: () => {},
  prefix: undefined,
  suffix: undefined,
  disabled: false,
  children: undefined,
  iconLeft: undefined,
  iconRight: undefined,
  maxLength: undefined,
  showCharacterCount: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  size: 'medium',
};

export default TextInput;
