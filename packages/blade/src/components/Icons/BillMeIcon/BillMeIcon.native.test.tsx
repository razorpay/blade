import BillMeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BillMeIcon />', () => {
  it('should render BillMeIcon', () => {
    const renderTree = renderWithTheme(
      <BillMeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
