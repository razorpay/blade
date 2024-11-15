import YoutubeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<YoutubeIcon />', () => {
  it('should render YoutubeIcon', () => {
    const { container } = renderWithTheme(
      <YoutubeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
