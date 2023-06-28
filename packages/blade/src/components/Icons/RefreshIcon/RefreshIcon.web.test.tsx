import RefreshIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RefreshIcon />', () => {
  it('should render RefreshIcon', () => {
    const { container } = renderWithTheme(
      <RefreshIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
