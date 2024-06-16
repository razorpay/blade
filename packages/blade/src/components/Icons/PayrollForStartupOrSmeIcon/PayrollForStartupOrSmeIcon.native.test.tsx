import PayrollForStartupOrSmeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollForStartupOrSmeIcon />', () => {
  it('should render PayrollForStartupOrSmeIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForStartupOrSmeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
