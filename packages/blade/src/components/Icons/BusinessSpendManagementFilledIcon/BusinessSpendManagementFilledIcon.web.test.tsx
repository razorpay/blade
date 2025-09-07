import BusinessSpendManagementFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BusinessSpendManagementFilledIcon />', () => {
  it('should render BusinessSpendManagementFilledIcon', () => {
    const { container } = renderWithTheme(
      <BusinessSpendManagementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
