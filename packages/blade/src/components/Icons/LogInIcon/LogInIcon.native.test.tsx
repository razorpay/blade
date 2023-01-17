import LogInIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const renderTree = renderWithTheme(
      <LogInIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
