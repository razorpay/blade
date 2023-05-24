import FacebookIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FacebookIcon />', () => {
  it('should render FacebookIcon', () => {
    const { container } = renderWithTheme(
      <FacebookIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
