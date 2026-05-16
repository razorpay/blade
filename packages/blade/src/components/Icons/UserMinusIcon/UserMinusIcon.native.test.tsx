import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UserMinusIcon from '.';

describe('<UserMinusIcon />', () => {
  it('should render UserMinusIcon', () => {
    const renderTree = renderWithTheme(
      <UserMinusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
