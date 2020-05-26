import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Snackbar from './Snackbar';
import SnackbarContext from './SnackbarContext';

const DEFAULT_DISMISS_DURATION = 2500;

const SnackbarProvider = ({ children }) => {
  const [snackbarProps, setSnackbarProps] = useState({
    variant: undefined,
    text: '',
    actionText: undefined,
    onAction: undefined,
    showDismissButton: undefined,
    onDismiss: undefined,
    maxLines: undefined,
  });
  const [isVisible, setIsVisible] = useState(false);

  const dismissAfterDuration = (duration = DEFAULT_DISMISS_DURATION) => {
    setTimeout(() => setIsVisible(false), duration);
  };
  const show = useCallback(
    ({
      variant,
      text,
      actionText,
      onAction,
      showDismissButton,
      onDismiss,
      maxLines,
      autoDismiss = true,
    }) => {
      setSnackbarProps({
        variant,
        text,
        actionText,
        onAction,
        showDismissButton,
        onDismiss,
        maxLines,
      });
      setIsVisible(true);
      if (autoDismiss) {
        dismissAfterDuration();
      }
    },
    [],
  );

  const dismiss = () => {
    setSnackbarProps({});
    setIsVisible(false);
  };

  const snackbarActions = React.useMemo(() => ({ show, dismiss }), [show]);

  return (
    <SnackbarContext.Provider value={snackbarActions}>
      {children}
      <Snackbar {...snackbarProps} visible={isVisible} dismiss={dismiss} />
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default SnackbarProvider;
