import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CoinsIcon from '.';

describe('<CoinsIcon />', () => {
  it('should render CoinsIcon', () => {
    const renderTree = renderWithTheme(
      <CoinsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
