import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import CheckBoxIcon from './CheckboxIcon';

const CheckboxContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const RippleView = styled(View)(
  (props) => `
  width: ${props.width}px;
  height: ${props.height}px;
  border-radius: ${props.width / 2}px;
  background-color: ${props.underlayColor ? props.underlayColor : 'transparent'};
`,
);

const TextContainer = styled.View`
  margin-left: 4px;
`;

const Title = styled(Text)(
  (props) => `
  color: ${props.disabled ? props.theme.colors.shade[500] : props.theme.colors.shade[700]};
  font-size: ${props.theme.fonts.size[props.size]};
`,
);

const mapSizeToRippleViewProps = (checkBoxSize) => {
  switch (checkBoxSize) {
    case 'large':
      return {
        width: 24,
        height: 24,
      };
    case 'medium':
      return {
        width: 20,
        height: 20,
      };
    case 'small':
      return {
        width: 16,
        height: 16,
      };
    case 'xsmall':
      return { width: 12, height: 12 };
    default:
      return {
        width: 24,
        height: 24,
      };
  }
};

const mapSizeToTitleTextProps = (checkboxSize) => {
  switch (checkboxSize) {
    case 'large':
      return { size: 'l' };
    case 'medium':
      return { size: 'm' };
    case 'small':
      return { size: 'xs' };
    default:
      return { size: 's' };
  }
};

const mapSizetoHelpTextProps = (checkboxSize) => {
  switch (checkboxSize) {
    case 'large':
      return { size: 'm' };
    case 'medium':
      return { size: 'xs' };
    default:
      return { size: 's' };
  }
};

const HelpText = styled(Text)(
  (props) => `
  color: ${props.disabled ? props.theme.colors.shade[300] : props.theme.colors.shade[500]};
  font-size: ${props.theme.fonts.size[props.size]};
`,
);

const Checkbox = ({ onClick, checked, disabled, size, title, helpText, testID }) => {
  const [status, setBoxState] = useState(checked);
  const [underlayColor, setUnderlayColor] = useState('');

  const theme = useContext(ThemeContext);

  const onClicked = useCallback(() => {
    const newState = !status;
    setBoxState(newState);
    if (onClick) onClick(newState);
  }, [status, onClick]);

  const onPressIn = () => {
    const newUnderlayColor = status ? theme.colors.primary['300'] : theme.colors.tone['400'];
    setUnderlayColor(newUnderlayColor);
  };

  const onPressOut = () => {
    setUnderlayColor('');
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      accessibilityRole="checkbox"
      onPress={onClicked}
      underlayColor="transparent"
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      testID={testID}
    >
      <CheckboxContainer>
        <RippleView underlayColor={underlayColor} {...mapSizeToRippleViewProps(size)}>
          <CheckBoxIcon checked={status} size={size} disabled={disabled} />
        </RippleView>

        <TextContainer>
          <Title {...mapSizeToTitleTextProps(size)} disabled={disabled}>
            {title}
          </Title>
          {helpText.length > 0 && ['large', 'medium'].indexOf(size) > -1 && (
            <HelpText {...mapSizetoHelpTextProps(size)} disabled={disabled}>
              {helpText}
            </HelpText>
          )}
        </TextContainer>
      </CheckboxContainer>
    </TouchableOpacity>
  );
};

HelpText.propTypes = {
  size: PropTypes.oneOf(['m', 'xs']),
  disabled: PropTypes.bool,
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

Checkbox.defaultProps = {
  onClick: () => {},
  checked: false,
  size: 'large',
  helpText: '',
  disabled: false,
  testID: 'ds-checkbox',
};

export default Checkbox;
