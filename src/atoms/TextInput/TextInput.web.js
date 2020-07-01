import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import Flex from '../Flex';
import View from '../View';
import Space from '../Space';
import Size from '../Size';
import isEmpty from '../../_helpers/isEmpty';
import isDefined from '../../_helpers/isDefined';
import { getLineHeight } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import Label from './Label';
import CharacterCount from './CharacterCount';
import AccessoryIcon from './AccessoryIcon';
import AccessoryText from './AccessoryText';
import Text from './Text';
import Line from './Line';

const restrictedNumericals = ['e', '.', '+', '-'];

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
    textTransform({ autoCapitalize }) {
      if (autoCapitalize === 'words') {
        return 'capitalize';
      } else if (autoCapitalize === 'characters') {
        return 'uppercase';
      } else return 'none';
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
      } else {
        return theme.colors.tone[930];
      }
    },
    hoverBackgroundColor({ variant, theme, disabled }) {
      if (variant === 'filled') {
        if (disabled) {
          return theme.colors.tone[930];
        }
        return theme.colors.tone[940];
      } else {
        return 'initial';
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
  background-color: transparent;
  pointer-events: ${(props) => (props.disabled ? 'none' : '')};
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
`;

const FillContainer = styled(View)`
  background-color: ${styles.fillContainer.backgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-top: auto;
  position: relative;
  box-sizing: border-box;
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
  autoCapitalize,
}) => {
  const theme = useContext(ThemeContext);
  const inputRef = useRef();
  const containerRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(value || '');
  // Used for storing layout value of TextInput
  const [layoutDimensions, setLayoutDimensions] = useState({
    initialLeftPosition: 0,
    finalTopPosition: 0,
  });
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
    },
    [maxLength, onChange, setInput],
  );

  const onSelectText = () => {
    return theme.colors.primary[980];
  };

  const onKeyDownText = (e) => {
    if (type === 'number' && restrictedNumericals.includes(e.key)) {
      e.preventDefault();
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
      const finalTopPosition = inputRef.current.offsetHeight;

      setLayoutDimensions({
        initialLeftPosition,
        finalTopPosition,
      });
    }
  }, [inputRef, containerRef]);

  return (
    <Flex justifyContent="flex-end" flexDirection="column">
      <View ref={containerRef}>
        {!hasAnimatedLabel && labelPosition === 'top' ? (
          <Label.Regular
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
            layoutDimensions={layoutDimensions}
          >
            {label}
          </Label.Regular>
        ) : null}

        {/* Text Input Container */}
        <Flex flexDirection="row" alignItems="flex-start">
          <View>
            {/* Fixed Left Label */}
            {!hasAnimatedLabel && labelPosition === 'left' ? (
              <Label.Regular
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
              </Label.Regular>
            ) : null}
            {/* Text Input */}
            <Flex flexDirection="column" flex={width === 'auto' ? 1 : 0}>
              <View>
                <Size height="36px" minHeight="auto">
                  <Space padding={[1, 0, 1, 0]}>
                    <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
                      {hasAnimatedLabel ? (
                        <Label.Animated
                          position={labelPosition}
                          disabled={disabled}
                          isFocused={isFocused}
                          hasText={hasText}
                          variant={variant}
                          hasError={hasError}
                          iconLeft={iconLeft}
                          prefix={prefix}
                          value={input}
                          layoutDimensions={layoutDimensions}
                        >
                          {label}
                        </Label.Animated>
                      ) : null}
                      <Flex flexDirection="row" alignItems="center">
                        <Size width={styles.inputContainer.width({ width })}>
                          <InputContainer>
                            {hasPrefix ? (
                              <AccessoryText
                                hasPrefix={hasPrefix}
                                variant={variant}
                                disabled={disabled}
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
                                hasLeftIcon={hasLeftIcon}
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
                                <Size minHeight="auto">
                                  <StyledInput
                                    id={label}
                                    type={type}
                                    placeholder={placeholder}
                                    placeholderTextColor={placeholderTextColor}
                                    onFocus={onFocus}
                                    onBlur={onBlurText}
                                    onChange={onChangeText}
                                    onKeyDown={onKeyDownText}
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
                                    ref={inputRef}
                                    {...automation(testID)}
                                  />
                                </Size>
                              </Space>
                            </Flex>
                            {hasSuffix ? (
                              <AccessoryText
                                hasSuffix={hasSuffix}
                                variant={variant}
                                disabled={disabled}
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
                                size="xsmall"
                                hasRightIcon={hasRightIcon}
                              />
                            ) : null}
                          </InputContainer>
                        </Size>
                      </Flex>
                      <Line isFocused={isFocused} hasError={hasError} disabled={disabled} />
                    </FillContainer>
                  </Space>
                </Size>

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
  position: PropTypes.bool,
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
  successText: undefined,
  onChange: () => {},
  onBlur: () => {},
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
