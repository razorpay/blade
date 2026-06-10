/**
 * @jest-environment node
 */

import { SliderInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SliderInput />', () => {
  it('should render SliderInput with default properties', () => {
    const { container } = renderWithSSR(
      <SliderInput label="Corner Radius" value={12} min={0} max={24} suffix="px" />,
    );
    expect(container).toMatchSnapshot();
  });
});
