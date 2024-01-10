import GithubIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GithubIcon />', () => {
  it('should render GithubIcon', () => {
    const { container } = renderWithTheme(
      <GithubIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
