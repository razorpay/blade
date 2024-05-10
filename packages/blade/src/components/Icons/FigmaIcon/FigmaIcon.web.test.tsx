import FigmaIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FigmaIcon />', () => {
  it('should render FigmaIcon', () => {
    const { container } = renderWithTheme(
      <FigmaIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
