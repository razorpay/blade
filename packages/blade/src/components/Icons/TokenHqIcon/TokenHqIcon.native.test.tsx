import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TokenHqIcon from '.';

describe('<TokenHqIcon />', () => {
  it('should render TokenHqIcon', () => {
    const renderTree = renderWithTheme(
      <TokenHqIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
