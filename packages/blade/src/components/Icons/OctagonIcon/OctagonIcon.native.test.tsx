import renderWithTheme from '~utils/testing/renderWithTheme.native';

import OctagonIcon from '.';

describe('<OctagonIcon />', () => {
  it('should render OctagonIcon', () => {
    const renderTree = renderWithTheme(
      <OctagonIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
