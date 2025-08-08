import AcceptPaymentsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AcceptPaymentsFilledIcon />', () => {
  it('should render AcceptPaymentsFilledIcon', () => {
    const { container } = renderWithTheme(
      <AcceptPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
