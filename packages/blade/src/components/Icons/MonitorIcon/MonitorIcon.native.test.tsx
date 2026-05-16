import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MonitorIcon from '.';

describe('<MonitorIcon />', () => {
  it('should render MonitorIcon', () => {
    const renderTree = renderWithTheme(
      <MonitorIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
