import React from 'react';

const SnackbarContext = React.createContext();

const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);

  if (context === undefined) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return context;
};

export { useSnackbar };

export default SnackbarContext;
