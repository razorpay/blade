import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import Space from '../Space/Space.native';

const styles = {
  padding() {
    return [1.5, 1.5, 1.5, 1.5];
  },
  backgroundColor({ theme }) {
    return theme.colors.background[200];
  },
  shadowColor({ theme }) {
    return theme.colors.primary[920];
  },
};

const StyledCard = styled(View)`
  shadow-color: ${styles.shadowColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 20px;
  elevation: 20;
  background-color: ${styles.backgroundColor};
`;

const Card = ({ children, testID }) => {
  return (
    <Space padding={styles.padding()}>
      <StyledCard {...automation(testID)}>{children}</StyledCard>
    </Space>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  testID: PropTypes.string,
};

Card.defaultProps = {
  children: undefined,
  testID: 'ds-card',
};

export default Card;
