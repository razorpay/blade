import TerminalIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TerminalIcon />', () => {
  it('should render TerminalIcon', () => {
    const renderTree = renderWithTheme(
      <TerminalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
