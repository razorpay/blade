import ThumbsDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ThumbsDownIcon />', () => {
  it('should render ThumbsDownIcon', () => {
    const { container } = renderWithTheme(
      <ThumbsDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
