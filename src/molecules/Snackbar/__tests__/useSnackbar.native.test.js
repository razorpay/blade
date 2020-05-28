import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components/native';
import SnackbarProvider from '../SnackbarProvider';
import theme from '../../../tokens/theme';
import { useSnackbar } from '../SnackbarContext';

const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </ThemeProvider>
);

Wrapper.propTypes = {
  children: PropTypes.node,
};

describe('useSnackbar hook', () => {
  it('show the snackbar', () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper: Wrapper });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({ text: 'Snackbar text here', autoDismiss: false });
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('dismiss the snackbar', () => {
    const { result } = renderHook(() => useSnackbar(), { wrapper: Wrapper });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({ text: 'Snackbar text here', autoDismiss: false });
    });
    expect(result.current.isVisible).toBe(true);
    act(() => {
      result.current.dismiss();
    });
    expect(result.current.isVisible).toBe(false);
  });

  it('auto-dismiss the snackbar', () => {
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    const { result } = renderHook(() => useSnackbar(), { wrapper: Wrapper });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({ text: 'Snackbar text here', autoDismiss: true });
    });
    expect(result.current.isVisible).toBe(true);
    act(() => {
      jest.runAllTimers(); // Resolve auto dismiss timer
    });
    expect(result.current.isVisible).toBe(false);
  });
});
