import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PowerIcon from '.';

describe('<PowerIcon />', () => {
  it('should render PowerIcon', () => {
    const renderTree = renderWithTheme(
      <PowerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
