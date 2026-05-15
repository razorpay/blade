import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BusinessSpendManagementFilledIcon from '.';

describe('<BusinessSpendManagementFilledIcon />', () => {
  it('should render BusinessSpendManagementFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BusinessSpendManagementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
