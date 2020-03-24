import PropTypes from 'prop-types';
import styled from 'styled-components';

const View = styled.div``;

View.propTypes = {
  as: PropTypes.oneOf(['div', 'p', 'span']),
  children: PropTypes.node,
};

View.defaultProps = {
  as: 'div',
  children: undefined,
};

export default View;
