import CustomersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const renderTree = renderWithTheme(
      <CustomersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
