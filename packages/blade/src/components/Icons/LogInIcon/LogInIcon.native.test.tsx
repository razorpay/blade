import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LogInIcon from '.';

describe('<LogInIcon />', () => {
  it('should render LogInIcon', () => {
    const renderTree = renderWithTheme(
      <LogInIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
