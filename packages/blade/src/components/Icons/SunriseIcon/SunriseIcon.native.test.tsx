import SunriseIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SunriseIcon />', () => {
  it('should render SunriseIcon', () => {
    const renderTree = renderWithTheme(
      <SunriseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
