/**
 * @jest-environment node
 */

import { CounterInput } from '../CounterInput';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<CounterInput />', () => {
  it('should render', () => {
    const label = 'Enter quantity';
    const { container, getByRole } = renderWithSSR(
      <CounterInput label={label} value={5} min={1} max={10} emphasis="intense" size="large" />,
    );

    const input = getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(container).toMatchSnapshot();
  });
});
