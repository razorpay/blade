import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SettlementsIcon from '.';

describe('<SettlementsIcon />', () => {
  it('should render SettlementsIcon', () => {
    const renderTree = renderWithTheme(
      <SettlementsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
