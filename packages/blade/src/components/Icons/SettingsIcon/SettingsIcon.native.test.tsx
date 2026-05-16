import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SettingsIcon from '.';

describe('<SettingsIcon />', () => {
  it('should render SettingsIcon', () => {
    const renderTree = renderWithTheme(
      <SettingsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
