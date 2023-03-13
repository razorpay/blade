import BulkPayoutsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BulkPayoutsIcon />', () => {
  it('should render BulkPayoutsIcon', () => {
    const { container } = renderWithTheme(
      <BulkPayoutsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
