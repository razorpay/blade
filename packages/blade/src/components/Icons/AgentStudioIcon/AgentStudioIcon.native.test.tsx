import AgentStudioIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AgentStudioIcon />', () => {
  it('should render AgentStudioIcon', () => {
    const renderTree = renderWithTheme(
      <AgentStudioIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
