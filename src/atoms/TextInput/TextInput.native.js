import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import Line from './Line';
import HelpText from './HelpText';
import ErrorText from './ErrorText';
import AccessoryText from './AccessoryText';
import AccessoryIcon from './AccessoryIcon';
import Text from '../Text';
import Space from '../Space';
import { getLineHeight } from '../../_helpers/theme';
import Flex from '../Flex';
import CharacterCount from './CharacterCount.native';
import AnimatedLabel from './AnimatedLabel';
import automation from '../../_helpers/automation-attributes';
import Label from './Label';
import View from '../View';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  textInput: {
    padding({ variant, hasLeftIcon, hasPrefix, hasText }) {
      const paddingTop = IS_ANDROID ? '8px' : '0px';
      const paddingRight = '0px';
      const paddingBottom = IS_ANDROID ? '0px' : hasText ? '4px' : '2px';
      const paddingLeft = variant === 'outline' || hasLeftIcon || hasPrefix ? '0px' : '8px';
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
    color({ theme }) {
      return theme.colors.shade[970];
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outline') return 'transparent';
      else if (disabled) return theme.colors.tone[930];
      else if (isFocused) return theme.colors.tone[940];
      else return theme.colors.tone[930];
    },
  },
  text: {
    color({ disabled }) {
      if (disabled) {
        return 'shade.940';
      } else {
        return 'shade.970';
      }
    },
  },
  inputContainer: {
    width({ size }) {
      switch (size) {
        case 'small':
          return '160px';
        case 'medium':
        default:
          return '240px';
      }
    },
  },
};

const Container = styled(View)`
  justify-content: flex-end;
`;

const InputContainer = styled(View)`
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  width: ${styles.inputContainer.width};
`;

const StyledInput = styled(NativeTextInput)`
  height: 40px;
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
  const hasError = !!(errorText && errorText.length > 0);
  const hasPrefix = !!(prefix && prefix.length > 0);
  const hasSuffix = !!(suffix && suffix.length > 0);
  const hasLeftIcon = !!(!hasPrefix && iconLeft && iconLeft.length > 0);
  const hasRightIcon = !!(!hasSuffix && iconRight && iconRight.length > 0);
  return { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon };
};

const TextInput = ({
  placeholder,
  onChangeText,
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
  const [isFocused, setFocused] = useState(false);
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
    setFocused(true);

    /* Wait for 90ms to show the placeholder since it takes 100ms for Label to animate from inside to top of the TextInput.
       Otherwise they both overlap */
    /* Don't have any delay if label is on left of TextInput */

    setTimeout(() => {
      setIsPlaceholderVisible(true);
    }, 90);
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
    setIsPlaceholderVisible(false);
  }, [setFocused, setIsPlaceholderVisible]);

  const onChange = useCallback(
    (text) => {
      // Store entered value in state
      setInput(text);
      if (onChangeText) {
        // Send entered value to the consumer
        onChangeText(text);
      }
    },
    [onChangeText, setInput],
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
    <Container>
      {/* Animated Label */}
      {layoutDimensions && !hasLeftLabel ? (
        <AnimatedLabel
          isFocused={isFocused}
          hasText={hasText}
          disabled={disabled}
          layoutDimensions={layoutDimensions}
          variant={variant}
          hasError={hasError}
        >
          {label}
        </AnimatedLabel>
      ) : null}

      {/* Text Input Container */}
      <Flex flexDirection="row" alignItems="flex-start">
        <View>
          {/*Fixed Left Label */}
          {hasLeftLabel && layoutDimensions ? (
            <Label inputLayoutDimensions={layoutDimensions}>{label}</Label>
          ) : null}
          {/* Text Input */}
          <Flex flexDirection="column">
            <View>
              <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
                <InputContainer size={size}>
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
                      size="xsmall"
                    />
                  ) : null}

                  <Flex flex={1}>
                    <StyledInput
                      placeholder={isPlaceholderVisible || hasLeftLabel ? placeholder : ''}
                      placeholderTextColor={placeholderTextColor}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      hasText={hasText}
                      selectionColor={theme.colors.shade[970]} // not able to change this for Android
                      editable={!disabled}
                      variant={variant}
                      hasPrefix={hasPrefix}
                      hasLeftIcon={hasLeftIcon}
                      maxLength={maxLength}
                      onLayout={onTextInputLayout}
                      {...automation(testID)}
                    >
                      <Space padding={[0, 0, 0.5, 0]}>
                        <Text color={styles.text.color({ disabled })} size="medium">
                          {input}
                        </Text>
                      </Space>
                    </StyledInput>
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
                <Line isFocused={isFocused} hasError={hasError} disabled={disabled} />
              </FillContainer>
              {/* Bottom texts */}
              {hasError && !disabled ? (
                <ErrorText>{errorText}</ErrorText>
              ) : helpText ? (
                <Flex flexDirection="row" justifyContent="space-between">
                  <View>
                    <HelpText disabled={disabled}>{helpText}</HelpText>
                    {showCharacterCount && typeof maxLength === 'number' && (
                      <CharacterCount
                        disabled={disabled}
                        maxLength={maxLength}
                        inputLength={input.length}
                      />
                    )}
                  </View>
                </Flex>
              ) : null}
            </View>
          </Flex>
        </View>
      </Flex>
    </Container>
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChangeText: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outline']),
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
  size: PropTypes.oneOf(['small', 'medium']),
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  size: 'medium',
};

export default TextInput;
