/**
 * @jest-environment node
 */

import { CounterInput } from '../CounterInput';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<CounterInput />', () => {
  it('should render CounterInput with default properties', () => {
    const { container } = renderWithSSR(
      <CounterInput label="Product Quantity" value={5} min={1} max={10} />,
    );
    expect(container).toMatchSnapshot();
  });
});
