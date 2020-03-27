import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import SegmentControl from './../SegmentControl';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<SegmentControl />', () => {
  describe('variant', () => {
    it('renders outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('controlled', () => {
    it('outlined segment control ', () => {
      const mockPress = jest.fn();

      const { container, getByTestId } = renderWithTheme(
        <SegmentControl value="1" variant="outlined" onChange={mockPress}>
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');
      fireEvent.press(option);
      expect(mockPress).toBeCalledWith('2');
      expect(container).toMatchSnapshot();
    });

    it('filled segment control ', () => {
      const mockPress = jest.fn();

      const { container, getByTestId } = renderWithTheme(
        <SegmentControl value="1" variant="filled" onChange={mockPress}>
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      const option = getByTestId('segment-option-2');
      fireEvent.press(option);
      expect(mockPress).toBeCalledWith('2');
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('renders small outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders medium outlined segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders small filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders medium filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('pressIn', () => {
    it('outlined segment control unselected', () => {
      const { container, getByTestId } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="outlined" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="filled" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="filled" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="outlined" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="filled" size="small">
          <SegmentControl.Option value="1" testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
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
        <SegmentControl defaultValue="1" variant="outlined">
          <SegmentControl.Option value="1" disabled testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" disabled testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" disabled testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders disabled filled segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled">
          <SegmentControl.Option value="1" disabled testID="segment-option-1">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" disabled testID="segment-option-2">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" disabled testID="segment-option-3">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('subText', () => {
    it('renders subText for outlined & medium segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1" subText="Some sub text">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2" subText="Some sub text">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3" subText="Some sub text">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders subText for filled & medium segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1" subText="Some sub text">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2" subText="Some sub text">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3" subText="Some sub text">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('throws error for subText with small size filled variant', () => {
      const errorMessage = `SegmentControl\n \`subText\` cannot be used with \`size='small'\``;
      expect(() =>
        renderWithTheme(
          <SegmentControl defaultValue="1" variant="filled" size="small">
            <SegmentControl.Option value="1" testID="segment-option-1" subText="Some sub text">
              Option 1
            </SegmentControl.Option>
            <SegmentControl.Option value="2" testID="segment-option-2" subText="Some sub text">
              Option 2
            </SegmentControl.Option>
            <SegmentControl.Option value="3" testID="segment-option-3" subText="Some sub text">
              Option 3
            </SegmentControl.Option>
          </SegmentControl>,
        ),
      ).toThrow(errorMessage);
    });

    it('throws error for subText with small size outlined variant', () => {
      const errorMessage = `SegmentControl\n \`subText\` cannot be used with \`size='small'\``;
      expect(() =>
        renderWithTheme(
          <SegmentControl defaultValue="1" variant="outlined" size="small">
            <SegmentControl.Option value="1" testID="segment-option-1" subText="Some sub text">
              Option 1
            </SegmentControl.Option>
            <SegmentControl.Option value="2" testID="segment-option-2" subText="Some sub text">
              Option 2
            </SegmentControl.Option>
            <SegmentControl.Option value="3" testID="segment-option-3" subText="Some sub text">
              Option 3
            </SegmentControl.Option>
          </SegmentControl>,
        ),
      ).toThrow(errorMessage);
    });
  });

  describe('icon', () => {
    it('renders icon for outlined & medium segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="outlined" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1" icon="info">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2" icon="info">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3" icon="info">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders icon for filled & medium segment control ', () => {
      const { container } = renderWithTheme(
        <SegmentControl defaultValue="1" variant="filled" size="medium">
          <SegmentControl.Option value="1" testID="segment-option-1" icon="info">
            Option 1
          </SegmentControl.Option>
          <SegmentControl.Option value="2" testID="segment-option-2" icon="info">
            Option 2
          </SegmentControl.Option>
          <SegmentControl.Option value="3" testID="segment-option-3" icon="info">
            Option 3
          </SegmentControl.Option>
        </SegmentControl>,
      );
      expect(container).toMatchSnapshot();
    });

    it('throws error for icon with small size filled variant', () => {
      const errorMessage = `SegmentControl\n \`icon\` cannot be used with \`size='small'\``;
      expect(() =>
        renderWithTheme(
          <SegmentControl defaultValue="1" variant="filled" size="small">
            <SegmentControl.Option value="1" testID="segment-option-1" icon="info">
              Option 1
            </SegmentControl.Option>
            <SegmentControl.Option value="2" testID="segment-option-2" icon="info">
              Option 2
            </SegmentControl.Option>
            <SegmentControl.Option value="3" testID="segment-option-3" icon="info">
              Option 3
            </SegmentControl.Option>
          </SegmentControl>,
        ),
      ).toThrow(errorMessage);
    });

    it('throws error for icon with small size outlined variant', () => {
      const errorMessage = `SegmentControl\n \`icon\` cannot be used with \`size='small'\``;
      expect(() =>
        renderWithTheme(
          <SegmentControl defaultValue="1" variant="outlined" size="small">
            <SegmentControl.Option value="1" testID="segment-option-1" icon="info">
              Option 1
            </SegmentControl.Option>
            <SegmentControl.Option value="2" testID="segment-option-2" icon="info">
              Option 2
            </SegmentControl.Option>
            <SegmentControl.Option value="3" testID="segment-option-3" icon="info">
              Option 3
            </SegmentControl.Option>
          </SegmentControl>,
        ),
      ).toThrow(errorMessage);
    });
  });
});
