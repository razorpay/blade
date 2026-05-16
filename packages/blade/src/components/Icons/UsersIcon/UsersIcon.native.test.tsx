import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UsersIcon from '.';

describe('<UsersIcon />', () => {
  it('should render UsersIcon', () => {
    const renderTree = renderWithTheme(
      <UsersIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
