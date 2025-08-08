import BulkPayoutsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BulkPayoutsFilledIcon />', () => {
  it('should render BulkPayoutsFilledIcon', () => {
    const { container } = renderWithTheme(
      <BulkPayoutsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
