import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PauseIcon from '.';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const renderTree = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
