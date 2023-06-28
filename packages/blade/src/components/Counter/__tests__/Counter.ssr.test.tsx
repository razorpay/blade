import { Counter } from '../Counter';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Counter />', () => {
  it('should limit value with max prop', () => {
    const { getByText } = renderWithSSR(<Counter value={20} max={10} />);
    expect(getByText('10+')).toBeTruthy();
  });
});
