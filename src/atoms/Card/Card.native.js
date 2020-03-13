import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import Space from '../Space/Space.native';
import { getColor } from '../../_helpers/theme';

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
  shadowOffset({ variant }) {
    if (variant === 'shadow') {
      return '0px 4px';
    } else {
      return '0px 0px';
    }
  },
  shadowOpacity({ variant }) {
    if (variant === 'shadow') {
      return 1;
    } else {
      return 0;
    }
  },
  shadowRadius({ variant }) {
    if (variant === 'shadow') {
      return '20px';
    } else {
      return 0;
    }
  },
  elevation({ variant }) {
    if (variant === 'shadow') {
      return 2;
    } else {
      return 0;
    }
  },
  border({ variant, theme }) {
    if (variant === 'shadow') {
      return 'none';
    } else {
      return `1px solid ${getColor(theme, 'primary.930')}`;
    }
  },
};

const StyledCard = styled(View)`
  shadow-color: ${styles.shadowColor};
  shadow-offset: ${styles.shadowOffset};
  shadow-opacity: ${styles.shadowOpacity};
  shadow-radius: ${styles.shadowRadius};
  elevation: ${styles.elevation};
  background-color: ${styles.backgroundColor};
  border: ${styles.border};
`;

const Card = ({ children, variant, testID }) => {
  return (
    <Space padding={styles.padding()}>
      <StyledCard {...automation(testID)} variant={variant}>
        {children}
      </StyledCard>
    </Space>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['shadow', 'outline']),
  testID: PropTypes.string,
};

Card.defaultProps = {
  children: undefined,
  variant: 'shadow',
  testID: 'ds-card',
};

export default Card;
