import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';

const FooterContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
`;

const Footer = ({ children }) => {
  return children ? (
    <FooterContainer>
      <Divider color="shade.920" horizontal />
      {children}
    </FooterContainer>
  ) : null;
};

Footer.propTypes = {
  children: PropTypes.node,
};

export default Footer;
