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
    const { result } = renderHook(() => useSnackbar(), {
      wrapper: Wrapper,
    });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({
        title: 'Snackbar text here',
        autoHide: false,
      });
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('close the snackbar', () => {
    const { result } = renderHook(() => useSnackbar(), {
      wrapper: Wrapper,
    });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({
        title: 'Snackbar text here',
        autoHide: false,
      });
    });
    expect(result.current.isVisible).toBe(true);
    act(() => {
      result.current.close();
    });
    expect(result.current.isVisible).toBe(false);
  });

  it('auto-hide the snackbar', () => {
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    const { result } = renderHook(() => useSnackbar(), {
      wrapper: Wrapper,
    });
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.show({
        title: 'Snackbar text here',
        autoHide: true,
      });
    });
    expect(result.current.isVisible).toBe(true);
    act(() => {
      jest.runAllTimers(); // Resolve auto hide timer
    });
    expect(result.current.isVisible).toBe(false);
  });
});
