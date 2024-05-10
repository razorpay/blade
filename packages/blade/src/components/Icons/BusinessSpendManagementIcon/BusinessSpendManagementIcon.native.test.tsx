import BusinessSpendManagementIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BusinessSpendManagementIcon />', () => {
  it('should render BusinessSpendManagementIcon', () => {
    const renderTree = renderWithTheme(
      <BusinessSpendManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
