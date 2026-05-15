import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BusinessSpendManagementIcon from '.';

describe('<BusinessSpendManagementIcon />', () => {
  it('should render BusinessSpendManagementIcon', () => {
    const renderTree = renderWithTheme(
      <BusinessSpendManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
