import BillMeFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BillMeFilledIcon />', () => {
  it('should render BillMeFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BillMeFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
