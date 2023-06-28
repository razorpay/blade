import ThumbsUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ThumbsUpIcon />', () => {
  it('should render ThumbsUpIcon', () => {
    const { container } = renderWithTheme(
      <ThumbsUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
