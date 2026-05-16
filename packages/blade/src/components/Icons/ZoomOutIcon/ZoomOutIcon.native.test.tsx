import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ZoomOutIcon from '.';

describe('<ZoomOutIcon />', () => {
  it('should render ZoomOutIcon', () => {
    const renderTree = renderWithTheme(
      <ZoomOutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
