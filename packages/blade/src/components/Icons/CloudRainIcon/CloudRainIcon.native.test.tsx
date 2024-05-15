import CloudRainIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CloudRainIcon />', () => {
  it('should render CloudRainIcon', () => {
    const renderTree = renderWithTheme(
      <CloudRainIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
