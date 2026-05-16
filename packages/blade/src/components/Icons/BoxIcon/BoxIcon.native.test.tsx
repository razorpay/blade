import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BoxIcon from '.';

describe('<BoxIcon />', () => {
  it('should render BoxIcon', () => {
    const renderTree = renderWithTheme(
      <BoxIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
