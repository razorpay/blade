import ChevronRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronRightIcon />', () => {
  it('should render ChevronRightIcon', () => {
    const { container } = renderWithTheme(
      <ChevronRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
