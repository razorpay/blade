import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import ChevronLeftIcon from '.';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const { container } = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
