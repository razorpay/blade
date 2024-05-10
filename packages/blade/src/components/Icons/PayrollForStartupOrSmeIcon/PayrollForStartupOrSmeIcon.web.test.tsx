import PayrollForStartupOrSmeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayrollForStartupOrSmeIcon />', () => {
  it('should render PayrollForStartupOrSmeIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForStartupOrSmeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
