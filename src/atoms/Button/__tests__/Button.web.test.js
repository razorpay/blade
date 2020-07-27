import React from 'react';
import { fireEvent } from '@testing-library/react';

import Button from '../index';
import View from '../../View';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Button />', () => {
  describe('variant', () => {
    it('should render a primary(default) button', () => {
      const { container } = renderWithTheme(<Button>Click Me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a secondary button', () => {
      const { container } = renderWithTheme(<Button variant="secondary">Click Me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a tertiary button', () => {
      const { container } = renderWithTheme(<Button variant="tertiary">click me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('error', () => {
    it('should throw error if children is not string', () => {
      const errorMessage = 'Error in Button: expected `children` of type `string` but found object';
      expect(() =>
        renderWithTheme(
          <Button>
            <View />
          </Button>,
        ),
      ).toThrow(errorMessage);
    });
  });

  describe('block', () => {
    it('should render a block button', () => {
      const { container } = renderWithTheme(<Button block>click me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('should render a medium(default) button', () => {
      const { container } = renderWithTheme(<Button>click me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a large button', () => {
      const { container } = renderWithTheme(<Button size="large">click me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a small button', () => {
      const { container } = renderWithTheme(<Button size="small">click me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a xsmall button', () => {
      const { container } = renderWithTheme(<Button size="xsmall">click me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('icon', () => {
    describe('with children', () => {
      describe('with iconAlign left', () => {
        it('should render a button with text with icon on left', () => {
          const { container } = renderWithTheme(
            <Button icon="info" iconAlign="left">
              Button
            </Button>,
          );
          expect(container).toMatchSnapshot();
        });
      });

      describe('with iconAlign right', () => {
        it('should render a button with text with icon on right', () => {
          const { container } = renderWithTheme(
            <Button icon="info" iconAlign="right">
              Button
            </Button>,
          );
          expect(container).toMatchSnapshot();
        });
      });
    });

    describe('without children', () => {
      it('should render icon only button', () => {
        const { container } = renderWithTheme(<Button icon="info" />);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('disabled', () => {
    it('should render a disabled button', () => {
      const { container } = renderWithTheme(<Button disabled>Disabled</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    describe('without disabled', () => {
      it('should call onChange handler exactly one time', () => {
        const handleClick = jest.fn();
        const { container, getByTestId } = renderWithTheme(
          <Button onClick={handleClick}>Click Me</Button>,
        );
        const button = getByTestId('ds-button');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
      });
    });

    describe('with disabled', () => {
      it('should not call onChange handler', () => {
        const handleClick = jest.fn();
        const { container, getByTestId } = renderWithTheme(
          <Button disabled onClick={handleClick}>
            Click Me
          </Button>,
        );
        const button = getByTestId('ds-button');
        fireEvent.click(button);
        expect(handleClick).not.toBeCalled();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('type', () => {
    it('should call form submit handler if type is submit', () => {
      const handleSubmit = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Click Me</Button>
        </form>,
      );
      const button = getByTestId('ds-button');
      fireEvent.click(button);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    // Skipping since Jest 24 does not handle the reset event correctly due to JSDOM 11
    // It is supposed to be fixed in Jest 25 (JSDOM 15)
    it.skip('should call form reset handler if type is reset', () => {
      const handleReset = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <form onReset={handleReset}>
          <Button type="reset">Click Me</Button>
        </form>,
      );
      const button = getByTestId('ds-button');
      fireEvent.click(button);
      expect(handleReset).toHaveBeenCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('should not call submit handler if type is button', () => {
      const handleSubmit = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Button type="button">Click Me</Button>
        </form>,
      );
      const button = getByTestId('ds-button');
      fireEvent.click(button);
      expect(handleSubmit).not.toBeCalled();
      expect(container).toMatchSnapshot();
    });
  });
});
