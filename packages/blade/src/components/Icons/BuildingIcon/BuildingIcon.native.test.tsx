import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BuildingIcon from '.';

describe('<BuildingIcon />', () => {
  it('should render BuildingIcon', () => {
    const renderTree = renderWithTheme(
      <BuildingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
