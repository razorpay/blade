import ZoomInIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ZoomInIcon />', () => {
  it('should render ZoomInIcon', () => {
    const { container } = renderWithTheme(
      <ZoomInIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
