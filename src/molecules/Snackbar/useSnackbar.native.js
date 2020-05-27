import React from 'react';
import SnackbarContext from './SnackbarContext';

const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);

  if (context === undefined) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return context;
};

export default useSnackbar;
