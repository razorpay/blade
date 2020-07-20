import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import Flex from '../Flex';
import View from '../View';
import Space from '../Space';
import Size from '../Size';
import isEmpty from '../../_helpers/isEmpty';
import isDefined from '../../_helpers/isDefined';
import automation from '../../_helpers/automation-attributes';
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
      }
      return [0];
    },
    color({ theme, disabled }) {
      if (disabled) {
        return theme.colors.shade[940];
      }
      return theme.colors.shade[980];
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outlined') {
        return 'transparent';
      } else if (disabled) {
        return theme.colors.tone[930];
      } else if (isFocused) {
        return theme.colors.tone[950];
      }
      return theme.colors.tone[930];
    },
    hoverBackgroundColor({ variant, theme, disabled }) {
      if (variant === 'filled') {
        if (disabled) {
          return theme.colors.tone[930];
        }
        return theme.colors.tone[940];
      }
      return '';
    },
    height({ _isMultiline, variant }) {
      if (variant === 'filled') {
        if (_isMultiline) {
          return '64px';
        }
        return '36px';
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
  line-height: ${(props) => props.theme.fonts.lineHeight.medium};
  font-family: ${(props) => props.theme.fonts.family.lato.regular};
  color: ${styles.textInput.color};
  max-height: 64px;
  border: none;
  background-color: transparent;
  pointer-events: ${(props) => (props.disabled ? 'none' : '')};
  resize: none;
  &::selection {
    background-color: ${(props) => props.onSelect};
  }
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
  &[type='number'] {
    appearance: textfield;
  }
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
  /* Removes red box shadow rectangle on firefox */
  &:invalid {
    box-shadow: none;
  }
`;

const FillContainer = styled(View)`
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: auto;
  position: relative;
  box-sizing: border-box;
  max-height: 64px;
  &:hover {
    background-color: ${styles.fillContainer.hoverBackgroundColor};
  }
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

// eslint-disable-next-line complexity
const TextInput = ({
  placeholder,
  onChange,
  onBlur,
  helpText,
  successText,
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
  _isMultiline,
}) => {
  const theme = useContext(ThemeContext);
  const inputRef = useRef();
  const containerRef = useRef();
  const fillContainerRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(value || '');
  // Used for storing layout value of TextInput
  const [layoutDimensions, setLayoutDimensions] = useState(null);
  // Used to hide placeholder while label is inside the TextInput
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);

  const hasText = !!(isDefined(input) && input.length > 0);
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
  }, []);

  const onBlurText = useCallback(
    (event) => {
      setIsFocused(false);
      setIsPlaceholderVisible(false);
      const text = event.target.value;
      setInput(text);
      if (onBlur) {
        onBlur(text);
      }
    },
    [setIsFocused, setIsPlaceholderVisible, setInput, onBlur],
  );

  const onChangeText = useCallback(
    (event) => {
      const text = event.target.value;
      if (text.length > maxLength) {
        return;
      }
      setInput(text);
      if (onChange) {
        onChange(text);
      }

      if (_isMultiline && variant === 'outlined') {
        setTimeout(() => {
          inputRef.current.style.height = 'inherit';
          fillContainerRef.current.style.height = 'inherit';
          // Calculate the height
          const height = inputRef.current.scrollHeight;
          fillContainerRef.current.style.height = `${height}px`;
          inputRef.current.style.height = `${height}px`;
        }, 0);
      }
    },
    [maxLength, onChange, setInput, _isMultiline, inputRef, fillContainerRef, variant],
  );

  const onSelectText = () => {
    return theme.colors.primary[980];
  };

  const onKeyPress = (e) => {
    if (type === 'number') {
      const charCode = typeof e.which === 'number' ? e.which : e.keyCode;
      const char = String.fromCharCode(charCode);
      const isAllowed = /[0-9]/g.test(char) || char === '-' || char === '.';

      if (!isAllowed) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (isDefined(value)) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    if (inputRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const inputRect = inputRef.current.getBoundingClientRect();
      const initialLeftPosition = inputRect.x - containerRect.x;
      const finalTopPosition = fillContainerRef.current.offsetHeight;

      setLayoutDimensions({
        initialLeftPosition,
        finalTopPosition,
      });
    }
  }, [inputRef, containerRef]);

  return (
    <Flex justifyContent="flex-end" flexDirection="column">
      <View ref={containerRef}>
        {labelPosition === 'top' || variant === 'outlined' ? (
          <Label.Regular
            position={labelPosition}
            disabled={disabled}
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
                <Size height={styles.fillContainer.height({ variant, _isMultiline })}>
                  <Space padding={styles.fillContainer.padding({ variant })}>
                    <FillContainer
                      ref={fillContainerRef}
                      variant={variant}
                      isFocused={isFocused}
                      disabled={disabled}
                    >
                      {hasAnimatedLabel && !isEmpty(layoutDimensions) ? (
                        <Label.Animated
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
                        <Size width={styles.inputContainer.width({ width })} maxHeight="100%">
                          <InputContainer>
                            {hasPrefix ? (
                              <AccessoryText position="left" variant={variant} disabled={disabled}>
                                {prefix}
                              </AccessoryText>
                            ) : null}
                            {hasLeftIcon ? (
                              <AccessoryIcon
                                variant={variant}
                                name={iconLeft}
                                disabled={disabled}
                                hasError={hasError}
                                position="left"
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
                                <Size minWidth={[0]}>
                                  <StyledInput
                                    id={id}
                                    type={type}
                                    placeholder={placeholder}
                                    placeholderTextColor={placeholderTextColor}
                                    onFocus={onFocus}
                                    onBlur={onBlurText}
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
                                    ref={inputRef}
                                    onKeyPress={onKeyPress}
                                    as={_isMultiline ? 'textarea' : 'input'}
                                    {...automation(testID)}
                                  />
                                </Size>
                              </Space>
                            </Flex>
                            {hasSuffix ? (
                              <AccessoryText position="right" variant={variant} disabled={disabled}>
                                {suffix}
                              </AccessoryText>
                            ) : null}
                            {hasRightIcon ? (
                              <AccessoryIcon
                                variant={variant}
                                name={iconRight}
                                disabled={disabled}
                                hasError={hasError}
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
                {/* Bottom texts */}
                {hasError || helpText || successText ? (
                  <Flex flexDirection="row" justifyContent="space-between">
                    <View>
                      <Text
                        errorText={errorText}
                        helpText={helpText}
                        successText={successText}
                        disabled={disabled}
                      />
                      {maxLength !== undefined ? (
                        <CharacterCount
                          disabled={disabled}
                          maxLength={maxLength}
                          currentLength={isDefined(input) ? input.length : 0}
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
  successText: PropTypes.node,
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
  _isMultiline: PropTypes.bool,
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
};

export default TextInput;
