import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LayersIcon from '.';

describe('<LayersIcon />', () => {
  it('should render LayersIcon', () => {
    const renderTree = renderWithTheme(
      <LayersIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
