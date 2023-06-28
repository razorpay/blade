import FilterIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FilterIcon />', () => {
  it('should render FilterIcon', () => {
    const renderTree = renderWithTheme(
      <FilterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
