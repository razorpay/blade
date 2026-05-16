import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CutIcon from '.';

describe('<CutIcon />', () => {
  it('should render CutIcon', () => {
    const renderTree = renderWithTheme(
      <CutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
