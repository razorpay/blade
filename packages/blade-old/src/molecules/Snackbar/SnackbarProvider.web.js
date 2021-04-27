import React from 'react';
import PropTypes from 'prop-types';
import SnackbarContext from './SnackbarContext';

const SnackbarProvider = ({ children }) => {
  return <SnackbarContext.Provider value={null}>{children}</SnackbarContext.Provider>;
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default SnackbarProvider;
