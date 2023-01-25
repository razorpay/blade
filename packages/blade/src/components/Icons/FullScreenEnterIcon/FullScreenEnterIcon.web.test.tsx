import FullScreenEnterIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FullScreenEnterIcon />', () => {
  it('should render FullScreenEnterIcon', () => {
    const { container } = renderWithTheme(
      <FullScreenEnterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
