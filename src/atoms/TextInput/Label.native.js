import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Text from '../Text';
import View from '../View/View.native';
import Space from '../Space';

const styles = {
  container: {
    paddingTop({ inputLayoutDimensions }) {
      // For aligning left label to the center of Text Field
      if (Platform.OS === 'android') {
        return `${inputLayoutDimensions.height * 0.36}px`;
      }
      return `${inputLayoutDimensions.height * 0.29}px`;
    },
  },
  padding() {
    return [0, 3, 0, 0];
  },
};

const LabelContainer = styled(View)`
  padding-top: ${styles.container.paddingTop};
`;

const Label = ({ children, inputLayoutDimensions }) => {
  return (
    <LabelContainer inputLayoutDimensions={inputLayoutDimensions}>
      <Space padding={styles.padding()}>
        <View>
          <Text size="medium" color="shade.980">
            {children}
          </Text>
        </View>
      </Space>
    </LabelContainer>
  );
};

Label.propTypes = {
  children: PropTypes.string,
  inputLayoutDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

Label.defaultProps = {
  children: 'Label',
};

export default Label;
