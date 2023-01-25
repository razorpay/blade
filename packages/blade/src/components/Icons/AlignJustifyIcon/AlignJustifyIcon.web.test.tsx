import AlignJustifyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AlignJustifyIcon />', () => {
  it('should render AlignJustifyIcon', () => {
    const { container } = renderWithTheme(
      <AlignJustifyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
