import KeyboardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KeyboardIcon />', () => {
  it('should render KeyboardIcon', () => {
    const { container } = renderWithTheme(
      <KeyboardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
