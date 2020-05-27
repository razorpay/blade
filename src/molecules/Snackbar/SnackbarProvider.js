import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Snackbar from './Snackbar';
import SnackbarContext from './SnackbarContext';

const DEFAULT_DISMISS_DURATION = 3000;

const SnackbarProvider = ({ children }) => {
  const [snackbarProps, setSnackbarProps] = useState({
    variant: undefined,
    text: '',
    actionText: undefined,
    onAction: undefined,
    showDismissButton: undefined,
    onDismiss: undefined,
    maxLines: undefined,
    position: { top: undefined, bottom: 0, left: 0, right: 0 },
  });
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const dismissAfterDuration = useCallback((duration = DEFAULT_DISMISS_DURATION) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // clear existing timer
    }
    timerRef.current = setTimeout(() => setIsVisible(false), duration);
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // clear existing timer
    }
    if (isVisible) {
      setIsVisible(false);
    }
  }, [isVisible]);

  const invokeNewSnackBar = useCallback(
    (config) => {
      setSnackbarProps(config);
      setIsVisible(true);
      if (config.autoDismiss) {
        dismissAfterDuration();
      }
    },
    [dismissAfterDuration],
  );

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
      iconName,
      position = { bottom: 0 },
    }) => {
      if (isVisible) {
        dismiss();
        setTimeout(() => {
          invokeNewSnackBar({
            variant,
            text,
            actionText,
            onAction,
            showDismissButton,
            onDismiss,
            maxLines,
            autoDismiss,
            iconName,
            position,
          });
        }, 200);
      } else {
        invokeNewSnackBar({
          variant,
          text,
          actionText,
          onAction,
          showDismissButton,
          onDismiss,
          maxLines,
          autoDismiss,
          iconName,
          position,
        });
      }
    },
    [invokeNewSnackBar, dismiss, isVisible],
  );

  const snackbarActions = React.useMemo(() => ({ show, dismiss, isVisible }), [
    show,
    dismiss,
    isVisible,
  ]);

  return (
    <SnackbarContext.Provider value={snackbarActions}>
      {children}
      <Snackbar {...snackbarProps} />
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default SnackbarProvider;
