import BulkPayoutsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BulkPayoutsIcon />', () => {
  it('should render BulkPayoutsIcon', () => {
    const { container } = renderWithTheme(
      <BulkPayoutsIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
