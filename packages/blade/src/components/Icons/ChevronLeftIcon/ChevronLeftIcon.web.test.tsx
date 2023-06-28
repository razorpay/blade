import ChevronLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const { container } = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
