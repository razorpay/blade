import CloudRainIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CloudRainIcon />', () => {
  it('should render CloudRainIcon', () => {
    const renderTree = renderWithTheme(
      <CloudRainIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
