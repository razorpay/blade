import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Checkbox from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const SAMPLE_ID = 'sample-checkbox';

describe('<Checkbox />', () => {
  describe('id', () => {
    it('should not have id attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(<Checkbox />);
      const checkbox = getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provided as prop', () => {
      const { getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.id).toEqual(SAMPLE_ID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provided as prop', () => {
      const name = 'sample-name';
      const { getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} name={name} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.name).toEqual(name);
    });
  });

  describe('title', () => {
    it('should render a checkbox with provided title', () => {
      const title = 'Enable Beast Mode';
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} title={title} />);
      expect(container).toHaveTextContent(title);
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('should render a large checkbox', () => {
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} size="large" />);
      expect(container).toMatchSnapshot();
    });

    it('should render a medium(default) checkbox', () => {
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} size="medium" />);
      expect(container).toMatchSnapshot();
    });

    it('should render a small checkbox', () => {
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} size="small" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('variantColor', () => {
    it('should render a checkbox with default variantColor if variantColor not provided', () => {
      const { container } = renderWithTheme(<Checkbox defaultChecked id={SAMPLE_ID} />);
      expect(container).toMatchSnapshot();
    });

    it('should render a checkbox with provided variantColor', () => {
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked variantColor="shade" />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('helpText', () => {
    it('should render checkbox with provided helpText', () => {
      const helpText = 'This is some sample help text.';
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} title="Nice checkbox" helpText={helpText} />,
      );
      expect(container).toHaveTextContent(helpText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('errorText', () => {
    it('should render checkbox with provided errorText', () => {
      const errorText = 'This is some sample error text.';
      const { container } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} title="Nice checkbox" errorText={errorText} />,
      );
      expect(container).toHaveTextContent(errorText);
      expect(container).toMatchSnapshot();
    });
  });

  describe('checkbox only', () => {
    it('should render a icon only checkbox', () => {
      const { container } = renderWithTheme(<Checkbox id={SAMPLE_ID} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('focus', () => {
    describe('with defaultChecked', () => {
      it('should render focus styles on checkbox when defaultChecked is false', () => {
        const { container, getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} defaultChecked={false} />,
        );
        const checkbox = getByRole('checkbox');
        checkbox.focus();
        expect(checkbox).toHaveFocus();
        expect(container).toMatchSnapshot();
      });

      it('should render focus styles on checkbox when defaultChecked is true', () => {
        const { container, getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} defaultChecked={true} />,
        );
        const checkbox = getByRole('checkbox');
        checkbox.focus();
        expect(checkbox).toHaveFocus();
        expect(container).toMatchSnapshot();
      });
    });

    describe('with checked', () => {
      it('should render focus styles on checkbox when defaultChecked is false', () => {
        const { container, getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} checked={false} />,
        );
        const checkbox = getByRole('checkbox');
        checkbox.focus();
        expect(checkbox).toHaveFocus();
        expect(container).toMatchSnapshot();
      });

      it('should render focus styles on checkbox when defaultChecked is true', () => {
        const { container, getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} checked={true} />,
        );
        const checkbox = getByRole('checkbox');
        checkbox.focus();
        expect(checkbox).toHaveFocus();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('onChange', () => {
    describe('with defaultChecked(uncontrolled)', () => {
      it('should call onChange with updated check value', () => {
        const onChange = jest.fn();
        const { getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} defaultChecked={false} onChange={onChange} />,
        );
        const checkbox = getByRole('checkbox');
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
      });

      describe('with disabled', () => {
        it('should not call onChange if checkbox is disabled', () => {
          const onChange = jest.fn();
          const { getByRole } = renderWithTheme(
            <Checkbox id={SAMPLE_ID} disabled defaultChecked={false} onChange={onChange} />,
          );
          const checkbox = getByRole('checkbox');
          expect(checkbox.defaultChecked).toBe(false);
          fireEvent.click(checkbox);
          expect(checkbox.defaultChecked).toBe(false);
          expect(onChange).not.toBeCalled();
        });
      });
    });

    describe('with checked(controlled)', () => {
      it('should call onChange with updated check value', () => {
        const onChange = jest.fn();
        const { getByRole } = renderWithTheme(
          <Checkbox id={SAMPLE_ID} checked={false} onChange={onChange} />,
        );
        const checkbox = getByRole('checkbox');
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
      });

      describe('with disabled', () => {
        it('should not call onChange if checkbox is disabled', () => {
          const onChange = jest.fn();
          const { getByRole } = renderWithTheme(
            <Checkbox id={SAMPLE_ID} disabled checked={false} onChange={onChange} />,
          );
          const checkbox = getByRole('checkbox');
          expect(checkbox.defaultChecked).toBe(false);
          fireEvent.click(checkbox);
          expect(checkbox.defaultChecked).toBe(false);
          expect(onChange).not.toBeCalled();
        });
      });
    });
  });

  describe('defaultChecked', () => {
    it('should render checkbox with checked(attr) as false if defaultChecked(prop) is false', () => {
      const { container, getByRole } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} defaultChecked={false} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render checkbox checked(attr) as true if defaultChecked(prop) is true', () => {
      const { container, getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} defaultChecked />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  describe('disabled', () => {
    it('should render a disabled checkbox if disabled is true', () => {
      const { container, getByRole } = renderWithTheme(
        <Checkbox id={SAMPLE_ID} disabled defaultChecked={false} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('checked', () => {
    it('should render checkbox with checked(attr) as false if checked(prop) is false', () => {
      const { container, getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} checked={false} />);
      const checkbox = getByRole('checkbox');
      expect(checkbox.checked).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should render checkbox checked(attr) as true if checked(prop) is true', () => {
      const { container, getByRole } = renderWithTheme(<Checkbox id={SAMPLE_ID} checked />);
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
      const error = 'Only one of defaultChecked or checked should be supplied.';
      expect(() =>
        renderWithTheme(<Checkbox id={SAMPLE_ID} defaultChecked={false} checked={false} />),
      ).toThrow(error);
    });
  });
});
