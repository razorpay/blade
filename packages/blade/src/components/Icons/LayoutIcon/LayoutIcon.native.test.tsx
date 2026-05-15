import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LayoutIcon from '.';

describe('<LayoutIcon />', () => {
  it('should render LayoutIcon', () => {
    const renderTree = renderWithTheme(
      <LayoutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
