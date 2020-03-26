import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import SegmentControl from './../SegmentControl';

describe('<SegmentControl />', () => {
  describe('variant', () => {
    it('renders outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('controlled', () => {
    it('outlined segment control ', () => {
      const mockPress = jest.fn();

      const { container, getByTestId } = renderWithTheme(
        <SegmentControl value="Option 1" variant="outlined" onChange={mockPress}>
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');
      fireEvent.press(option);
      expect(mockPress).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('filled segment control ', () => {
      const mockPress = jest.fn();

      const { container, getByTestId } = renderWithTheme(
        <SegmentControl value="Option 1" variant="filled" onChange={mockPress}>
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');
      fireEvent.press(option);
      expect(mockPress).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('renders small outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders medium outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined" size="medium">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders small filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders medium filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled" size="medium">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('pressIn', () => {
    it('outlined segment control unselected', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');

      act(() => {
        fireEvent.pressIn(option);
      });
      expect(container).toMatchSnapshot();
    });

    it('outlined segment control selected', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-1');

      act(() => {
        fireEvent.pressIn(option);
      });
      expect(container).toMatchSnapshot();
    });

    it('filled segment control unselected', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');

      act(() => {
        fireEvent.pressIn(option);
      });
      expect(container).toMatchSnapshot();
    });
    it('filled segment control selected', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-1');

      act(() => {
        fireEvent.pressIn(option);
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('onPress', () => {
    it('outlined segment control ', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');

      act(() => {
        fireEvent.press(option);
      });
      expect(container).toMatchSnapshot();
    });
    it('filled segment control ', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled" size="small">
          <SegmentControl.Option value="Option 1" testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" testID="segment-option-3" />
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');

      act(() => {
        fireEvent.press(option);
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('disabled', () => {
    it('renders disabled outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="outlined">
          <SegmentControl.Option value="Option 1" disabled testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" disabled testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" disabled testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders disabled filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="Option 1" variant="filled">
          <SegmentControl.Option value="Option 1" disabled testID="segment-option-1" />
          <SegmentControl.Option value="Option 2" disabled testID="segment-option-2" />
          <SegmentControl.Option value="Option 3" disabled testID="segment-option-3" />
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
