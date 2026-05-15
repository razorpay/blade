import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SearchIcon from './';

describe('<SearchIcon />', () => {
  it('should render SearchIcon', () => {
    const { container } = renderWithTheme(
      <SearchIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
