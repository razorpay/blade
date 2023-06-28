import MoonIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MoonIcon />', () => {
  it('should render MoonIcon', () => {
    const renderTree = renderWithTheme(
      <MoonIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
