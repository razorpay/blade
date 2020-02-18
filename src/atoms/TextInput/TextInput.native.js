import React, { useContext, useState, useCallback } from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import Line from './Line';
import HelpText from './HelpText';
import ErrorText from './ErrorText';

const StyledInput = styled(NativeTextInput)`
  background-color: transparent;
  width: 240px;
  height: 40px;
  padding: 0px 0px 0px 0px;
`;

const StyledText = styled.Text`
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.shade[700]};
`;

const TextInput = ({ placeholder, onChangeText, helpText, errorText }) => {
  const theme = useContext(ThemeContext);
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState('');

  const placeholderTextColor = theme.colors.shade[400];
  const hasError = !!(errorText && errorText.length > 0);

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
    <>
      <StyledInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChange}
        selectionColor={theme.colors.shade[700]} // not able to change this on Android
      >
        <StyledText>{input}</StyledText>
      </StyledInput>
      <Line isFocused={isFocused} hasError={hasError} />
      {hasError ? <ErrorText>{errorText}</ErrorText> : <HelpText>{helpText}</HelpText>}
    </>
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChangeText: PropTypes.func,
};

TextInput.defaultProps = {
  placeholder: 'Enter text here',
};

export default TextInput;
