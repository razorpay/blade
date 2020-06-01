import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import Snackbar from '../index';
import { renderWithTheme } from '../../../_helpers/testing';
import { useSnackbar } from '../SnackbarContext';

jest.mock('../SnackbarContext');

describe('<Snackbar />', () => {
  useSnackbar.mockReturnValue({
    close: jest.fn(),
    isVisible: true,
  });
  describe('variant', () => {
    it('default', () => {
      const { container } = renderWithTheme(<Snackbar title="Hello world" />);
      expect(container).toMatchSnapshot();
    });
    it('positive', () => {
      const { container } = renderWithTheme(<Snackbar title="Hello world" variant="positive" />);
      expect(container).toMatchSnapshot();
    });
    it('negative', () => {
      const { container } = renderWithTheme(<Snackbar title="Hello world" variant="negative" />);
      expect(container).toMatchSnapshot();
    });
    it('warning', () => {
      const { container } = renderWithTheme(<Snackbar title="Hello world" variant="warning" />);
      expect(container).toMatchSnapshot();
    });
    it('neutral', () => {
      const { container } = renderWithTheme(<Snackbar title="Hello world" variant="neutral" />);
      expect(container).toMatchSnapshot();
    });
  });
  describe('action', () => {
    it('label', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Hello world" action={{ label: 'Retry' }} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('onClick', () => {
      const onAction = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Snackbar title="Hello world" action={{ label: 'Retry', onClick: onAction }} />,
      );
      const actionButton = getByTestId('ds-snackbar-action-button');

      act(() => {
        fireEvent.press(actionButton);
      });

      expect(onAction).toBeCalled();
    });
  });

  describe('close button', () => {
    it('showCloseButton', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Hello world" showCloseButton={true} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('onClose', () => {
      const onClose = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Snackbar title="Hello world" showCloseButton={true} onClose={onClose} />,
      );
      const closeButton = getByTestId('ds-snackbar-close-button');

      act(() => {
        fireEvent.press(closeButton);
      });

      expect(onClose).toBeCalled();
    });
  });
  describe('maxLines', () => {
    it('renders multiple lines', () => {
      const { container } = renderWithTheme(
        <Snackbar
          title="The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog  The quick brown fox jumps over the lazy dog"
          showCloseButton={true}
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders 1 line', () => {
      const { container } = renderWithTheme(
        <Snackbar
          title="The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog  The quick brown fox jumps over the lazy dog"
          showCloseButton={true}
          maxLines={1}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('icon', () => {
    it('renders with an icon', () => {
      const { container } = renderWithTheme(<Snackbar title="Snackbar text here" icon="info" />);
      expect(container).toMatchSnapshot();
    });
  });
  describe('position', () => {
    it('change top position', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Snackbar text here" position={{ top: 4 }} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('change bottom position', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Snackbar text here" position={{ bottom: 4 }} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('change left position', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Snackbar text here" position={{ left: 2 }} />,
      );
      expect(container).toMatchSnapshot();
    });
    it('change right position', () => {
      const { container } = renderWithTheme(
        <Snackbar title="Snackbar text here" position={{ right: 2 }} />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
