import BillIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BillIcon />', () => {
  it('should render BillIcon', () => {
    const renderTree = renderWithTheme(
      <BillIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
