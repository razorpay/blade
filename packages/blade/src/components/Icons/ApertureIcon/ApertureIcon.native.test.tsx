import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ApertureIcon from '.';

describe('<ApertureIcon />', () => {
  it('should render ApertureIcon', () => {
    const renderTree = renderWithTheme(
      <ApertureIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
