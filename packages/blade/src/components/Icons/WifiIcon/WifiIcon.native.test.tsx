import renderWithTheme from '~utils/testing/renderWithTheme.native';

import WifiIcon from '.';

describe('<WifiIcon />', () => {
  it('should render WifiIcon', () => {
    const renderTree = renderWithTheme(
      <WifiIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
