import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SmartCollectIcon from '.';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
