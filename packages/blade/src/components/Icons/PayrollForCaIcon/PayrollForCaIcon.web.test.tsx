import PayrollForCaIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayrollForCaIcon />', () => {
  it('should render PayrollForCaIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForCaIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
