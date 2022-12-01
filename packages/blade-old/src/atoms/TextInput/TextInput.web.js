import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components';
import automation from '../../_helpers/automation-attributes';
import isEmpty from '../../_helpers/isEmpty';
import { getColor, makePxValue } from '../../_helpers/theme';
import Flex from '../Flex';
import Size from '../Size';
import Space from '../Space';
import View from '../View';
import AccessoryIcon from './AccessoryIcon';
import AccessoryText from './AccessoryText';
import CharacterCount from './CharacterCount';
import Label from './Label';
import Line from './Line';
import Text from './Text';

const styles = {
  textInput: {
    padding({ variant }) {
      if (variant === 'filled') {
        return [0, 1, 0, 1];
      }
      return [0];
    },
    color({ theme, disabled }) {
      if (disabled) {
        return theme.bladeOld.colors.shade[940];
      }
      return theme.bladeOld.colors.shade[980];
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outlined') {
        return 'transparent';
      } else if (disabled) {
        return theme.bladeOld.colors.tone[930];
      } else if (isFocused) {
        return theme.bladeOld.colors.tone[950];
      }
      return theme.bladeOld.colors.tone[930];
    },
    hoverBackgroundColor({ variant, theme, disabled }) {
      if (variant === 'filled') {
        if (disabled) {
          return theme.bladeOld.colors.tone[930];
        }
        return theme.bladeOld.colors.tone[940];
      }
      return '';
    },
    height({ _isMultiline, variant }) {
      if (variant === 'filled') {
        if (_isMultiline) {
          return makePxValue(8);
        }
        return makePxValue(4.5);
      }
      return 'auto';
    },
    padding({ variant }) {
      if (variant === 'outlined') {
        return [0, 0, 1, 0];
      }
      return [1, 0, 1, 0];
    },
  },
  inputContainer: {
    width({ width }) {
      switch (width) {
        case 'auto':
          return '100%';
        case 'small':
          return makePxValue(20);
        case 'medium':
          return makePxValue(30);
        default:
          return makePxValue(30);
      }
    },
  },
  line: {
    backgroundColor({ theme, disabled, hasError, state }) {
      if (disabled) {
        return getColor(theme, 'shade.930');
      }
      if (hasError) {
        return getColor(theme, 'negative.900');
      }
      switch (state) {
        case 'hover':
          return getColor(theme, 'shade.960');
        case 'focus':
          return getColor(theme, 'primary.800');
        default:
          return getColor(theme, 'shade.940');
      }
    },
  },
};

const InputContainer = styled(View)`
  background-color: transparent;
`;

const StyledInput = styled.input`
  font-size: ${(props) => props.theme.bladeOld.fonts.size.medium};
  line-height: ${(props) => props.theme.bladeOld.fonts.lineHeight.medium};
  font-family: ${(props) => props.theme.bladeOld.fonts.family.lato.regular};
  color: ${styles.textInput.color};
  border: none;
  background-color: transparent;
  pointer-events: ${(props) => (props.disabled ? 'none' : '')};
  resize: none;
  width: 100%;
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }
  &::selection {
    background-color: ${(props) => props.theme.bladeOld.colors.primary[980]};
  }
  /* Removes red box shadow rectangle on firefox */
  &:invalid {
    box-shadow: none;
  }
  &&& {
    &::placeholder {
      color: ${(props) => props.placeholderTextColor};
    }
  }
`;

const FillContainer = styled(View)`
  position: relative;
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: auto;
  box-sizing: border-box;
  &:hover {
    background-color: ${styles.fillContainer.hoverBackgroundColor};
  }
`;

const InteractionContainer = styled(View)`
  ${Line} {
    background-color: ${(props) =>
      styles.line.backgroundColor({
        ...props,
        state: '',
      })};
  }
  &:hover {
    ${Line} {
      background-color: ${(props) =>
        styles.line.backgroundColor({
          ...props,
          state: 'hover',
        })};
    }
  }
  &:focus-within {
    ${Line} {
      background-color: ${(props) =>
        styles.line.backgroundColor({
          ...props,
          state: 'focus',
        })};
    }
  }
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
    }
    return theme.bladeOld.colors.shade[940];
  }
  return 'transparent';
};

// eslint-disable-next-line complexity
const TextInput = ({
  placeholder,
  onChange,
  onBlur,
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
  id,
  name,
  _isMultiline,
  autoCapitalize,
}) => {
  const theme = useTheme();
  const inputRef = useRef();
  const containerRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(value || '');
  // Used for storing layout value of TextInput
  const [layoutDimensions, setLayoutDimensions] = useState(null);
  // Used to hide placeholder while label is inside the TextInput
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);

  const hasText = !isEmpty(input);
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

  if (!isEmpty(prefix) && !isEmpty(iconLeft)) {
    throw Error('Cannot have prefix and left icon together');
  }

  if (!isEmpty(suffix) && !isEmpty(iconRight)) {
    throw Error('Cannot have suffix and right icon together');
  }

  const onFocus = useCallback(() => {
    setIsFocused(true);
    /* Wait for 90ms to show the placeholder since it takes 100ms for Label to animate from inside to top of the TextInput.
       Otherwise they both overlap */
    /* Don't have any delay if label is on left of TextInput */

    setTimeout(() => {
      setIsPlaceholderVisible(true);
    }, 90);
  }, [setIsFocused, setIsPlaceholderVisible]);

  const onBlurText = useCallback(
    (event) => {
      setIsFocused(false);
      setIsPlaceholderVisible(false);
      const inputValue = event.target.value;
      setInput(inputValue);
      onBlur(inputValue);
    },
    [onBlur],
  );

  const onChangeText = useCallback(
    (event) => {
      let inputValue = event.target.value;
      if (inputValue.length > maxLength) {
        return;
      }
      if (autoCapitalize !== 'none') {
        inputValue = transformString(inputValue, autoCapitalize);
      }
      setInput(inputValue);
      onChange(inputValue);
    },
    [maxLength, onChange, autoCapitalize],
  );

  // allowed values = 0-9 "." "," "whitespace" "-"
  const isInputNumberAllowed = (inputValue) => /^[0-9., -]+$/g.test(inputValue);

  const onKeyPress = useCallback(
    (event) => {
      if (type === 'number') {
        const charCode = typeof event.which === 'number' ? event.which : event.keyCode;
        const char = String.fromCharCode(charCode);
        const isAllowed = isInputNumberAllowed(char);

        if (!isAllowed) {
          event.preventDefault();
        }
      }
    },
    [type],
  );

  const onPaste = useCallback(
    (event) => {
      if (type === 'number') {
        const inputValue = event.clipboardData.getData('Text');
        const isAllowed = isInputNumberAllowed(inputValue);

        if (!isAllowed) {
          event.preventDefault();
        }
      }
    },
    [type],
  );

  useEffect(() => {
    if (value === '' || value) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    if (inputRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const inputRect = inputRef.current.getBoundingClientRect();
      const initialLeftPosition = inputRect.x - containerRect.x;
      const finalTopPosition = inputRef.current.offsetHeight;

      setLayoutDimensions({
        initialLeftPosition,
        finalTopPosition,
      });
    }
  }, [inputRef, containerRef]);

  useEffect(() => {
    // Adjust height of textarea as user types for outlined variant
    if (inputRef.current && _isMultiline && variant === 'outlined') {
      inputRef.current.style.height = 'inherit';
      const height = inputRef.current.scrollHeight;
      // if scroll-height is greater than 60 then keep height at 60 for some space between Input & Line
      if (height > 60) {
        inputRef.current.style.height = `60px`;
      } else {
        inputRef.current.style.height = `${height}px`;
      }
    }
  }, [_isMultiline, variant, inputRef, input]);

  // Due to browser issues, if type=number we use type=text and show numpad on mobile devices using inputMode=numeric
  const inputType = type === 'number' ? 'text' : type;

  /* Specifies the initial value for rows in textarea(_isMultiline)
   * Has no effect on text-input as rows is not passed if _isMultiline = false */
  const noOfRows = variant === 'outlined' ? 1 : 3;

  return (
    <Flex flexDirection="column" justifyContent="flex-end">
      <View ref={containerRef}>
        {labelPosition === 'top' && !hasAnimatedLabel ? (
          <Label.Regular
            position={labelPosition}
            disabled={disabled}
            //@ts-expect-error
            isFocused={isFocused}
            variant={variant}
            hasError={hasError}
            hasText={hasText}
            value={input}
            width={width}
            id={id}
          >
            {label}
          </Label.Regular>
        ) : null}

        {/* Text Input Container */}
        <Flex flexDirection="row" alignItems="flex-start">
          <View>
            {!hasAnimatedLabel && labelPosition === 'left' ? (
              <Label.Regular
                position={labelPosition}
                disabled={disabled}
                //@ts-expect-error
                isFocused={isFocused}
                variant={variant}
                hasError={hasError}
                hasText={hasText}
                value={input}
                width={width}
                id={id}
              >
                {label}
              </Label.Regular>
            ) : null}
            {/* Text Input */}
            <Flex flexDirection="column" flex={width === 'auto' ? 1 : 0}>
              <View>
                <InteractionContainer disabled={disabled} hasError={hasError}>
                  <Size
                    height={styles.fillContainer.height({
                      variant,
                      _isMultiline,
                    })}
                    maxHeight={8}
                  >
                    <Space
                      padding={styles.fillContainer.padding({
                        variant,
                      })}
                    >
                      <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
                        {hasAnimatedLabel && !isEmpty(layoutDimensions) ? (
                          <Label.Animated
                            //@ts-expect-error
                            position={labelPosition}
                            disabled={disabled}
                            isFocused={isFocused}
                            variant={variant}
                            hasError={hasError}
                            value={input}
                            hasText={hasText}
                            layoutDimensions={layoutDimensions}
                            width={width}
                            id={id}
                          >
                            {label}
                          </Label.Animated>
                        ) : null}
                        <Flex flexDirection="row" alignItems="center">
                          <Size
                            width={styles.inputContainer.width({
                              width,
                            })}
                            maxHeight="100%"
                          >
                            <InputContainer>
                              {hasPrefix ? (
                                <AccessoryText
                                  //@ts-expect-error
                                  position="left"
                                  variant={variant}
                                  disabled={disabled}
                                  isFocused={isFocused}
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
                                  //@ts-expect-error
                                  isFocused={isFocused}
                                  position="left"
                                />
                              ) : null}
                              <Flex flex={1}>
                                <Space
                                  padding={styles.textInput.padding({
                                    variant,
                                  })}
                                >
                                  <Size maxHeight={8}>
                                    <StyledInput
                                      id={id}
                                      name={name}
                                      type={inputType}
                                      placeholder={placeholder}
                                      placeholderTextColor={placeholderTextColor}
                                      onFocus={onFocus}
                                      onBlur={onBlurText}
                                      onChange={onChangeText}
                                      onKeyPress={onKeyPress}
                                      onPaste={onPaste}
                                      hasText={hasText}
                                      readonly={disabled}
                                      disabled={disabled}
                                      variant={variant}
                                      hasPrefix={hasPrefix}
                                      hasLeftIcon={hasLeftIcon}
                                      maxLength={maxLength}
                                      value={input}
                                      ref={inputRef}
                                      as={_isMultiline ? 'textarea' : 'input'}
                                      rows={_isMultiline ? noOfRows : ''}
                                      inputMode={type === 'number' ? 'numeric' : null} // pass only for type=number, otherwise let browser infer via type
                                      {...automation(testID)}
                                    />
                                  </Size>
                                </Space>
                              </Flex>
                              {hasSuffix ? (
                                <AccessoryText
                                  //@ts-expect-error
                                  position="right"
                                  variant={variant}
                                  disabled={disabled}
                                  isFocused={isFocused}
                                >
                                  {suffix}
                                </AccessoryText>
                              ) : null}
                              {hasRightIcon ? (
                                <AccessoryIcon
                                  variant={variant}
                                  name={iconRight}
                                  disabled={disabled}
                                  hasError={hasError}
                                  //@ts-expect-error
                                  isFocused={isFocused}
                                  position="right"
                                />
                              ) : null}
                            </InputContainer>
                          </Size>
                        </Flex>
                      </FillContainer>
                    </Space>
                  </Size>
                  <Line isFocused={isFocused} hasError={hasError} disabled={disabled} />
                </InteractionContainer>
                {/* Bottom texts */}
                {hasError || helpText ? (
                  <Flex flexDirection="row" justifyContent="space-between">
                    <View>
                      <Text errorText={errorText} helpText={helpText} disabled={disabled} />
                      {maxLength ? (
                        <CharacterCount
                          disabled={disabled}
                          maxLength={maxLength}
                          currentLength={input.length || 0}
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
  helpText: PropTypes.node,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
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
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  id: PropTypes.string,
  name: PropTypes.string,
  _isMultiline: PropTypes.bool,
  autoCapitalize: PropTypes.oneOf(['none', 'characters']),
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  onChange: () => {},
  onBlur: () => {},
  disabled: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  width: 'medium',
  type: 'text',
  _isMultiline: false,
  autoCapitalize: 'none',
};

export default TextInput;

function transformString(inputValue = '', autoCapitalize = 'none') {
  switch (autoCapitalize) {
    case 'characters':
      return inputValue.toUpperCase();
    default:
      return inputValue;
  }
}
