import React from 'react';
import { Chip } from '../Chip';
import { ChipGroup } from '../ChipGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Box } from '~components/Box';

describe('<ChipGroup />', () => {
  it('should render with selectionType="single"', () => {
    const { getByRole, container } = renderWithSSR(
      <Box>
        <ChipGroup accessibilityLabel="Select fruits" selectionType="single">
          <Chip value="apple">Apple</Chip>
          <Chip value="mango">Mango</Chip>
          <Chip value="orange">Orange</Chip>
        </ChipGroup>
        <ChipGroup accessibilityLabel="Select flowers" selectionType="multiple">
          <Chip value="Rose">Rose</Chip>
          <Chip value="Sunflower">Sunflower</Chip>
          <Chip value="Lily">Lily</Chip>
        </ChipGroup>
      </Box>,
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Mango' })).toBeInTheDocument();

    expect(getByRole('group')).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Rose' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Lily' })).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
