import CustomersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const renderTree = renderWithTheme(
      <CustomersIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
