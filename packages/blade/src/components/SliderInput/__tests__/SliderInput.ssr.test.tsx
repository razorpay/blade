/**
 * @jest-environment node
 */

import { SliderInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SliderInput />', () => {
  it('should render SliderInput with default properties', () => {
    const { container } = renderWithSSR(
      <SliderInput label="Corner Radius" value={12} onChange={() => undefined} min={0} max={24} />,
    );
    expect(container).toMatchSnapshot();
  });
});
