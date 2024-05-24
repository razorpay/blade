import { SearchInput } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SearchInput />', () => {
  it('should render SearchInput', () => {
    const { container } = renderWithSSR(
      <SearchInput
        label="Search here"
        placeholder="Search payment products, settings, and more"
        helpText="Enter an item to search"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
