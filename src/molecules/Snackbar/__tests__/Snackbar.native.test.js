import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import Snackbar from '../index';
import { renderWithTheme } from '../../../_helpers/testing';
import useSnackbar from '../useSnackbar';

jest.mock('../useSnackbar');

describe('<Snackbar />', () => {
  useSnackbar.mockReturnValue({
    dismiss: jest.fn(),
    isVisible: true,
  });
  describe('variant', () => {
    it('default', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" />);
      expect(container).toMatchSnapshot();
    });
    it('positive', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" variant="positive" />);
      expect(container).toMatchSnapshot();
    });
    it('negative', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" variant="negative" />);
      expect(container).toMatchSnapshot();
    });
    it('warning', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" variant="warning" />);
      expect(container).toMatchSnapshot();
    });
    it('neutral', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" variant="neutral" />);
      expect(container).toMatchSnapshot();
    });
  });
  describe('action', () => {
    it('actionText', () => {
      const { container } = renderWithTheme(<Snackbar text="Hello world" actionText="Retry" />);
      expect(container).toMatchSnapshot();
    });
    it('onAction', () => {
      const onAction = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Snackbar text="Hello world" actionText="Retry" onAction={onAction} />,
      );
      const actionButton = getByTestId('ds-snackbar-action-button');

      act(() => {
        fireEvent.press(actionButton);
      });

      expect(onAction).toBeCalled();
    });
  });

  describe('dismiss button', () => {
    it('showDismissButton', () => {
      const { container } = renderWithTheme(
        <Snackbar text="Hello world" showDismissButton={true} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('onDismiss', () => {
      const onDismiss = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Snackbar text="Hello world" showDismissButton={true} onDismiss={onDismiss} />,
      );
      const dismissButton = getByTestId('ds-snackbar-dismiss-button');

      act(() => {
        fireEvent.press(dismissButton);
      });

      expect(onDismiss).toBeCalled();
    });
  });
  describe('maxLines', () => {
    it('renders multiple lines', () => {
      const { container } = renderWithTheme(
        <Snackbar
          text="The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog  The quick brown fox jumps over the lazy dog"
          showDismissButton={true}
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders 1 line', () => {
      const { container } = renderWithTheme(
        <Snackbar
          text="The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog  The quick brown fox jumps over the lazy dog"
          showDismissButton={true}
          maxLines={1}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
