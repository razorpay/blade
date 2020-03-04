import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import Size from '../Size';
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

const Card = ({ testID, children, height, width, minHeight, maxHeight, minWidth, maxWidth }) => {
  return (
    <Space padding={styles.padding()}>
      <Size
        height={height}
        width={width}
        minHeight={minHeight}
        maxHeight={maxHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
      >
        <StyledCard {...automation(testID)}>{children}</StyledCard>
      </Size>
    </Space>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
  minHeight: PropTypes.string,
  maxHeight: PropTypes.string,
  testID: PropTypes.string,
};

Card.defaultProps = {
  testID: 'ds-card',
  children: undefined,
  width: undefined,
  height: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  minHeight: undefined,
  maxHeight: undefined,
};

export default Card;
