import CompanyRegistrationIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CompanyRegistrationIcon />', () => {
  it('should render CompanyRegistrationIcon', () => {
    const { container } = renderWithTheme(
      <CompanyRegistrationIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
