import BulkPayoutsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BulkPayoutsIcon />', () => {
  it('should render BulkPayoutsIcon', () => {
    const renderTree = renderWithTheme(
      <BulkPayoutsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
