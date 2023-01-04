import MoonIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MoonIcon />', () => {
  it('should render MoonIcon', () => {
    const renderTree = renderWithTheme(
      <MoonIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
