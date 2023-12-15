import LogInIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const renderTree = renderWithTheme(
      <LogInIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
