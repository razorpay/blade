import React, { useState, useCallback, useRef } from 'react';
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
    position: { top: undefined, bottom: 0, left: 0, right: 0 },
  });
  const [isVisible, setIsVisible] = useState(false);
  let { current: timerRef } = useRef(null);
  const dismissAfterDuration = (duration = DEFAULT_DISMISS_DURATION) => {
    if (timerRef) {
      clearTimeout(timerRef); // clear existing timer
    }
    timerRef = setTimeout(() => setIsVisible(false), duration);
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
      iconName,
      position = { bottom: 0 },
    }) => {
      setSnackbarProps({
        variant,
        text,
        actionText,
        onAction,
        showDismissButton,
        onDismiss,
        maxLines,
        iconName,
        position,
      });
      setIsVisible(true);
      if (autoDismiss) {
        dismissAfterDuration();
      }
    },
    [],
  );

  const dismiss = useCallback(() => {
    clearTimeout(timerRef);

    if (isVisible) {
      setIsVisible(false);
    }
  }, [isVisible]);

  const snackbarActions = React.useMemo(() => ({ show, dismiss }), [show, dismiss]);

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
