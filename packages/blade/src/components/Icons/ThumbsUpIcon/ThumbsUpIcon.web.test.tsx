import ThumbsUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ThumbsUpIcon />', () => {
  it('should render ThumbsUpIcon', () => {
    const { container } = renderWithTheme(
      <ThumbsUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
