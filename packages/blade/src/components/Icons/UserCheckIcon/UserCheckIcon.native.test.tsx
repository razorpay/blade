import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UserCheckIcon from '.';

describe('<UserCheckIcon />', () => {
  it('should render UserCheckIcon', () => {
    const renderTree = renderWithTheme(
      <UserCheckIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
