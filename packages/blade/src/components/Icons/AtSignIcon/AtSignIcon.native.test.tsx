import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AtSignIcon from '.';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const renderTree = renderWithTheme(
      <AtSignIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
