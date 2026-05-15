import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MaximizeIcon from '.';

describe('<MaximizeIcon />', () => {
  it('should render MaximizeIcon', () => {
    const renderTree = renderWithTheme(
      <MaximizeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
