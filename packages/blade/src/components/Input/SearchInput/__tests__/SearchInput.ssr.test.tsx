import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { SearchInput } from '../';

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
