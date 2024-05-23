import BuildingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BuildingIcon />', () => {
  it('should render BuildingIcon', () => {
    const renderTree = renderWithTheme(
      <BuildingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
