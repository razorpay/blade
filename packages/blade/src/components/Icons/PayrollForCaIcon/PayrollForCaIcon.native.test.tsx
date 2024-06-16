import PayrollForCaIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollForCaIcon />', () => {
  it('should render PayrollForCaIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollForCaIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
