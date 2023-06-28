import CloseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const { container } = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
