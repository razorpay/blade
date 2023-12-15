import AlignJustifyIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlignJustifyIcon />', () => {
  it('should render AlignJustifyIcon', () => {
    const { container } = renderWithTheme(
      <AlignJustifyIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
