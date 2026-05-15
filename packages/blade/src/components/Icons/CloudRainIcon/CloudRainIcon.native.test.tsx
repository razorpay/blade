import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CloudRainIcon from '.';

describe('<CloudRainIcon />', () => {
  it('should render CloudRainIcon', () => {
    const renderTree = renderWithTheme(
      <CloudRainIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
