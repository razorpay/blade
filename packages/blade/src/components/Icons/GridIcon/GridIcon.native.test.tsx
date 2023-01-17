import GridIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<GridIcon />', () => {
  it('should render GridIcon', () => {
    const renderTree = renderWithTheme(
      <GridIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
