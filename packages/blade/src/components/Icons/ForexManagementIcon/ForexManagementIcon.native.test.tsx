import ForexManagementIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ForexManagementIcon />', () => {
  it('should render ForexManagementIcon', () => {
    const renderTree = renderWithTheme(
      <ForexManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
