import BugIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BugIcon />', () => {
  it('should render BugIcon', () => {
    const { container } = renderWithTheme(
      <BugIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
