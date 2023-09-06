import React from 'react';
import { Chip } from '../Chip';
import { ChipGroup } from '../ChipGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ChipGroup />', () => {
  it('should render with selectionType="single"', () => {
    const { container, getByRole } = renderWithSSR(
      <ChipGroup accessibilityLabel="Select fruits" selectionType="single">
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Mango' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('should render with selectionType="multiple"', () => {
    const { container, getByRole } = renderWithSSR(
      <ChipGroup accessibilityLabel="Select fruits" selectionType="multiple">
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
        <Chip value="orange">Orange</Chip>
      </ChipGroup>,
    );

    expect(getByRole('group')).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Mango' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
