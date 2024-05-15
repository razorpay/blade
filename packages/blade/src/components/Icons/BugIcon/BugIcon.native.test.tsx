import BugIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BugIcon />', () => {
  it('should render BugIcon', () => {
    const renderTree = renderWithTheme(
      <BugIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
