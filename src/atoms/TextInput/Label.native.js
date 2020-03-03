import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Text from '../Text';
import View from '../View';
import Space from '../Space';

const IS_ANDROID = Platform.OS === 'android';

const PADDING_TOP_MULTIPLIER_ANDROID = 0.36;
const PADDING_TOP_MULTIPLIER_IOS = 0.29;

const styles = {
  container: {
    paddingTop({ inputLayoutDimensions }) {
      // For aligning left label to the center of Text Field
      if (IS_ANDROID) {
        return `${inputLayoutDimensions.height * PADDING_TOP_MULTIPLIER_ANDROID}px`;
      }
      return `${inputLayoutDimensions.height * PADDING_TOP_MULTIPLIER_IOS}px`;
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
