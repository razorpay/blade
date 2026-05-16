import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SettingsIcon from './';

describe('<SettingsIcon />', () => {
  it('should render SettingsIcon', () => {
    const { container } = renderWithTheme(
      <SettingsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
