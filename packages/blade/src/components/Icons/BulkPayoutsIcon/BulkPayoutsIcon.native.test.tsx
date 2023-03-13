import BulkPayoutsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BulkPayoutsIcon />', () => {
  it('should render BulkPayoutsIcon', () => {
    const renderTree = renderWithTheme(
      <BulkPayoutsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
