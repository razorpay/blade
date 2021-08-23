import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Flex from '../../Flex';
import View from '../../View';
import Button from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const SAMPLE_ID = 'sample-id';

describe('<Button />', () => {
  describe('id', () => {
    it('should not have id attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(<Button>Click Me</Button>);
      const button = getByRole('button');
      expect(button).not.toHaveAttribute('id');
    });

    it('should have provided id attribute if id provided as prop', () => {
      const { getByRole } = renderWithTheme(<Button id={SAMPLE_ID}>Click Me</Button>);
      const button = getByRole('button');
      expect(button).toHaveAttribute('id');
      expect(button.id).toEqual(SAMPLE_ID);
    });
  });

  describe('name', () => {
    it('should not have name attribute if not provided as prop', () => {
      const { getByRole } = renderWithTheme(<Button>Click Me</Button>);
      const button = getByRole('button');
      expect(button).not.toHaveAttribute('name');
    });

    it('should have provided name attribute if name provided as prop', () => {
      const name = 'sample-name';
      const { getByRole } = renderWithTheme(<Button name={name}>Click Me</Button>);
      const button = getByRole('button');
      expect(button).toHaveAttribute('name');
      expect(button.name).toEqual(name);
    });
  });

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
      const { container } = renderWithTheme(<Button variant="tertiary">Click Me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('variantColor', () => {
    it('should render a primary button based on provided variantColor', () => {
      const { container } = renderWithTheme(
        <Button variant="primary" variantColor="tone">
          Click Me
        </Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('block', () => {
    it('should render a block button', () => {
      const { container } = renderWithTheme(<Button block>Click Me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('align', () => {
    it('should render a left aligned button if align=left', () => {
      const { container } = renderWithTheme(
        <Flex flex={1} flexDirection="column">
          <View>
            <Button align="left">Click Me</Button>
          </View>
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a center aligned button if align=center', () => {
      const { container } = renderWithTheme(
        <Flex flex={1} flexDirection="column">
          <View>
            <Button align="center">Click Me</Button>
          </View>
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should render a right aligned button if align=right', () => {
      const { container } = renderWithTheme(
        <Flex flex={1} flexDirection="column">
          <View>
            <Button align="right">Click Me</Button>
          </View>
        </Flex>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    it('should render a medium(default) button', () => {
      const { container } = renderWithTheme(<Button>Click Me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a large button', () => {
      const { container } = renderWithTheme(<Button size="large">Click Me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a small button', () => {
      const { container } = renderWithTheme(<Button size="small">Click Me</Button>);
      expect(container).toMatchSnapshot();
    });

    it('should render a xsmall button', () => {
      const { container } = renderWithTheme(<Button size="xsmall">Click Me</Button>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('icon', () => {
    describe('with children', () => {
      describe('with icon left', () => {
        it('should render a button with icon on left', () => {
          const { container } = renderWithTheme(
            <Button icon="info" iconAlign="left">
              Button
            </Button>,
          );
          expect(container).toMatchSnapshot();
        });
      });

      describe('with icon right', () => {
        it('should render a button with icon on right', () => {
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
      const { container, getByRole } = renderWithTheme(<Button disabled>Disabled Button</Button>);
      const button = getByRole('button');
      expect(button).toBeDisabled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('focus', () => {
    it('should have focus when input is focused', () => {
      const { container, getByRole } = renderWithTheme(<Button>Click Me</Button>);
      const button = getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    it('should call onChange handler exactly one time', () => {
      const handleClick = jest.fn();
      const { getByRole } = renderWithTheme(<Button onClick={handleClick}>Click Me</Button>);
      const button = getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    describe('with disabled', () => {
      it('should not call onChange handler', () => {
        const handleClick = jest.fn();
        const { getByRole } = renderWithTheme(
          <Button disabled onClick={handleClick}>
            Click Me
          </Button>,
        );
        const button = getByRole('button');
        fireEvent.click(button);
        expect(handleClick).not.toBeCalled();
      });
    });
  });

  describe('type', () => {
    it('should call form submit handler if type is submit', () => {
      const handleSubmit = jest.fn();
      const { getByRole } = renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Click Me</Button>
        </form>,
      );
      const button = getByRole('button');
      fireEvent.click(button);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    // Skipping since Jest 24 does not handle the reset event correctly due to JSDOM 11
    // It is fixed in Jest 25 (JSDOM 15)
    it.skip('should call form reset handler if type is reset', () => {
      const handleReset = jest.fn();
      const { getByRole } = renderWithTheme(
        <form onReset={handleReset}>
          <Button type="reset">Click Me</Button>
        </form>,
      );
      const button = getByRole('button');
      fireEvent.click(button);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it('should not call submit handler if type is button', () => {
      const handleSubmit = jest.fn();
      const { getByRole } = renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Button type="button">Click Me</Button>
        </form>,
      );
      const button = getByRole('button');
      fireEvent.click(button);
      expect(handleSubmit).not.toBeCalled();
    });
  });

  describe('testID', () => {
    it('should have default testID(ds-button) if no testID is provided as prop', () => {
      const { queryByTestId } = renderWithTheme(<Button>Click Me</Button>);
      expect(queryByTestId('ds-button')).not.toBeNull();
    });

    it('should update testID if testID is provided as prop', () => {
      const testID = 'sample-test-id';
      const { queryByTestId } = renderWithTheme(<Button testID={testID}>Click Me</Button>);
      expect(queryByTestId('ds-button')).toBeNull();
      expect(queryByTestId(testID)).not.toBeNull();
    });
  });

  describe('accessibilityLabel', () => {
    it('should have  accessibilityLabel(aria-label) attribute if accessibilityLabel provided as prop', () => {
      const accessibilityLabel = 'sample-accessibility-label';
      const { getByLabelText } = renderWithTheme(
        <Button accessibilityLabel={accessibilityLabel}>Click Me</Button>,
      );
      expect(getByLabelText(accessibilityLabel)).not.toBeNull();
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
});
