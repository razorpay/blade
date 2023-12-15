import GithubIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GithubIcon />', () => {
  it('should render GithubIcon', () => {
    const { container } = renderWithTheme(
      <GithubIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
