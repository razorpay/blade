import FilterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FilterIcon />', () => {
  it('should render FilterIcon', () => {
    const renderTree = renderWithTheme(
      <FilterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
