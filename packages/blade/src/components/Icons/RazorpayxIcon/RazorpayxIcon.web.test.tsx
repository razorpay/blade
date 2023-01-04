import RazorpayxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RazorpayxIcon />', () => {
  it('should render RazorpayxIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
