/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import type { ButtonGroupProps } from '../ButtonGroup';
import { ButtonGroup } from '../ButtonGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button/Button';
import { ChevronDownIcon, PlusIcon } from '~components/Icons';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const variants: ButtonGroupProps['variant'][] = ['primary', 'secondary', 'tertiary'];
const colors: ButtonGroupProps['color'][] = ['primary', 'white', 'positive', 'negative'];
const sizes: ButtonGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];

describe('<ButtonGroup />', () => {
  it('should render ButtonGroup with default properties', () => {
    const { container, getByRole, getAllByRole } = renderWithTheme(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toBeInTheDocument();

    const [button1, button2, button3] = getAllByRole('button');
    expect(button1).toHaveTextContent('One');
    expect(button2).toHaveTextContent('Two');
    expect(button3).toHaveTextContent('Three');
  });

  it('should render ButtonGroup with dropdown', () => {
    const { container, getByRole, getAllByRole } = renderWithTheme(
      <ButtonGroup>
        <Button icon={PlusIcon}>Payout</Button>
        <Dropdown>
          <DropdownButton icon={ChevronDownIcon}> More</DropdownButton>
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Bulk Payout" value="bulk-payout" />
              <ActionListItem title="Upload Invoice" value="upload-invoice" />
              <ActionListItem title="Add Contact" value="add-contact" />
              <ActionListItem title="Team Member" value="team-member" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </ButtonGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('group')).toBeInTheDocument();

    const [button1, button2] = getAllByRole('button');
    expect(button1).toHaveTextContent('Payout');
    expect(button2).toHaveTextContent('More');
  });

  sizes.forEach((size) => {
    it(`should render ButtonGroup with ${size} size`, () => {
      const { container } = renderWithTheme(
        <ButtonGroup size={size}>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render ButtonGroup with full width', () => {
    const { container } = renderWithTheme(
      <ButtonGroup isFullWidth={true}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled ButtonGroup', () => {
    const onClick = jest.fn();
    const { container, getAllByRole } = renderWithTheme(
      <ButtonGroup isDisabled={true}>
        <Button onClick={onClick}>One</Button>
        <Button onClick={onClick}>Two</Button>
        <Button onClick={onClick}>Three</Button>
      </ButtonGroup>,
    );
    expect(container).toMatchSnapshot();

    const [button1, button2, button3] = getAllByRole('button');
    fireEvent.click(button1);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button1).toBeDisabled();

    fireEvent.click(button2);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button2).toBeDisabled();

    fireEvent.click(button3);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button3).toBeDisabled();
  });

  colors.forEach((color) => {
    variants.forEach((variant) => {
      // We support only white and default color for tertiary variant
      if (variant === 'tertiary' && color !== 'white' && color !== 'primary') return;

      it(`should render ${color} color ${variant} button`, () => {
        const { container } = renderWithTheme(
          <ButtonGroup variant={variant} color={color}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>,
        );
        expect(container).toMatchSnapshot();
      });

      it(`should render disabled ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { container } = renderWithTheme(
          <Button color={color} variant={variant} isDisabled={true}>
            {buttonText}
          </Button>,
        );
        expect(container).toMatchSnapshot();
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
    expect(getByTestId('button-group-test')).toBeInTheDocument();
  });
  it('should support data-analytics', () => {
    const { container } = renderWithTheme(
      <ButtonGroup data-analytics-test="test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );

    expect(container.querySelector('[data-analytics-test="test"]')).toBeInTheDocument();
  });

  it('should throw error for invalid children', () => {
    expect(() =>
      renderWithTheme(
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <p>Three</p>
        </ButtonGroup>,
      ),
    ).toThrowError(
      '[Blade: ButtonGroup]: Only `Button, Dropdown, Tooltip, Popover` components are accepted in `ButtonGroup` children',
    );
  });
});
