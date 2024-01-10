import TwitterIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const { container } = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
