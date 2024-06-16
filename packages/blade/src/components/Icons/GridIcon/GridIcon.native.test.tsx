import GridIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<GridIcon />', () => {
  it('should render GridIcon', () => {
    const renderTree = renderWithTheme(
      <GridIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
