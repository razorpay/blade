import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import automation from '../../_helpers/automation-attributes';
import View from '../View';
import Space from '../Space/Space.native';
import { getColor, getColorKeys } from '../../_helpers/theme';

const styles = {
  backgroundColor({ theme, backgroundColor }) {
    return getColor(theme, backgroundColor);
  },
  shadowColor({ theme }) {
    return theme.bladeOld.colors.primary[920];
  },
  shadowOffset({ variant }) {
    if (variant === 'shadowed') {
      return '0px 4px';
    } else {
      return '0px 0px';
    }
  },
  shadowOpacity({ variant }) {
    if (variant === 'shadowed') {
      return 1;
    } else {
      return 0;
    }
  },
  shadowRadius({ variant }) {
    if (variant === 'shadowed') {
      return '20px';
    } else {
      return 0;
    }
  },
  elevation({ variant }) {
    if (variant === 'shadowed') {
      return 2;
    } else {
      return 0;
    }
  },
  border({ variant, theme, borderColor }) {
    if (variant === 'shadowed') {
      return 'none';
    } else {
      return `1px solid ${getColor(theme, borderColor)}`;
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
  border-radius: 2px;
`;

const Card = ({ children, variant, backgroundColor, borderColor, testID }) => {
  return (
    <Space padding={[1.5, 1.5, 1.5, 1.5]}>
      <StyledCard
        variant={variant}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        {...automation(testID)}
      >
        {children}
      </StyledCard>
    </Space>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['shadowed', 'outlined']),
  testID: PropTypes.string,
  backgroundColor: PropTypes.oneOf(getColorKeys()),
  borderColor: PropTypes.oneOf(getColorKeys()),
};

Card.defaultProps = {
  variant: 'shadowed',
  testID: 'ds-card',
  backgroundColor: 'background.200',
  borderColor: 'primary.930',
};

export default Card;
