import ClipboardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ClipboardIcon />', () => {
  it('should render ClipboardIcon', () => {
    const { container } = renderWithTheme(
      <ClipboardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
