import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import ChevronRightIcon from '.';

describe('<ChevronRightIcon />', () => {
  it('should render ChevronRightIcon', () => {
    const { container } = renderWithTheme(
      <ChevronRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
