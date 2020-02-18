import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import Line from './Line';
import HelpText from './HelpText';
import ErrorText from './ErrorText';
import AccessoryText from './AccessoryText';

const styles = {
  inputContainerBackgroundColor({ variant, isFocused, theme, disabled }) {
    if (variant === 'outline') return 'transparent';
    else if (disabled) return theme.colors.tone[300];
    else if (isFocused) return theme.colors.tone[400];
    else return theme.colors.tone[300];
  },
  textInputPaddingBottom({ input }) {
    // iOS placeholder has a padding bottom by default but iOS text does not
    // Android has proper paddings
    if (Platform.OS === 'ios' && input && input.length > 0) return '6px';
    else return '0px';
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
  padding: 0px 0px 0px 1px;
  padding-bottom: ${styles.textInputPaddingBottom};
  flex: 1;
`;

const StyledText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 4px;
  color: ${(props) =>
    props.disabled ? props.theme.colors.shade[400] : props.theme.colors.shade[700]};
  flex: 1;
`;

const FillContainer = styled.View`
  background-color: ${styles.inputContainerBackgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;

const TextInput = ({
  placeholder,
  onChangeText,
  helpText,
  errorText,
  variant,
  prefix,
  suffix,
  disabled,
}) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState('');

  const placeholderTextColor = disabled ? theme.colors.shade[300] : theme.colors.shade[400];
  const hasError = !!(errorText && errorText.length > 0);
  const hasPrefix = !!(prefix && prefix.length > 0);
  const hasSuffix = !!(suffix && suffix.length > 0);

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
          {hasPrefix ? <AccessoryText disabled={disabled}>{prefix}</AccessoryText> : null}
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
            <StyledText disabled={disabled}>{input}</StyledText>
          </StyledInput>
          {hasSuffix ? <AccessoryText disabled={disabled}>{suffix}</AccessoryText> : null}
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
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
};

export default TextInput;
