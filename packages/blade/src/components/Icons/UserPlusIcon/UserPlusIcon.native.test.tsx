import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UserPlusIcon from '.';

describe('<UserPlusIcon />', () => {
  it('should render UserPlusIcon', () => {
    const renderTree = renderWithTheme(
      <UserPlusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
