import TerminalIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TerminalIcon />', () => {
  it('should render TerminalIcon', () => {
    const { container } = renderWithTheme(
      <TerminalIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
