import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Chip } from '../Chip';
import { ChipGroup } from '../ChipGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Chip />', () => {
  it('should render chip', () => {
    const { toJSON, getByText } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>,
    );

    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Apple')).toBeDefined();
    expect(getByText('Mango')).toBeDefined();
  });

  it('should render chip with icon', () => {
    const { toJSON, getByText } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" icon={InfoIcon}>
          Apple
        </Chip>
        <Chip value="mango" icon={InfoIcon}>
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Apple')).toBeDefined();
    expect(getByText('Mango')).toBeDefined();
  });

  it('should render chip with intent', () => {
    const { getByText } = renderWithTheme(
      <ChipGroup accessibilityLabel="Was this message helpful?">
        <Chip value="apple" intent="positive">
          Yes
        </Chip>
        <Chip value="mango" intent="negative">
          No
        </Chip>
      </ChipGroup>,
    );

    expect(getByText('Yes')).toBeDefined();
    expect(getByText('No')).toBeDefined();
  });

  it('should throw error if used outside ChipGroup', () => {
    expect(() => renderWithTheme(<Chip value="apple">Apple</Chip>)).toThrowError(
      '[Blade: Chip]: <Chip /> component should only be used within the context of a <ChipGroup /> component',
    );
  });

  it('should set disabled state with isDisabled', () => {
    const { toJSON, getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" isDisabled>
          Apple
        </Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeDisabled();
    expect(getByRole('radio', { name: 'Mango' })).not.toBeDisabled();
  });

  it(`should prioritize Chip's isDisabled prop instead of ChipGroup isDisabled`, () => {
    const { toJSON, getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits" isDisabled>
        <Chip value="apple">Apple</Chip>
        <Chip value="mango" isDisabled={false}>
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByRole('radio', { name: 'Apple' })).toBeDisabled();
    expect(getByRole('radio', { name: 'Mango' })).not.toBeDisabled();
  });

  it('user should be able set checked state', () => {
    const fruitApple = 'Apple';
    const fruitMango = 'Mango';
    const { getByRole } = renderWithTheme(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple">{fruitApple}</Chip>
        <Chip value="mango">{fruitMango}</Chip>
      </ChipGroup>,
    );

    const appleChip = getByRole('radio', { name: fruitApple });
    const mangoChip = getByRole('radio', { name: fruitMango });

    expect(appleChip.props.accessibilityState.checked).toBeFalsy();
    expect(mangoChip.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(appleChip);
    expect(appleChip.props.accessibilityState.checked).toBeTruthy();
    expect(mangoChip.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(mangoChip);
    expect(appleChip.props.accessibilityState.checked).toBeFalsy();
    expect(mangoChip.props.accessibilityState.checked).toBeTruthy();
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <ChipGroup accessibilityLabel="Select fruits">
          <Chip
            value="apple"
            ref={(value) => {
              // @ts-expect-error - for testing purposes
              ref.current = value;
              refValue = value;
            }}
          >
            Apple
          </Chip>
        </ChipGroup>
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toBeNull();
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
});
