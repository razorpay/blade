import CustomersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const { container } = renderWithTheme(
      <CustomersIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
