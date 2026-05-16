import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BugIcon from '.';

describe('<BugIcon />', () => {
  it('should render BugIcon', () => {
    const renderTree = renderWithTheme(
      <BugIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
