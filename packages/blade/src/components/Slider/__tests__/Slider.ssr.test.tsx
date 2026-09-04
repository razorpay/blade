/**
 * @jest-environment node
 */

import { Slider } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Slider />', () => {
  it('should render Slider with default properties', () => {
    const { container } = renderWithSSR(
      <Slider label="Corner Radius" value={12} onChange={() => undefined} min={0} max={24} />,
    );
    expect(container).toMatchSnapshot();
  });
});
