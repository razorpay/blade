import SettingsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SettingsIcon />', () => {
  it('should render SettingsIcon', () => {
    const renderTree = renderWithTheme(
      <SettingsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
