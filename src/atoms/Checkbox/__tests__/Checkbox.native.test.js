import React from 'react';
import Checkbox from './../Checkbox';
import { renderWithTheme } from '../../../_helpers/testing';
import { fireEvent, act } from '@testing-library/react-native';

describe('Native <Checkbox />', () => {
  describe('Unchecked checkxox', () => {
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
        <Checkbox title="Razorpay" onChange={() => null} testID="cbox" />,
      );
      const component = getByTestId('cbox');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" onChange={() => null} testID="cbox" />,
      );
      const component = getByTestId('cbox');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('Checked', () => {
    test('should render component when checked with default props', () => {
      const { container } = renderWithTheme(
        <Checkbox title="Some Title" checked={true} onChange={() => null} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should call unchange function with false when pressed', () => {
      const onChangeMock = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Checkbox title="Some Title" checked={true} onChange={onChangeMock} testID="cbox" />,
      );
      const component = getByTestId('cbox');
      fireEvent.press(component);
      expect(onChangeMock).toBeCalled();
      expect(onChangeMock).toBeCalledWith(false);
    });

    test('snapshot testing when user long presses on checkbox', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" checked={true} onChange={() => null} testID="cbox" />,
      );
      const component = getByTestId('cbox');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <Checkbox title="Razorpay" checked={true} onChange={() => null} testID="cbox" />,
      );
      const component = getByTestId('cbox');

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
          testID="cbox"
          errorText="You dont have permission"
        />,
      );
      const errorComponent = getAllByText('You dont have permission');
      expect(container).toMatchSnapshot();
      expect(errorComponent).toBeTruthy();
    });
  });
});
