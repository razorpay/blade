import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import type { ButtonGroupProps } from '../ButtonGroup';
import { ButtonGroup } from '../ButtonGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const variants: ButtonGroupProps['variant'][] = ['primary', 'secondary', 'tertiary'];
const colors: ButtonGroupProps['color'][] = ['primary', 'white', 'positive', 'negative'];
const sizes: ButtonGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];

describe('<ButtonGroup /> (native)', () => {
  it('should render ButtonGroup with default properties', () => {
    const { toJSON } = renderWithTheme(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  sizes.forEach((size) => {
    it(`should render ButtonGroup with ${size} size`, () => {
      const { toJSON } = renderWithTheme(
        <ButtonGroup size={size}>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render ButtonGroup with full width', () => {
    const { toJSON } = renderWithTheme(
      <ButtonGroup isFullWidth={true}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled ButtonGroup', () => {
    const onClick = jest.fn();
    const { toJSON, getAllByRole } = renderWithTheme(
      <ButtonGroup isDisabled={true}>
        <Button onClick={onClick}>One</Button>
        <Button onClick={onClick}>Two</Button>
        <Button onClick={onClick}>Three</Button>
      </ButtonGroup>,
    );
    expect(toJSON()).toMatchSnapshot();

    const buttons = getAllByRole('button');
    buttons.forEach((button: ReturnType<typeof getAllByRole>[number]) => {
      fireEvent.press(button);
    });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should call onClick when ButtonGroup is enabled', () => {
    const onClickOne = jest.fn();
    const onClickTwo = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <ButtonGroup>
        <Button onClick={onClickOne}>One</Button>
        <Button onClick={onClickTwo}>Two</Button>
      </ButtonGroup>,
    );

    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(onClickOne).toHaveBeenCalled();
    fireEvent.press(buttons[1]);
    expect(onClickTwo).toHaveBeenCalled();
  });

  colors.forEach((color) => {
    variants.forEach((variant) => {
      if (variant === 'tertiary' && color !== 'white' && color !== 'primary') return;

      it(`should render ${color} color ${variant} variant`, () => {
        const { toJSON } = renderWithTheme(
          <ButtonGroup variant={variant} color={color}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>,
        );
        expect(toJSON()).toMatchSnapshot();
      });
    });
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ButtonGroup testID="button-group-test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(getByTestId('button-group-test')).toBeTruthy();
  });

  it('should throw error for invalid children', () => {
    const InvalidChild = (): React.ReactElement => <></>;
    expect(() =>
      renderWithTheme(
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <InvalidChild />
        </ButtonGroup>,
      ),
    ).toThrowError(
      '[Blade: ButtonGroup]: Only `Button, Dropdown, Tooltip, Popover` components are accepted in `ButtonGroup` children',
    );
  });
});
