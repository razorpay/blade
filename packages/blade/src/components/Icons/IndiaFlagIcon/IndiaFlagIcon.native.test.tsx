import renderWithTheme from '~utils/testing/renderWithTheme.native';

import IndiaFlagIcon from '.';

describe('<IndiaFlagIcon />', () => {
  it('should render IndiaFlagIcon', () => {
    const renderTree = renderWithTheme(
      <IndiaFlagIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
