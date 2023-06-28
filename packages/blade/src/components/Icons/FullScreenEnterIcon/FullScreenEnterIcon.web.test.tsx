import FullScreenEnterIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FullScreenEnterIcon />', () => {
  it('should render FullScreenEnterIcon', () => {
    const { container } = renderWithTheme(
      <FullScreenEnterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
