import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Checkbox from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const SAMPLE_ID = 'sample-checkbox';

describe('<Checkbox />', () => {
  describe('size', () => {
    it('should render a large checkbox', () => {
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} size="large" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a medium(default) checkbox', () => {
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} size="medium" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a small checkbox', () => {
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} size="small" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('variantColor', () => {
    it('should render a checkbox with default variantColor if variantColor not provided', () => {
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} defaultChecked={false} />);
      expect(container).toMatchSnapshot();
    });

    it('should render a checkbox with provided variantColor', () => {
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} variantColor="shade" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('helpText', () => {
    it('should render checkbox with provided helpText', () => {
      const helpText = 'This is some sample help text.';
      const { container } = renderWithTheme(
        <Checkbox
          id={SAMPLE_ID}
          defaultChecked={false}
          title="Nice checkbox"
          helpText={helpText}
        />,
      );
      expect(container).toHaveTextContent(helpText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('errorText', () => {
    it('should render checkbox with provided errorText', () => {
      const errorText = 'This is some sample error text.';
      const { container } = renderWithTheme(
        <Checkbox
          id={SAMPLE_ID}
          defaultChecked={false}
          title="Nice checkbox"
          errorText={errorText}
        />,
      );
      expect(container).toHaveTextContent(errorText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    it('should call onChange with updated check value', () => {
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} onChange={onChange} />,
      );
      const checkBox = getByRole('checkbox');
      fireEvent.click(checkBox);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    describe('with disabled', () => {
      it('should not call onChange if checkbox is disabled', () => {
        const onChange = jest.fn();
        const { getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} disabled defaultChecked={false} onChange={onChange} />,
        );
        const checkBox = getByRole('checkbox');
        fireEvent.click(checkBox);
        expect(onChange).not.toBeCalled();
      });
    });
  });

  describe('defaultChecked', () => {
    it('should render checkbox with checked(attr)=false if defaultChecked(prop) is false', () => {
      const { container, getByRole } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render checkbox checked(attr)=true if defaultChecked(prop) is true', () => {
      const { container, getByRole } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={true} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('checked', () => {
    it('should render checkbox with checked(attr)=false if checked(prop) is false', () => {
      const { container, getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} checked={false} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render checkbox checked(attr)=true if checked(prop) is true', () => {
      const { container, getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} checked={true} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('testID', () => {
    it('should have default testID(ds-checkbox) if no testID is provided as prop', () => {
      const { queryByTestId } = renderWithTheme(<Checkbox id={SAMPLE_ID} />);
      expect(queryByTestId('ds-checkbox')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(<Checkbox id={SAMPLE_ID} testID={testID} />);
      expect(queryByTestId(testID)).not.toBeNull();
    });
  });

  describe('error', () => {
    it('should throw error if both defaultChecked and checked is passed', () => {
      const error = 'One of defaultChecked or checked should be supplied.';
      expect(() =>
        renderWithTheme(<Checkbox id={SAMPLE_ID} defaultChecked={false} checked={false} />),
      ).toThrow(error);
    });
  });
});
