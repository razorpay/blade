import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextInput from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<TextInput />', () => {
  describe('variant', () => {
    it('renders outlined variant with default props', () => {
      const { container } = renderWithTheme(<TextInput variant="outlined" />);
      expect(container).toMatchSnapshot();
    });

    it('renders filled variant with default props', () => {
      const { container } = renderWithTheme(<TextInput variant="filled" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('value', () => {
    it('should have empty string as initial value if no value is provided', () => {
      const { getByTestId } = renderWithTheme(<TextInput testID="ds-text-input" />);
      const textInput = getByTestId('ds-text-input');
      expect(textInput.value).toEqual('');
    });

    it('should have provided value as initial value if some value is provided', () => {
      const providedValue = 'initial value';
      const { getByTestId } = renderWithTheme(
        <TextInput testID="ds-text-input" value={providedValue} />,
      );
      const textInput = getByTestId('ds-text-input');
      expect(textInput.value).toEqual(providedValue);
    });
  });

  describe('label', () => {
    it('renders input with labelPosition on top(default) and variant outlined', () => {
      const { container } = renderWithTheme(
        <TextInput label="Example label" labelPosition="top" variant="outlined" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on top(default) and variant filled', () => {
      const { container } = renderWithTheme(
        <TextInput label="Example label" labelPosition="top" variant="filled" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on left and variant filled', () => {
      const { container } = renderWithTheme(
        <TextInput label="Example label" labelPosition="left" variant="filled" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('placeholder', () => {
    it('renders input with default placeholder if not provided as prop', () => {
      const defaultPlaceholder = 'Enter text here';
      const { container, getByPlaceholderText } = renderWithTheme(<TextInput />);
      const input = getByPlaceholderText(defaultPlaceholder);
      expect(input.placeholder).toEqual(defaultPlaceholder);
      expect(container).toMatchSnapshot();
    });

    it('renders input with provided placeholder', () => {
      const placeholder = 'Example Placeholder';
      const { container, getByPlaceholderText } = renderWithTheme(
        <TextInput placeholder={placeholder} />,
      );
      const input = getByPlaceholderText(placeholder);
      expect(input.placeholder).toEqual(placeholder);
      expect(container).toMatchSnapshot();
    });
  });

  describe('width', () => {
    it('renders input with medium(default) width', () => {
      const { container } = renderWithTheme(<TextInput width="medium" />);
      expect(container).toMatchSnapshot();
    });

    it('renders input with small width', () => {
      const { container } = renderWithTheme(<TextInput width="small" />);
      expect(container).toMatchSnapshot();
    });

    it('renders input with auto width', () => {
      const { container } = renderWithTheme(<TextInput width="auto" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    describe('with type text', () => {
      it('should update input value with user input and call handleChange', () => {
        const handleChange = jest.fn();
        const { getByTestId } = renderWithTheme(
          <TextInput testID="ds-text-input" type="text" onChange={handleChange} />,
        );
        const textInput = getByTestId('ds-text-input');
        const userInput = 'some text entered by user';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });
    });

    describe('with type number', () => {
      it('should update input value with user input and call change handler for valid numerical value ', () => {
        const handleChange = jest.fn();
        const { getByTestId } = renderWithTheme(
          <TextInput testID="ds-text-input" type="number" onChange={handleChange} />,
        );
        const textInput = getByTestId('ds-text-input');
        const userInput = '1';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });

      it('should not update input value with user input and not call change handler for invalid numerical value', () => {
        const handleChange = jest.fn();
        const { getByTestId } = renderWithTheme(
          <TextInput testID="ds-text-input" type="number" onChange={handleChange} />,
        );
        const textInput = getByTestId('ds-text-input');
        const userInput = 'a';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).not.toHaveBeenCalled();
        expect(textInput.value).toEqual('');
      });
    });
  });

  describe('onBlur', () => {
    it('should call blur handler on blur', () => {
      const handleBlur = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TextInput testID="ds-text-input" onBlur={handleBlur} />,
      );
      const textInput = getByTestId('ds-text-input');
      fireEvent.blur(textInput);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('renders a disabled input', () => {
      const { container } = renderWithTheme(<TextInput disabled={true} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('error', () => {
    it('should throw error when labelPosition === left & variant === outlined', () => {
      const errorMessage = 'Cannot have a left label on an outlined Text Input';
      expect(() => renderWithTheme(<TextInput labelPosition="left" />)).toThrow(errorMessage);
    });

    it('should throw error when both prefix and iconLeft are passed together', () => {
      const errorMessage = 'Cannot have prefix and left icon together';
      expect(() => renderWithTheme(<TextInput iconLeft="info" prefix="₹" />)).toThrow(errorMessage);
    });

    it('should throw error when both suffix and iconRight are passed together', () => {
      const errorMessage = 'Cannot have suffix and right icon together';
      expect(() => renderWithTheme(<TextInput iconRight="info" suffix="₹" />)).toThrow(
        errorMessage,
      );
    });
  });
});
