import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import View from '../View';
import Size from '../Size';
import { getColor, makePxValue } from '../../_helpers/theme';

const styles = {
  backgroundColor({ variant, fill, theme }) {
    if (fill === 'empty') {
      return 'transparent';
    }
    switch (variant) {
      case 'positive':
        return getColor(theme, 'positive.900');
      case 'negative':
        return getColor(theme, 'negative.900');
      case 'warning':
        return getColor(theme, 'neutral.900');
      case 'neutral':
        return getColor(theme, 'primary.900');
      default:
        return getColor(theme, 'primary.900');
    }
  },
  border({ variant, fill, theme }) {
    if (fill === 'solid') {
      return '0px';
    }

    switch (variant) {
      case 'positive':
        return `1px solid ${getColor(theme, 'positive.900')}`;
      case 'negative':
        return `1px solid ${getColor(theme, 'negative.900')}`;
      case 'warning':
        return `1px solid ${getColor(theme, 'neutral.900')}`;
      case 'neutral':
        return `1px solid ${getColor(theme, 'primary.900')}`;
      default:
        return `1px solid ${getColor(theme, 'primary.900')}`;
    }
  },
};

const StyledIndicator = styled(View)`
  background-color: ${styles.backgroundColor};
  border: ${styles.border};
  border-radius: ${makePxValue(0.375)};
`;

const Indicator = ({ variant, fill }) => (
  <Size height={makePxValue(0.75)} width={makePxValue(0.75)}>
    <StyledIndicator variant={variant} fill={fill} />
  </Size>
);

Indicator.propTypes = {
  variant: PropTypes.oneOf(['positive', 'negative', 'warning', 'neutral']),
  fill: PropTypes.oneOf(['solid', 'empty']),
};

Indicator.defaultProps = {
  variant: 'neutral',
  fill: 'solid',
};

export default Indicator;
