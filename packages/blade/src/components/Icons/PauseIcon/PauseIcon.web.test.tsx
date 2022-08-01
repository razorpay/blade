import PauseIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const { container } = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
