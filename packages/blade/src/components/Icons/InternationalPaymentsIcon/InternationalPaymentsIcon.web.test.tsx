import InternationalPaymentsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<InternationalPaymentsIcon />', () => {
  it('should render InternationalPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <InternationalPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
