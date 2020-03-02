import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import Checkbox from './../Checkbox';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Native <Checkbox />', () => {
  describe('Unchecked checkbox', () => {
    test('should render component when not checked with default props', () => {
      const { container } = renderWithTheme(<Checkbox title="Some Title" onChange={() => null} />);
      expect(container).toMatchSnapshot();
    });

    test('should render component when not checked with help text props', () => {
      const helpText = 'some Help text';
      const { getByText } = renderWithTheme(
        <Checkbox title="Some Title" helpText={helpText} onChange={() => null} />,
      );
      const helpTextComponent = getByText(helpText);
      expect(helpTextComponent.props.size).toEqual('xsmall');
      expect(helpTextComponent.props.children).toEqual(helpText);
    });

    test('should render component when defaultChecked prop is passed with value false', () => {
      const { container } = renderWithTheme(
        <Checkbox title="Some Title" onChange={() => null} defaultChecked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when checked prop is passed with value false', () => {
      const { container } = renderWithTheme(
        <Checkbox title="Some Title" onChange={() => null} checked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when both defaultChecked and checked prop is passed with false values', () => {
      const { container } = renderWithTheme(
        <Checkbox title="Some Title" onChange={() => null} checked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render medium sized Checkbox', () => {
      const { container, getByText } = renderWithTheme(
        <Checkbox
          title="Some Title"
          helpText="some Help text"
          size="medium"
          onChange={() => null}
        />,
      );
      const component = getByText('Some Title');
      expect(container).toMatchSnapshot();
      expect(component.props.size).toEqual('medium');
    });

    test('should render component in disabled state', () => {
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Some Title"
          helpText="some Help text"
          size="large"
          disabled={true}
          testID="disabledCheckBox"
          onChange={() => null}
        />,
      );
      const renderedComponent = getByTestId('disabledCheckBox');
      expect(renderedComponent.props.disabled).toEqual(true);
    });

    test('snapshot testing when user long presses on checkbox', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" onChange={() => null} testID="unselectedCheckBox" />,
      );
      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" onChange={() => null} testID="unselectedCheckBox" />,
      );
      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should call onChange method when `checked` prop is passed with false value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedCheckBox"
          checked={false}
        />,
      );

      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(true);
    });

    test('should call onChange method when `defaultChecked` prop is passed with false value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedCheckBox"
          defaultChecked={false}
        />,
      );

      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(true);
    });
  });

  describe('Checked', () => {
    test('should render component when checked with default props', () => {
      const { container } = renderWithTheme(
        <Checkbox title="Some Title" checked={true} onChange={() => null} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user long presses on checkbox', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" checked={true} onChange={() => null} testID="activeCheckbox" />,
      );
      const component = getByTestId('activeCheckbox');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" checked={true} onChange={() => null} testID="activeCheckbox" />,
      );
      const component = getByTestId('activeCheckbox');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot when errorText is present', () => {
      const { container, getAllByText } = renderWithTheme(
        <Checkbox
          title="Razorpay"
          checked={true}
          onChange={() => null}
          testID="activeCheckbox"
          errorText="You dont have permission"
        />,
      );
      const errorComponent = getAllByText('You dont have permission');
      expect(container).toMatchSnapshot();
      expect(errorComponent).toBeTruthy();
    });

    test('should call onChange method when `defaultChecked` prop is passed with true value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedCheckBox"
          defaultChecked={true}
        />,
      );

      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(false);
    });

    test('should call onChange method when `checked` prop is passed with true value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Checkbox
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedCheckBox"
          checked={true}
        />,
      );

      const component = getByTestId('unselectedCheckBox');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(false);
    });
  });

  describe('defaultChecked and Checked', () => {
    test('should throw an error when both defaultChecked and checked are passed as prop', () => {
      const errorMessage = 'One of defaultChecked or checked should be supplied.';
      expect(() =>
        renderWithTheme(
          <Checkbox
            title="Some Title"
            defaultChecked={true}
            checked={false}
            onChange={() => null}
          />,
        ),
      ).toThrow(errorMessage);
    });
  });
});
