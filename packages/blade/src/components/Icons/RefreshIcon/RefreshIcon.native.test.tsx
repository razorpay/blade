import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RefreshIcon from '.';

describe('<RefreshIcon />', () => {
  it('should render RefreshIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
