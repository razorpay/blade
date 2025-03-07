import TopLeftSharpCornerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TopLeftSharpCornerIcon />', () => {
  it('should render TopLeftSharpCornerIcon', () => {
    const { container } = renderWithTheme(
      <TopLeftSharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
