import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Snackbar from './Snackbar';
import SnackbarContext from './SnackbarContext';

const DEFAULT_HIDE_DURATION = 3000;

const SnackbarProvider = ({ children }) => {
  const [snackbarProps, setSnackbarProps] = useState({
    variant: undefined,
    title: '',
    action: {
      label: undefined,
      onClick: undefined,
    },
    onClose: undefined,
    maxLines: undefined,
    position: {
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined,
    },
  });
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const hideAfterMs = useCallback((duration = DEFAULT_HIDE_DURATION) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // clear existing timer
    }
    timerRef.current = setTimeout(() => setIsVisible(false), duration);
  }, []);

  const close = useCallback(() => {
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
      if (config.autoHide) {
        hideAfterMs();
      }
    },
    [hideAfterMs],
  );

  const show = useCallback(
    ({
      variant,
      title,
      action,
      onClose,
      maxLines,
      autoHide = true,
      icon,
      position = {
        bottom: 0,
      },
    }) => {
      if (isVisible) {
        close();
        setTimeout(() => {
          invokeNewSnackBar({
            variant,
            title,
            action,
            onClose,
            maxLines,
            autoHide,
            icon,
            position,
          });
        }, 200);
      } else {
        invokeNewSnackBar({
          variant,
          title,
          action,
          onClose,
          maxLines,
          autoHide,
          icon,
          position,
        });
      }
    },
    [invokeNewSnackBar, close, isVisible],
  );

  const snackbarActions = React.useMemo(
    () => ({
      show,
      close,
      isVisible,
    }),
    [show, close, isVisible],
  );

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
