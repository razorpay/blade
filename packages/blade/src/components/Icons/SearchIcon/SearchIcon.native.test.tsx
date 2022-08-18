import SearchIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SearchIcon />', () => {
  it('should render SearchIcon', () => {
    const renderTree = renderWithTheme(
      <SearchIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
