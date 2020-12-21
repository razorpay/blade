import PropTypes, { any } from 'prop-types';
import styled from 'styled-components';

const View = styled.div<any>``;

View.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node,
};

View.defaultProps = {
  as: 'div',
};

export default View;
