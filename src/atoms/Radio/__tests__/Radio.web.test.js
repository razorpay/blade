import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Radio from './../Radio';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  describe('id', () => {
    it('should not have id attribute if not provded as prop', () => {
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provded as prop', () => {
      const sampleID = 'sampleID';
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option id={sampleID} value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.id).toEqual(sampleID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provded as prop', () => {
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provded as prop', () => {
      const name = 'sample-name';
      const { getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" name={name} />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.name).toEqual(name);
    });
  });

  describe('size', () => {
    it('should render a large radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" size="large" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a medium(default) radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" size="medium" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a small radio input', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" size="small" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('variantColor', () => {
    it('should render a checkbox with default variantColor if variantColor not provided', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a checkbox with provided variantColor', () => {
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" variantColor="shade" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('helpText', () => {
    it('should render checkbox with provided helpText', () => {
      const helpText = 'This is some sample help text.';
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" helpText={helpText} />
        </Radio>,
      );
      expect(container).toHaveTextContent(helpText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('errorText', () => {
    it('should render checkbox with provided errorText', () => {
      const errorText = 'This is some sample error text.';
      const { container } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" errorText={errorText} />
        </Radio>,
      );
      expect(container).toHaveTextContent(errorText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    it('should call onChange with updated check value', () => {
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <Radio onChange={onChange}>
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      fireEvent.click(radio);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    describe('with disabled', () => {
      it('should not call onChange if checkbox is disabled', () => {
        const onChange = jest.fn();
        const { getByRole } = renderWithTheme(
          <Radio onChange={onChange}>
            <Radio.Option value="1" title="React" disabled />
          </Radio>,
        );
        const radio = getByRole('radio');
        fireEvent.click(radio);
        expect(onChange).not.toBeCalled();
      });
    });
  });

  describe('defaultValue', () => {
    it('should render radio input with checked(attr)=false if defaultValue(prop) is not provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render checkbox checked(attr)=true if defaultValue(prop) is provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio defaultValue="1">
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('disabled', () => {
    it('should render a disabled radio input if disabled is true', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio defaultValue="1">
          <Radio.Option value="1" disabled title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio).toBeDisabled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('value', () => {
    it('should render radio input with checked(attr)=false if value(prop) is not provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" disabled title="React" />
        </Radio>,
      );
      const radio = getByRole('radio');
      expect(radio.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render radio input checked(attr)=true if value(prop) is provided', () => {
      const { container, getByRole } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" disabled title="React" />
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
          <Radio.Option value="1" title="React" />
        </Radio>,
      );
      expect(queryByTestId('ds-radio-button')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(
        <Radio value="1">
          <Radio.Option value="1" title="React" testID={testID} />
        </Radio>,
      );
      expect(queryByTestId(testID)).not.toBeNull();
    });
  });
});
