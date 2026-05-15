import renderWithTheme from '~utils/testing/renderWithTheme.native';

import HashIcon from '.';

describe('<HashIcon />', () => {
  it('should render HashIcon', () => {
    const renderTree = renderWithTheme(
      <HashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
