import React from 'react';
import PropTypes from 'prop-types';
import Position from '../../atoms/Position';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';

const Footer = ({ children }) => {
  return children ? (
    <Position position="absolute" bottom={0} left={0} right={0}>
      <View>
        <Divider color="shade.920" horizontal />
        {children}
      </View>
    </Position>
  ) : null;
};

Footer.propTypes = {
  children: PropTypes.node,
};

export default Footer;
