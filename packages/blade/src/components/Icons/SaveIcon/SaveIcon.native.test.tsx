import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SaveIcon from '.';

describe('<SaveIcon />', () => {
  it('should render SaveIcon', () => {
    const renderTree = renderWithTheme(
      <SaveIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
