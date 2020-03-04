import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import RadioButton from './../RadioButton';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Native <RadioButton />', () => {
  describe('Unchecked RadioButton', () => {
    test('should render component when not checked with default props', () => {
      const { container } = renderWithTheme(
        <RadioButton title="Some Title" onChange={() => null} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when not checked with help text props', () => {
      const helpText = 'some Help text';
      const { getByText } = renderWithTheme(
        <RadioButton title="Some Title" helpText={helpText} onChange={() => null} />,
      );
      const helpTextComponent = getByText(helpText);
      expect(helpTextComponent.props.size).toEqual('xsmall');
      expect(helpTextComponent.props.children).toEqual(helpText);
    });

    test('should render component when defaultChecked prop is passed with value false', () => {
      const { container } = renderWithTheme(
        <RadioButton title="Some Title" onChange={() => null} defaultChecked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when checked prop is passed with value false', () => {
      const { container } = renderWithTheme(
        <RadioButton title="Some Title" onChange={() => null} checked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render component when both defaultChecked and checked prop is passed with false values', () => {
      const { container } = renderWithTheme(
        <RadioButton title="Some Title" onChange={() => null} checked={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render medium sized RadioButton', () => {
      const { container, getByText } = renderWithTheme(
        <RadioButton
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
        <RadioButton
          title="Some Title"
          helpText="some Help text"
          size="large"
          disabled={true}
          testID="disabledRadioButton"
          onChange={() => null}
        />,
      );
      const renderedComponent = getByTestId('disabledRadioButton');
      expect(renderedComponent.props.disabled).toEqual(true);
    });

    test('snapshot testing when user long presses on RadioButton', () => {
      const { container, getByTestId } = renderWithTheme(
        <RadioButton title="Razorpay" onChange={() => null} testID="unselectedRadioButton" />,
      );
      const component = getByTestId('unselectedRadioButton');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <RadioButton title="Razorpay" onChange={() => null} testID="unselectedRadioButton" />,
      );
      const component = getByTestId('unselectedRadioButton');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should call onChange method when `checked` prop is passed with false value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedRadioButton"
          checked={false}
        />,
      );

      const component = getByTestId('unselectedRadioButton');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(true);
    });

    test('should call onChange method when `defaultChecked` prop is passed with false value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedRadioButton"
          defaultChecked={false}
        />,
      );

      const component = getByTestId('unselectedRadioButton');

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
        <RadioButton title="Some Title" checked={true} onChange={() => null} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user long presses on RadioButton', () => {
      const { container, getByTestId } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          checked={true}
          onChange={() => null}
          testID="activeRadioButton"
        />,
      );
      const component = getByTestId('activeRadioButton');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          checked={true}
          onChange={() => null}
          testID="activeRadioButton"
        />,
      );
      const component = getByTestId('activeRadioButton');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot when errorText is present', () => {
      const { container, getAllByText } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          checked={true}
          onChange={() => null}
          testID="activeRadioButton"
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
        <RadioButton
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedRadioButton"
          defaultChecked={true}
        />,
      );

      const component = getByTestId('unselectedRadioButton');

      act(() => {
        fireEvent.press(component);
      });

      expect(mockOnChange).toBeCalled();
      expect(mockOnChange).toBeCalledWith(false);
    });

    test('should call onChange method when `checked` prop is passed with true value', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <RadioButton
          title="Razorpay"
          onChange={mockOnChange}
          testID="unselectedRadioButton"
          checked={true}
        />,
      );

      const component = getByTestId('unselectedRadioButton');

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
          <RadioButton
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
