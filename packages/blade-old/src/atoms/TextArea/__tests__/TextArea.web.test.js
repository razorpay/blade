import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextArea from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const SAMPLE_ID = 'sample-id';
const SAMPLE_LABEL = 'Sample Label';

describe('<TextArea />', () => {
  describe('default', () => {
    it('should render TextArea with default props', () => {
      const { container } = renderWithTheme(<TextArea />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('variant', () => {
    it('should render outlined variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="outlined" />);
      expect(container).toMatchSnapshot();
    });

    it('should render filled variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="filled" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('id', () => {
    it('should not have id attribute if not provided as prop', () => {
      const { getByTestId } = renderWithTheme(<TextArea label={SAMPLE_LABEL} />);
      const textArea = getByTestId('ds-text-area');
      expect(textArea).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provided as prop', () => {
      const { getByTestId } = renderWithTheme(<TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textArea = getByTestId('ds-text-area');
      expect(textArea).toHaveAttribute('id');
      expect(textArea.id).toEqual(SAMPLE_ID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provided as prop', () => {
      const { getByLabelText } = renderWithTheme(<TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textArea = getByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provided as prop', () => {
      const name = 'sample-name';
      const { getByLabelText } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} name={name} />,
      );
      const textArea = getByLabelText(SAMPLE_LABEL);
      expect(textArea).toHaveAttribute('name');
      expect(textArea.name).toEqual(name);
    });
  });

  describe('label', () => {
    it('should render a TextArea with labelPosition on top(default) and variant outlined(default)', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('should render a TextArea with labelPosition on top(default) and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" variant="filled" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('should render a TextArea with labelPosition on left and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="left" variant="filled" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });
  });

  describe('placeholder', () => {
    it('should have default placeholder(empty) if placeholder is not passed as prop', () => {
      const defaultPlaceholder = '';
      const { getByPlaceholderText } = renderWithTheme(<TextArea />);
      const textArea = getByPlaceholderText(defaultPlaceholder);
      expect(textArea.placeholder).toEqual(defaultPlaceholder);
    });

    it('should update placeholder if placeholder is passed as prop', () => {
      const placeholder = 'Example Placeholder';
      const { getByPlaceholderText } = renderWithTheme(<TextArea placeholder={placeholder} />);
      const textArea = getByPlaceholderText(placeholder);
      expect(textArea.placeholder).toEqual(placeholder);
    });
  });

  describe('width', () => {
    it('should render a TextArea with medium(default) width', () => {
      const { container } = renderWithTheme(<TextArea width="medium" />);
      expect(container).toMatchSnapshot();
    });

    it('should render a TextArea with small width', () => {
      const { container } = renderWithTheme(<TextArea width="small" />);
      expect(container).toMatchSnapshot();
    });

    it('should render a TextArea with auto width', () => {
      const { container } = renderWithTheme(<TextArea width="auto" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('focus', () => {
    it('should have focus when TextArea is focused', () => {
      const { container, getByLabelText } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} />,
      );
      const textArea = getByLabelText(SAMPLE_LABEL);
      textArea.focus();
      expect(textArea).toHaveFocus();
      expect(container).toMatchSnapshot();
    });

    it('should not have focus after TextArea blur', () => {
      const { getByLabelText } = renderWithTheme(<TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} />);
      const textArea = getByLabelText(SAMPLE_LABEL);
      textArea.focus();
      expect(textArea).toHaveFocus();
      textArea.blur();
      expect(textArea).not.toHaveFocus();
    });
  });

  describe('disabled', () => {
    it('should render a disabled TextArea', () => {
      const { container, getByLabelText } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} disabled />,
      );
      const textArea = getByLabelText(SAMPLE_LABEL);
      expect(textArea).toBeDisabled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('helpText', () => {
    it('should render TextArea with help text if helpText is provided as prop', () => {
      const { container } = renderWithTheme(<TextArea helpText="This is help text" />);
      expect(container).toHaveTextContent('This is help text');
      expect(container).toMatchSnapshot();
    });

    describe('with maxLength', () => {
      it('should render TextArea with character count as fraction', () => {
        const { container } = renderWithTheme(
          <TextArea helpText="This is help text" maxLength={10} />,
        );
        expect(container).toHaveTextContent('This is help text');
        expect(container).toHaveTextContent('0/10');
        expect(container).toMatchSnapshot();
      });

      it('should display updated character count when user inputs text', () => {
        const { getByLabelText, container } = renderWithTheme(
          <TextArea
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            helpText="This is help text"
            maxLength={10}
          />,
        );

        // check initial character count = 0/10
        expect(container).toHaveTextContent('This is help text');
        expect(container).toHaveTextContent('0/10');

        const textArea = getByLabelText(SAMPLE_LABEL);
        const userInput = 'Ten Chars.';
        fireEvent.change(textArea, {
          target: {
            value: userInput,
          },
        });

        // check after input character count = 10/10
        expect(container).toHaveTextContent('10/10');
      });
    });
  });

  describe('errorText', () => {
    it('should render TextArea with help text if errorText is provided as prop', () => {
      const { container } = renderWithTheme(<TextArea errorText="This is help text" />);
      expect(container).toHaveTextContent('This is help text');
      expect(container).toMatchSnapshot();
    });

    describe('with maxLength', () => {
      it('should render TextArea with character count as fraction', () => {
        const { container } = renderWithTheme(
          <TextArea errorText="This is error text" maxLength={10} />,
        );
        expect(container).toHaveTextContent('This is error text');
        expect(container).toHaveTextContent('0/10');
        expect(container).toMatchSnapshot();
      });

      it('should display updated character count when user inputs text', () => {
        const { getByLabelText, container } = renderWithTheme(
          <TextArea
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            errorText="This is error text"
            maxLength={10}
          />,
        );

        // check initial character count = 0/10
        expect(container).toHaveTextContent('This is error text');
        expect(container).toHaveTextContent('0/10');

        const textArea = getByLabelText(SAMPLE_LABEL);
        const userInput = 'Ten Chars.';
        fireEvent.change(textArea, {
          target: {
            value: userInput,
          },
        });

        // check after input character count = 10/10
        expect(container).toHaveTextContent('10/10');
      });
    });
  });

  describe('testID', () => {
    it('should have default testID(ds-text-area) if no testID is provided as prop', () => {
      const { queryByTestId } = renderWithTheme(<TextArea />);
      expect(queryByTestId('ds-text-area')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(<TextArea testID={testID} />);
      expect(queryByTestId('ds-text-area')).toBeNull();
      expect(queryByTestId(testID)).not.toBeNull();
    });
  });

  describe('error', () => {
    it('should throw error when labelPosition is left and variant is outlined', () => {
      const errorMessage = 'Cannot have a left label on an outlined Text Area';
      expect(() => renderWithTheme(<TextArea labelPosition="left" />)).toThrow(errorMessage);
    });
  });

  describe('onChange', () => {
    it('should update TextArea value with user input and call change handler', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} onChange={handleChange} />,
      );
      const textArea = getByLabelText(SAMPLE_LABEL);
      const userInput = 'some text entered by user';
      fireEvent.change(textArea, {
        target: {
          value: userInput,
        },
      });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(textArea.value).toEqual(userInput);
    });

    describe('with maxLength', () => {
      it('should call change handler if user input is less than maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} onChange={handleChange} maxLength={5} />,
        );
        const textArea = getByLabelText(SAMPLE_LABEL);
        const userInput = '1234';
        fireEvent.change(textArea, {
          target: {
            value: userInput,
          },
        });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textArea.value).toEqual(userInput);
      });

      it('should call change handler if user input is equal to maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} onChange={handleChange} maxLength={5} />,
        );
        const textArea = getByLabelText(SAMPLE_LABEL);
        const userInput = '12345';
        fireEvent.change(textArea, {
          target: {
            value: userInput,
          },
        });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(textArea.value).toEqual(userInput);
      });

      it('should not call change handler if user input is greater than maxLength', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <TextArea
            label={SAMPLE_LABEL}
            id={SAMPLE_ID}
            type="text"
            onChange={handleChange}
            maxLength={5}
          />,
        );
        const textArea = getByLabelText(SAMPLE_LABEL);
        const userInput = '123456';
        fireEvent.change(textArea, {
          target: {
            value: userInput,
          },
        });
        expect(handleChange).not.toHaveBeenCalled();
        expect(textArea.value).toEqual('');
      });
    });
  });

  describe('onBlur', () => {
    it('should call blur handler on blur', () => {
      const handleBlur = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} onBlur={handleBlur} />,
      );
      const textArea = getByLabelText(SAMPLE_LABEL);
      fireEvent.blur(textArea);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
});
