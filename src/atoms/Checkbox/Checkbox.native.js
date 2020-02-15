import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import CheckBoxIcon from './CheckboxIcon';

const Button = styled.TouchableHighlight`
  margin: 5px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
`;

const CheckboxContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin: 5px;
`;

const TextContainer = styled.View``;

const HelpText = styled.Text`
  font-size: 10px;
`;

const Title = styled.Text``;

const Checkbox = ({ onClick, checked, disabled }) => {
  const [c, setBoxState] = useState(checked);

  const onClicked = () => {
    setBoxState(!c);
    if (onClick) onClick(c);
  };

  return (
    <Button
      accessibilityRole="checkbox"
      onPress={onClicked}
      underlayColor="transparent"
      disabled={disabled}
    >
      <CheckboxContainer>
        <IconContainer>
          <CheckBoxIcon checked={c} />
        </IconContainer>
        <TextContainer>
          <Title>Status :${c.toString()}</Title>
          <HelpText>Shridhar:${c.toString()}</HelpText>
        </TextContainer>
      </CheckboxContainer>
    </Button>
  );
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  // size: PropTypes.oneOf(['l', 'm', 's']),
  // title: PropTypes.string,
  // helpText: PropTypes.string,
  disabled: PropTypes.bool,
  // testID: PropTypes.string,
};

Checkbox.defaultProps = {
  onClick: () => {},
  checked: false,
  // size: 'm',
  // title: 'Title for checkbox goes here',
  // helpText: '',
  disabled: false,
  // testID: 'checkbox',
};

export default Checkbox;
