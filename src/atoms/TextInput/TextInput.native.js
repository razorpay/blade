import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput, Platform, View } from 'react-native';
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
import Label from './Label';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  textInput: {
    padding({ variant, hasLeftIcon, hasPrefix }) {
      const paddingTop = IS_ANDROID ? '8px' : '0px';
      const paddingRight = '0px';
      const paddingBottom = IS_ANDROID ? '0px' : '4px';
      const paddingLeft = variant === 'outline' || hasLeftIcon || hasPrefix ? '0px' : '8px';
      // iOS & Android need different paddings
      return `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
    },
    fontSize({ theme }) {
      return theme.fonts.size.medium;
    },
    lineHeight({ theme }) {
      return getLineHeight(theme.fonts.size.medium, theme.fonts.lineHeight.large);
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
    color({ theme }) {
      return theme.colors.shade[700];
    },
  },
  fillContainer: {
    backgroundColor({ variant, isFocused, theme, disabled }) {
      if (variant === 'outline') return 'transparent';
      else if (disabled) return theme.colors.tone[300];
      else if (isFocused) return theme.colors.tone[400];
      else return theme.colors.tone[300];
    },
  },
  text: {
    color({ disabled }) {
      if (disabled) {
        return 'shade.400';
      } else {
        return 'shade.700';
      }
    },
  },
};

const Container = styled.View`
  width: 240px;
  justify-content: flex-end;
`;

const InputContainer = styled.View`
  background-color: transparent;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled(NativeTextInput)`
  height: 40px;
  padding: ${styles.textInput.padding};
  font-size: ${styles.textInput.fontSize};
  line-height: ${styles.textInput.lineHeight};
  font-family: ${styles.textInput.fontFamily};
  color: ${styles.textInput.color};
`;

const FillContainer = styled.View`
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
}) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState(children || '');
  // Used for storing layout value of TextInput
  const [layoutDimensions, setLayoutDimensions] = useState(null);
  // Used to hide placeholder while label is inside the TextInput
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(isFocused);

  const placeholderTextColor = disabled ? theme.colors.shade[300] : theme.colors.shade[400];
  // Derive accessory conditions based on props
  const { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon } = getAccessoryConfig({
    errorText,
    prefix,
    suffix,
    iconLeft,
    iconRight,
  });

  const onFocus = useCallback(() => {
    setFocused(true);

    /* Wait for 90ms to show the placeholder since it takes 100ms for Label to animate from inside to top of the TextInput.
       Otherwise they both overlap */
    setTimeout(() => {
      setIsPlaceholderVisible(true);
    }, 90);
  }, [setFocused, setIsPlaceholderVisible]);

  const onBlur = useCallback(() => {
    setFocused(false);
    setIsPlaceholderVisible(false);
  }, [setFocused, setIsPlaceholderVisible]);

  const onChange = useCallback(
    (text) => {
      // store entered value in state
      setInput(text);
      if (onChangeText) {
        // send entered value to the consumer
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
      {layoutDimensions ? (
        <Label
          isFocused={isFocused}
          hasText={!!(input && input.length > 0)}
          disabled={disabled}
          layoutDimensions={layoutDimensions}
          variant={variant}
          hasError={hasError}
        >
          {label}
        </Label>
      ) : null}
      <Space padding={styles.fillContainer.padding}>
        <FillContainer variant={variant} isFocused={isFocused} disabled={disabled}>
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
                size="xsmall"
              />
            ) : null}

            <Flex flex={1}>
              <StyledInput
                placeholder={isPlaceholderVisible ? placeholder : ''}
                placeholderTextColor={placeholderTextColor}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChange}
                input={input}
                selectionColor={theme.colors.shade[700]} // not able to change this for Android
                editable={!disabled}
                variant={variant}
                hasPrefix={hasPrefix}
                hasLeftIcon={hasLeftIcon}
                maxLength={maxLength}
                onLayout={onTextInputLayout}
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
      </Space>
      {hasError && !disabled ? (
        <ErrorText>{errorText}</ErrorText>
      ) : (
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
      )}
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
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
  label: 'Label',
};

export default TextInput;
