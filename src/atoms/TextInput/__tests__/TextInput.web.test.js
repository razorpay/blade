import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextInput from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const SAMPLE_ID = 'sample-id';
const SAMPLE_LABEL = 'Sample Label';

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

  describe('id', () => {
    it('should not have id attribute if not provded as prop', () => {
      const { getByTestId } = renderWithTheme(<TextInput label={SAMPLE_LABEL} />);
      const textInput = getByTestId('ds-text-input');
      expect(textInput).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provded as prop', () => {
      const { getByTestId } = renderWithTheme(<TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textInput = getByTestId('ds-text-input');
      expect(textInput).toHaveAttribute('id');
      expect(textInput.id).toEqual(SAMPLE_ID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provded as prop', () => {
      const { getByLabelText } = renderWithTheme(<TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textInput = getByLabelText(SAMPLE_LABEL);
      expect(textInput).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provded as prop', () => {
      const name = 'sample-name';
      const { getByLabelText } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} name={name} />,
      );
      const textInput = getByLabelText(SAMPLE_LABEL);
      expect(textInput).toHaveAttribute('name');
      expect(textInput.name).toEqual(name);
    });
  });

  describe('label', () => {
    it('renders input with labelPosition on top(default) and variant outlined(default)', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" />,
      );
      const textInput = queryByLabelText(SAMPLE_LABEL);
      expect(textInput).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on top(default) and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" variant="filled" />,
      );
      const textInput = queryByLabelText(SAMPLE_LABEL);
      expect(textInput).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on left and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="left" variant="filled" />,
      );
      const textInput = queryByLabelText(SAMPLE_LABEL);
      expect(textInput).not.toBeNull();
      expect(container).toMatchSnapshot();
    });
  });

  describe('placeholder', () => {
    it('should have default placeholder if placeholder is not passed as prop', () => {
      const defaultPlaceholder = 'Enter text here';
      const { getByPlaceholderText } = renderWithTheme(<TextInput />);
      const input = getByPlaceholderText(defaultPlaceholder);
      expect(input.placeholder).toEqual(defaultPlaceholder);
    });

    it('should update placeholder if placeholder is passed as prop', () => {
      const placeholder = 'Example Placeholder';
      const { getByPlaceholderText } = renderWithTheme(<TextInput placeholder={placeholder} />);
      const input = getByPlaceholderText(placeholder);
      expect(input.placeholder).toEqual(placeholder);
    });
  });

  describe('value', () => {
    it('should have empty string as initial value if no value is provided as prop', () => {
      const { getByLabelText } = renderWithTheme(<TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textInput = getByLabelText(SAMPLE_LABEL);
      expect(textInput.value).toEqual('');
    });

    it('should have provided value as initial value if some value is provided as prop', () => {
      const providedValue = 'initial value';
      const { getByLabelText } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} value={providedValue} />,
      );
      const textInput = getByLabelText(SAMPLE_LABEL);
      expect(textInput.value).toEqual(providedValue);
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

  describe('focus', () => {
    it('should have focus when input is focused', () => {
      const { getByLabelText } = renderWithTheme(<TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textInput = getByLabelText(SAMPLE_LABEL);
      textInput.focus();
      expect(textInput).toHaveFocus();
    });

    it('should not have focus after input blur', () => {
      const { getByLabelText } = renderWithTheme(<TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textInput = getByLabelText(SAMPLE_LABEL);

      // should have focus initially
      textInput.focus();
      expect(textInput).toHaveFocus();

      // should not have focus after blur is called
      textInput.blur();
      expect(textInput).not.toHaveFocus();
    });
  });

  describe('disabled', () => {
    it('renders a disabled input', () => {
      const { getByLabelText } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} disabled={true} />,
      );
      const textInput = getByLabelText(SAMPLE_LABEL);
      expect(textInput).toBeDisabled();
    });
  });

  describe('helpText', () => {
    it('should render TextInput with help text if helpText is provided as prop', () => {
      const { container } = renderWithTheme(<TextInput helpText="This is help text" />);
      expect(container).toHaveTextContent('This is help text');
      expect(container).toMatchSnapshot();
    });

    describe('with maxLength', () => {
      it('should render TextInput with character count as fraction', () => {
        const { container } = renderWithTheme(
          <TextInput helpText="This is help text" maxLength={10} />,
        );
        expect(container).toHaveTextContent('This is help text');
        expect(container).toHaveTextContent('0/10');
        expect(container).toMatchSnapshot();
      });

      it('should display updated character count when user inputs text', () => {
        const { getByLabelText, container } = renderWithTheme(
          <TextInput
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            helpText="This is help text"
            maxLength={10}
          />,
        );

        // check initial character count = 0/10
        expect(container).toHaveTextContent('This is help text');
        expect(container).toHaveTextContent('0/10');

        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = 'Ten Chars.';
        fireEvent.change(textInput, { target: { value: userInput } });

        // check after input character count = 10/10
        expect(container).toHaveTextContent('10/10');
      });
    });
  });

  describe('iconLeft', () => {
    it('renders TextInput with iconLeft', () => {
      const { container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} iconLeft="info" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('iconRight', () => {
    it('renders TextInput with iconRight', () => {
      const { container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} iconRight="info" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('prefix', () => {
    it('renders TextInput with prefix', () => {
      const { container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} prefix="₹" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('suffix', () => {
    it('renders TextInput with suffix', () => {
      const { container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} suffix="₹" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('testID', () => {
    it('should have default testID(ds-text-input) if no testID is provided as prop', () => {
      const { queryByTestId } = renderWithTheme(<TextInput />);
      expect(queryByTestId('ds-text-input')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(<TextInput testID={testID} />);
      expect(queryByTestId('ds-text-input')).toBeNull();
      expect(queryByTestId(testID)).not.toBeNull();
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

  describe('onChange', () => {
    describe('with type=text(default)', () => {
      it('should update input value with user input and call change handler', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} type="text" onChange={handleChange} />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = 'some text entered by user';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });
    });

    describe('with type=number', () => {
      it('should update input value with user input and call change handler for valid numerical value ', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} type="number" onChange={handleChange} />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = '1';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });

      it('should not update input value with user input and not call change handler for invalid numerical value', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} type="number" onChange={handleChange} />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = 'a';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).not.toHaveBeenCalled();
        expect(textInput.value).toEqual('');
      });
    });

    describe('with maxLength', () => {
      it('should call change handler if user input is less than maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            type="text"
            onChange={handleChange}
            maxLength={5}
          />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = '1234';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });

      it('should call change handler if user input is equal to maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            type="text"
            onChange={handleChange}
            maxLength={5}
          />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = '12345';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textInput.value).toEqual(userInput);
      });

      it('should not call change handler if user input is greater than maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextInput
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            type="text"
            onChange={handleChange}
            maxLength={5}
          />,
        );
        const textInput = getByLabelText(SAMPLE_LABEL);
        const userInput = '123456';
        fireEvent.change(textInput, { target: { value: userInput } });
        expect(handleChange).not.toHaveBeenCalled();
        expect(textInput.value).toEqual('');
      });
    });
  });

  describe('onBlur', () => {
    it('should call blur handler on blur', () => {
      const handleBlur = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} onBlur={handleBlur} />,
      );
      const textInput = getByLabelText(SAMPLE_LABEL);
      fireEvent.blur(textInput);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('_isMultiline', () => {
    it('should render a input tag if _isMultiline is false(default)', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} />,
      );
      const textInput = queryByLabelText(SAMPLE_LABEL, { selector: 'input' });
      expect(textInput).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('should render a textarea tag if _isMultiline is true', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextInput label={SAMPLE_LABEL} id={SAMPLE_ID} _isMultiline={true} />,
      );
      const textarea = queryByLabelText(SAMPLE_LABEL, { selector: 'textarea' });
      expect(textarea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });
  });
});
