import SettingsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SettingsIcon />', () => {
  it('should render SettingsIcon', () => {
    const { container } = renderWithTheme(
      <SettingsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
