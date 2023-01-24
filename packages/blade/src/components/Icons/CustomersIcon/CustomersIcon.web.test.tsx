import CustomersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const { container } = renderWithTheme(
      <CustomersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
