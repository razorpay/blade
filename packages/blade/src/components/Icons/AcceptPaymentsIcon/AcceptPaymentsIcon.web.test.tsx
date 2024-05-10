import AcceptPaymentsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AcceptPaymentsIcon />', () => {
  it('should render AcceptPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <AcceptPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
