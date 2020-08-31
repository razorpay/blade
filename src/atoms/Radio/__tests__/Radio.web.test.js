import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Radio from './../Radio';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  describe('default', () => {
    it('should render a radio only without title, helptext/errortext', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('id', () => {
    it('should not have id attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provided as prop', () => {
      const sampleID = 'sampleID';
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option id={sampleID} value="1" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.id).toEqual(sampleID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provided as prop', () => {
      const name = 'sample-name';
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" name={name} />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.name).toEqual(name);
    });
  });

  describe('title', () => {
    it('should render radio with provided title', () => {
      const title = 'Radio Button';
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title={title} />
        </Radio>,
      );
      expect(container).toHaveTextContent(title);
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('should render a large radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1" size="large">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a medium radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1" size="medium">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a small radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1" size="small">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('variantColor', () => {
    it('should render a radio with default variantColor if variantColor not provided', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a radio with provided variantColor', () => {
      const { container } = renderWithTheme(
        <Radio value="1" variantColor="shade">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('focus', () => {
    describe('with defaultValue(uncontrolled)', () => {
      it('should render focus styles on radio when radio is not checked', () => {
        const { container, getByRole } = renderWithTheme(
          <Radio defaultValue="1">
            <Radio.Option value="2" />
          </Radio>,
        );
        const radio = getByRole('radio');
        radio.focus();
        expect(radio).toHaveFocus();
        expect(container).toMatchSnapshot();
      });

      it('should render focus styles on radio when radio is checked', () => {
        const { container, getByRole } = renderWithTheme(
          <Radio defaultValue="1">
            <Radio.Option value="1" />
          </Radio>,
        );
        const radio = getByRole('radio');
        radio.focus();
        expect(radio).toHaveFocus();
        expect(container).toMatchSnapshot();
      });
    });

    describe('with value(controlled)', () => {
      it('should render focus styles on radio when radio is not checked', () => {
        const { container, getByRole } = renderWithTheme(
          <Radio value="1">
            <Radio.Option value="2" />
          </Radio>,
        );
        const radio = getByRole('radio');
        radio.focus();
        expect(radio).toHaveFocus();
        expect(container).toMatchSnapshot();
      });

      it('should render focus styles on radio when radio is checked', () => {
        const { container, getByRole } = renderWithTheme(
          <Radio value="1">
            <Radio.Option value="1" />
          </Radio>,
        );
        const radio = getByRole('radio');
        radio.focus();
        expect(radio).toHaveFocus();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('helpText', () => {
    it('should render radio with provided helpText', () => {
      const helpText = 'This is some sample help text.';
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" helpText={helpText} />
        </Radio>,
      );
      expect(container).toHaveTextContent(helpText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('errorText', () => {
    it('should render radio with provided errorText', () => {
      const errorText = 'This is some sample error text.';
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" errorText={errorText} />
        </Radio>,
      );
      expect(container).toHaveTextContent(errorText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    describe('with defaultValue(uncontrolled)', () => {
      it('should call onChange with updated check value', () => {
        const onChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <Radio onChange={onChange} defaultValue="1">
            <Radio.Option value="1" title="First Option" />
            <Radio.Option value="2" title="Second Option" />
          </Radio>,
        );
        const firstOption = getByLabelText('First Option');
        const secondOption = getByLabelText('Second Option');
        expect(firstOption.checked).toBe(true);
        expect(secondOption.checked).toBe(false);
        fireEvent.click(secondOption);
        expect(firstOption.checked).toBe(false);
        expect(secondOption.checked).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('2');
      });

      describe('with disabled', () => {
        it('should not call onChange if radio is disabled', () => {
          const onChange = jest.fn();
          const { getByRole } = renderWithTheme(
            <Radio onChange={onChange} defaultValue="1">
              <Radio.Option value="1" disabled />
            </Radio>,
          );
          const radio = getByRole('radio');
          expect(radio.checked).toBe(true);
          fireEvent.click(radio);
          expect(radio.checked).toBe(true);
          expect(onChange).not.toBeCalled();
        });
      });
    });

    describe('with value(controlled)', () => {
      it('should call onChange with updated check value', () => {
        const onChange = jest.fn();
        const { getByLabelText } = renderWithTheme(
          <Radio onChange={onChange} value="1">
            <Radio.Option value="1" title="First Option" />
            <Radio.Option value="2" title="Second Option" />
          </Radio>,
        );
        const firstOption = getByLabelText('First Option');
        const secondOption = getByLabelText('Second Option');
        expect(firstOption.checked).toBe(true);
        expect(secondOption.checked).toBe(false);
        fireEvent.click(secondOption);
        // Assertions should be made after re-render, however it is observed that checked attribute does not update even after re-render
        // TODO: Check after updating Jest & JSDom
        expect(firstOption.checked).toBe(true);
        expect(secondOption.checked).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('2');
      });

      describe('with disabled', () => {
        it('should not call onChange if radio is disabled', () => {
          const onChange = jest.fn();
          const { getByRole } = renderWithTheme(
            <Radio onChange={onChange} value="1">
              <Radio.Option value="2" disabled />
            </Radio>,
          );
          const radio = getByRole('radio');
          expect(radio.checked).toBe(false);
          fireEvent.click(radio);
          expect(radio.checked).toBe(false);
          expect(onChange).not.toBeCalled();
        });
      });
    });
  });

  describe('disabled', () => {
    it('should render a disabled radio input if disabled is true', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio defaultValue="1">
          <Radio.Option value="1" disabled />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).toBeDisabled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('defaultValue', () => {
    it('should render radio input with checked(attr) as false if defaultValue(prop) is not provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render radio checked(attr) as true if defaultValue(prop) is provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio defaultValue="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('value', () => {
    it('should render radio input with checked(attr) as false if value(prop) is not provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" disabled />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render radio input checked(attr) as true if value(prop) is provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" disabled />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('testID', () => {
    it('should have default testID(ds-radio-button) if no testID is provided as prop', () => {
      const { queryByTestId } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" />
        </Radio>,
      );
      expect(queryByTestId('ds-radio-button')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" testID={testID} />
        </Radio>,
      );
      const radio = queryByTestId(testID);
      expect(radio.checked).toBe(true);
      expect(radio).not.toBeNull();
    });
  });
});
