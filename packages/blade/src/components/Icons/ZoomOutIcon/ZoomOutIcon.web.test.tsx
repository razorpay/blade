import ZoomOutIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ZoomOutIcon />', () => {
  it('should render ZoomOutIcon', () => {
    const { container } = renderWithTheme(
      <ZoomOutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
