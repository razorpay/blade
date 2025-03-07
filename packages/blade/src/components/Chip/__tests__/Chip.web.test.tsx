import userEvents from '@testing-library/user-event';
import React from 'react';
import { Chip } from '../Chip';
import { ChipGroup } from '../ChipGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';
import { InfoIcon } from '~components/Icons';
import assertAccessible from '~utils/testing/assertAccessible.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Chip />', () => {
  it('should render chip', () => {
    const { container, getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Mango' })).toBeInTheDocument();
  });

  it('should render chip with icon', () => {
    const { container, getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" icon={InfoIcon}>
          Apple
        </Chip>
        <Chip value="mango" icon={InfoIcon}>
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Mango' })).toBeInTheDocument();
  });

  it('should render chip with color', () => {
    const { getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Was this message helpful?">
        <Chip value="apple" color="positive">
          Yes
        </Chip>
        <Chip value="mango" color="negative">
          No
        </Chip>
      </ChipGroup>,
    );

    expect(getByRole('radio', { name: 'Yes' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'No' })).toBeInTheDocument();
  });

  it('should throw error if used outside ChipGroup', () => {
    expect(() => renderWithTheme(<Chip value="apple">Apple</Chip>)).toThrowError(
      '[Blade: Chip]: <Chip /> component should only be used within the context of a <ChipGroup /> component',
    );
  });

  it('should set disabled state with isDisabled', () => {
    const { container, getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" isDisabled>
          Apple
        </Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeDisabled();
    expect(getByRole('radio', { name: 'Mango' })).not.toBeDisabled();
  });

  it('user should be able set checked state with selectionType="single"', async () => {
    const user = userEvents.setup();

    const fruitApple = 'Apple';
    const fruitMango = 'Mango';
    const { getByRole, getByLabelText } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits" selectionType="single">
        <Chip value="apple">{fruitApple}</Chip>
        <Chip value="mango">{fruitMango}</Chip>
      </ChipGroup>,
    );

    expect(getByRole('radio', { name: fruitApple })).not.toBeChecked();
    expect(getByRole('radio', { name: fruitMango })).not.toBeChecked();
    await user.click(getByLabelText(fruitApple));
    expect(getByRole('radio', { name: fruitApple })).toBeChecked();
    expect(getByRole('radio', { name: fruitMango })).not.toBeChecked();
    await user.click(getByLabelText(fruitMango));
    expect(getByRole('radio', { name: fruitMango })).toBeChecked();
    expect(getByRole('radio', { name: fruitApple })).not.toBeChecked();
  });

  it('user should be able set checked state with selectionType="multiple"', async () => {
    const user = userEvents.setup();

    const fruitApple = 'Apple';
    const fruitMango = 'Mango';
    const { getByRole, getByLabelText } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits" selectionType="multiple">
        <Chip value="apple">{fruitApple}</Chip>
        <Chip value="mango">{fruitMango}</Chip>
      </ChipGroup>,
    );

    expect(getByRole('checkbox', { name: fruitApple })).not.toBeChecked();
    expect(getByRole('checkbox', { name: fruitMango })).not.toBeChecked();
    await user.click(getByLabelText(fruitApple));
    expect(getByRole('checkbox', { name: fruitApple })).toBeChecked();
    expect(getByRole('checkbox', { name: fruitMango })).not.toBeChecked();
    await user.click(getByLabelText(fruitMango));
    expect(getByRole('checkbox', { name: fruitMango })).toBeChecked();
    expect(getByRole('checkbox', { name: fruitApple })).toBeChecked();
    await user.click(getByLabelText(fruitApple));
    await user.click(getByLabelText(fruitMango));
    expect(getByRole('checkbox', { name: fruitMango })).not.toBeChecked();
    expect(getByRole('checkbox', { name: fruitApple })).not.toBeChecked();
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Accept';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <ChipGroup accessibilityLabel="Select fruits">
            <Chip value="1" ref={ref}>
              {label}
            </Chip>
          </ChipGroup>
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
        </>
      );
    };
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button', { name: 'Focus' });

    expect(input).not.toHaveFocus();
    expect(input).toHaveAttribute('type', 'radio');

    await userEvents.click(button);
    expect(input).toHaveFocus();
  });

  it('should pas generals ally', async () => {
    const { container } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>,
    );

    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" testID="chip-apple-test">
          Apple
        </Chip>
        <Chip value="mango" testID="chip-mango-test">
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(getByTestId('chip-apple-test')).toBeTruthy();
    expect(getByTestId('chip-mango-test')).toBeTruthy();
  });
  it('should accept data-analytics-*', () => {
    const { container } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits" data-analytics-chip-group="fruits">
        <Chip value="apple" data-analytics-chip="apple">
          Apple
        </Chip>
        <Chip value="mango" data-analytics-chip="mango">
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(container.querySelector('[data-analytics-chip-group="fruits"]')).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-chip="apple"]')).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-chip="mango"]')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
