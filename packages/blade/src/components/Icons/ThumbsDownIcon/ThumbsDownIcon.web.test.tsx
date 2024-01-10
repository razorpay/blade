import ThumbsDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ThumbsDownIcon />', () => {
  it('should render ThumbsDownIcon', () => {
    const { container } = renderWithTheme(
      <ThumbsDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
