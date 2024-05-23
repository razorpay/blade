import CompanyRegistrationIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CompanyRegistrationIcon />', () => {
  it('should render CompanyRegistrationIcon', () => {
    const renderTree = renderWithTheme(
      <CompanyRegistrationIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
