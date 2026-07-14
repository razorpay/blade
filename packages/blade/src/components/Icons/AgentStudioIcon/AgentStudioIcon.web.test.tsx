import AgentStudioIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AgentStudioIcon />', () => {
  it('should render AgentStudioIcon', () => {
    const { container } = renderWithTheme(
      <AgentStudioIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
