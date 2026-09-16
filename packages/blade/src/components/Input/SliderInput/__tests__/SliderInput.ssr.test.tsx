import React from 'react';
import { SliderInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SliderInput />', () => {
  // Kept as a single case on purpose: `useFormId` runs off a module level counter, so a
  // second render in the same file produces ids that no longer match the server pass.
  it('should render on the server', () => {
    const { container, getByRole } = renderWithSSR(
      <SliderInput
        label="Volume"
        min={0}
        max={100}
        step={25}
        defaultValue={100}
        showMarkers
        showScale
      />,
    );

    // Positioning never reads `getBoundingClientRect`, so the server emits the thumb at its
    // final offset instead of at zero and then jumping on hydration.
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
    expect(container).toMatchSnapshot();
  });
});
