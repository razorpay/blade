import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ForexManagementIcon from '.';

describe('<ForexManagementIcon />', () => {
  it('should render ForexManagementIcon', () => {
    const renderTree = renderWithTheme(
      <ForexManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
