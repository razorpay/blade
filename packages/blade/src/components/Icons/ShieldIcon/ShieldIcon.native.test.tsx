import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ShieldIcon from '.';

describe('<ShieldIcon />', () => {
  it('should render ShieldIcon', () => {
    const renderTree = renderWithTheme(
      <ShieldIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
