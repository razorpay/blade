import CompanyRegistrationFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CompanyRegistrationFilledIcon />', () => {
  it('should render CompanyRegistrationFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CompanyRegistrationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
