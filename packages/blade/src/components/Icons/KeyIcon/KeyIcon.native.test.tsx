import renderWithTheme from '~utils/testing/renderWithTheme.native';

import KeyIcon from '.';

describe('<KeyIcon />', () => {
  it('should render KeyIcon', () => {
    const renderTree = renderWithTheme(
      <KeyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
