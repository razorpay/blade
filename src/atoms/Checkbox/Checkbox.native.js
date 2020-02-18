import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import CheckBoxIcon from './CheckboxIcon';

// const Button = styled.TouchableHighlight``;

const CheckboxContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

// const IconContainer = styled.View`
//   margin: 4px 0px;
// `;

const TextContainer = styled.View`
  margin-left: 4px;
`;

const Title = styled(Text)(
  (props) => `
  color: ${props.disabled ? props.theme.colors.shade[500] : props.theme.colors.shade[700]};
  font-size: ${props.theme.fonts.size[props.size]};
`,
);

const mapSizeToTitleTextProps = (checkboxSize) => {
  switch (checkboxSize) {
    case 'l':
      return { size: 'l' };
    case 'm':
      return { size: 'm' };
    case 's':
      return { size: 'xs' };
    default:
      return { size: 's' };
  }
};

const mapSizetoHelpTextProps = (checkboxSize) => {
  switch (checkboxSize) {
    case 'l':
      return { size: 'm' };
    case 'm':
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

const Checkbox = ({ onClick, checked, disabled, size, title, helpText }) => {
  const [c, setBoxState] = useState(checked);

  const onClicked = () => {
    setBoxState(!c);
    if (onClick) onClick(c);
  };
  return (
    <TouchableHighlight
      accessibilityRole="checkbox"
      onPress={onClicked}
      underlayColor="transparent"
      disabled={disabled}
    >
      <CheckboxContainer>
        <CheckBoxIcon checked={c} size={size} disabled={disabled} />
        {title.length > 0 && (
          <TextContainer>
            <Title {...mapSizeToTitleTextProps(size)} disabled={disabled}>
              {title}
            </Title>
            {helpText.length && ['l', 'm'].indexOf(size) > -1 && (
              <HelpText {...mapSizetoHelpTextProps(size)} disabled={disabled}>
                {helpText}
              </HelpText>
            )}
          </TextContainer>
        )}
      </CheckboxContainer>
    </TouchableHighlight>
  );
};

HelpText.propTypes = {
  size: PropTypes.oneOf(['m', 'xs']),
  disabled: PropTypes.bool,
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['l', 'm', 's']),
  title: PropTypes.string,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  // testID: PropTypes.string,
};

Checkbox.defaultProps = {
  onClick: () => {},
  checked: false,
  size: 'm',
  title: '',
  helpText: '',
  disabled: false,
  // testID: 'checkbox',
};

export default Checkbox;
