import { ColorInput } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ColorInput />', () => {
  it('should render', () => {
    const label = 'Enter color';
    const { container } = renderWithSSR(<ColorInput label={label} />);

    expect(container).toMatchSnapshot();
  });
});
