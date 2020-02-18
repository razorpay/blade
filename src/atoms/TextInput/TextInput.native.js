import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import Line from './Line';
import HelpText from './HelpText';
import ErrorText from './ErrorText';
import AccessoryText from './AccessoryText';

const styles = {
  inputContainerBackgroundColor({ variant, isFocused, theme }) {
    if (variant === 'outline') return 'transparent';
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
  color: ${(props) => props.theme.colors.shade[700]};
  flex: 1;
`;

const FillContainer = styled.View`
  background-color: ${styles.inputContainerBackgroundColor};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;

const TextInput = ({ placeholder, onChangeText, helpText, errorText, variant, prefix, suffix }) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState('');

  const placeholderTextColor = theme.colors.shade[400];
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
      <FillContainer variant={variant} isFocused={isFocused}>
        <InputContainer>
          {hasPrefix ? <AccessoryText>{prefix}</AccessoryText> : null}
          <StyledInput
            placeholder={` ${placeholder}`}
            placeholderTextColor={placeholderTextColor}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChange}
            input={input}
            selectionColor={theme.colors.shade[700]} // not able to change this on Android
          >
            <StyledText>{input}</StyledText>
          </StyledInput>
          {hasSuffix ? <AccessoryText>{suffix}</AccessoryText> : null}
        </InputContainer>
        <Line isFocused={isFocused} hasError={hasError} />
      </FillContainer>
      {hasError ? <ErrorText>{errorText}</ErrorText> : <HelpText>{helpText}</HelpText>}
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
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
};

export default TextInput;
