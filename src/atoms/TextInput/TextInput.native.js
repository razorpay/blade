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
import { getLineHeight } from '../../_helpers/fonts';
import Flex from '../Flex';

const styles = {
  inputContainerBackgroundColor({ variant, isFocused, theme, disabled }) {
    if (variant === 'outline') return 'transparent';
    else if (disabled) return theme.colors.tone[300];
    else if (isFocused) return theme.colors.tone[400];
    else return theme.colors.tone[300];
  },
  textInputPaddingBottom({ input }) {
    // iOS placeholder has a padding bottom by default and iOS text does not
    // Android has proper paddings
    if (Platform.OS === 'ios' && input && input.length > 0) return '6px';
    else if (Platform.OS === 'ios') return '2px';
    else return '0px';
  },
  textInputFontSize({ theme }) {
    return theme.fonts.size.large;
  },
  textInputLineHeight({ theme }) {
    return getLineHeight(theme.fonts.size.large, theme.fonts.lineHeight.large);
  },
  textInputFontFamily({ theme }) {
    return theme.fonts.family.lato.regular;
  },
  textColor({ disabled }) {
    if (disabled) {
      return 'shade.400';
    } else {
      return 'shade.700';
    }
  },
};

const Container = styled.View`
  background-color: transparent;
  width: 240px;
  height: 40px;
`;

const InputContainer = styled.View`
  background-color: transparent;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled(NativeTextInput)`
  height: 40px;
  padding-bottom: ${styles.textInputPaddingBottom};
  font-size: ${styles.textInputFontSize};
  line-height: ${styles.textInputLineHeight};
  font-family: ${styles.textInputFontFamily};
`;

const FillContainer = styled.View`
  background-color: ${styles.inputContainerBackgroundColor};
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
}) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState(children || '');

  const placeholderTextColor = disabled ? theme.colors.shade[300] : theme.colors.shade[400];
  const { hasError, hasPrefix, hasSuffix, hasLeftIcon, hasRightIcon } = getAccessoryConfig({
    errorText,
    prefix,
    suffix,
    iconLeft,
    iconRight,
  });

  const onFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const onBlur = useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  const onChange = useCallback(
    (text) => {
      setInput(text);
      if (onChangeText) {
        onChangeText(text);
      }
    },
    [onChangeText, setInput],
  );

  return (
    <Container>
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
              placeholder={` ${placeholder}`}
              placeholderTextColor={placeholderTextColor}
              onFocus={onFocus}
              onBlur={onBlur}
              onChangeText={onChange}
              input={input}
              selectionColor={theme.colors.shade[700]} // not able to change this on Android
              editable={!disabled}
            >
              <Space padding={[0, 0, 0.5, 0]}>
                <Text color={styles.textColor({ disabled })} size="medium">
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
      {hasError && !disabled ? (
        <ErrorText>{errorText}</ErrorText>
      ) : (
        <HelpText disabled={disabled}>{helpText}</HelpText>
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
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
};

export default TextInput;
