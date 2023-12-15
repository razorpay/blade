import PauseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const { container } = renderWithTheme(
      <PauseIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
