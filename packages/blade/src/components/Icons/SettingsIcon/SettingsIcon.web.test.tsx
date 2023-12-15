import SettingsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SettingsIcon />', () => {
  it('should render SettingsIcon', () => {
    const { container } = renderWithTheme(
      <SettingsIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
