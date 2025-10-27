import BulkPayoutsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BulkPayoutsFilledIcon />', () => {
  it('should render BulkPayoutsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BulkPayoutsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
