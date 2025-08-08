import CompanyRegistrationFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CompanyRegistrationFilledIcon />', () => {
  it('should render CompanyRegistrationFilledIcon', () => {
    const { container } = renderWithTheme(
      <CompanyRegistrationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
