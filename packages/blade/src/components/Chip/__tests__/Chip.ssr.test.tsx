import React from 'react';
import { Chip } from '../Chip';
import { ChipGroup } from '../ChipGroup';
import { InfoIcon } from '~components/Icons';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Chip />', () => {
  it('should render with icon', () => {
    const { container, getByRole } = renderWithSSR(
      <ChipGroup accessibilityLabel="Select fruits">
        <Chip value="apple" icon={InfoIcon}>
          Apple
        </Chip>
        <Chip value="mango" icon={InfoIcon}>
          Mango
        </Chip>
      </ChipGroup>,
    );
    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Apple' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Mango' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
