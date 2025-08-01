import PayrollForCaFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayrollForCaFilledIcon />', () => {
  it('should render PayrollForCaFilledIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForCaFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
